"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ToolConfig } from "@/config/tools.config";
import { copy } from "@/config/copy";
import { DropBox } from "@/components/ui/DropBox";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Banner } from "@/components/ui/Banner";
import { Icon } from "@/components/ui/Icons";
import { CapsuleSelect } from "@/components/ui/CapsuleSelect";
import { OptionsPanel, defaultOptionValues, type OptionValues } from "./OptionsPanel";
import { detectKind, kindWord } from "@/lib/fileKinds";
import { errorText } from "@/lib/errorText";
import { toolsForKinds } from "@/lib/suggest";
import { runBrowserOcr } from "@/lib/ocr";
import {
  createJob,
  deleteJob,
  downloadUrl,
  getJob,
  type JobResult,
} from "@/lib/api";
import { usePendingFiles, type PendingFile } from "@/state/pendingFiles";
import { formatBytes, truncateMiddle } from "@/lib/format";

type WidgetState = "idle" | "fileChosen" | "uploading" | "processing" | "done" | "error";

function acceptString(tool: ToolConfig): string {
  return tool.accepts.extensions.map((e) => `.${e}`).join(",");
}

export function ToolWidget({
  tool,
  compact = false,
  onChangeTool,
}: {
  tool: ToolConfig;
  compact?: boolean;
  onChangeTool?: (tool: ToolConfig) => void;
}) {
  const pending = usePendingFiles();
  const router = useRouter();
  const [state, setState] = useState<WidgetState>("idle");
  const [files, setFiles] = useState<PendingFile[]>([]);
  const [values, setValues] = useState<OptionValues>(() => defaultOptionValues(tool.options));
  const [wrongKind, setWrongKind] = useState<string | null>(null);
  const [uploadPct, setUploadPct] = useState(0);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<JobResult | null>(null);
  const [job, setJob] = useState<{ jobId: string; token: string } | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadedSeed = useRef<number>(-1);
  const downloadRef = useRef<HTMLAnchorElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLInputElement>(null);

  const fits = useCallback(
    (pf: PendingFile): boolean => tool.accepts.kinds.includes(pf.kind),
    [tool]
  );

  const loadFiles = useCallback(
    (incoming: PendingFile[]) => {
      if (incoming.length === 0) return;
      const good = incoming.filter(fits);
      if (good.length === 0) {
        setWrongKind(incoming[0].kind);
        return;
      }
      const max = tool.accepts.maxFiles;
      setFiles(good.slice(0, max));
      setWrongKind(null);
      setState("fileChosen");
    },
    [fits, tool.accepts.maxFiles]
  );

  // Pending files from the smart drop load automatically on arrival (doc 05/07).
  useEffect(() => {
    if (pending.seed === loadedSeed.current) return;
    loadedSeed.current = pending.seed;
    if (pending.files.length > 0 && state === "idle") loadFiles(pending.files);
  }, [pending.seed, pending.files, state, loadFiles]);

  const onDrop = useCallback(
    async (incoming: File[]) => {
      setErrorMessage(null);
      const detected: PendingFile[] = [];
      for (const file of incoming) {
        const info = await detectKind(file);
        detected.push({ file, kind: info.kind });
        if (info.mismatch) {
          setErrorMessage(copy.smartDrop.wrongExtension(info.ext, kindWord(info.kind)));
        }
      }
      loadFiles(detected);
    },
    [loadFiles]
  );

  const start = useCallback(async () => {
    if (files.length === 0) return;
    setErrorMessage(null);
    setNotice(null);
    setCopied(false);
    abortRef.current = new AbortController();

    // On-device tools (ocr-pdf) never leave the browser.
    if (tool.runsOn === "browser") {
      setState("processing");
      setProgress(0);
      try {
        const outcome = await runBrowserOcr({
          file: files[0].file,
          language: String(values.language ?? "eng"),
          maxPages: tool.limits.maxPages,
          onProgress: (p) => setProgress(p.percent),
          onNotice: setNotice,
          signal: abortRef.current.signal,
        });
        setResult({ ok: true, outputs: [], text: outcome.text, pages: outcome.pages });
        setState("done");
      } catch (err) {
        const code = (err as { code?: string })?.code;
        if (code === "ABORTED") {
          setState("fileChosen");
          return;
        }
        setErrorMessage(errorText(code ?? "ENGINE_FAILED"));
        setState("error");
      }
      return;
    }

    setState("uploading");
    setUploadPct(0);
    setProgress(0);
    try {
      const created = await createJob({
        tool: tool.apiTool,
        files: files.map((f) => f.file),
        options: values,
        onProgress: setUploadPct,
        signal: abortRef.current.signal,
      });
      setJob({ jobId: created.jobId, token: created.deleteToken });
      setState("processing");
      poll(created.jobId);
    } catch (err) {
      const code = (err as { code?: string })?.code;
      if (code === "ABORTED") return;
      setErrorMessage(errorText(code ?? "ENGINE_FAILED"));
      setState("error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, tool.apiTool, values]);

  const poll = useCallback((jobId: string) => {
    const startedAt = Date.now();
    const tick = async () => {
      const status = await getJob(jobId);
      if (status.status === "completed" && status.result) {
        // Normalise: the mock returns a placeholder download URL.
        const outputs = status.result.outputs.map((o) => ({ ...o }));
        setResult({ ok: true, outputs, stats: status.result.stats });
        setState("done");
        return;
      }
      if (status.status === "failed") {
        setErrorMessage(errorText(status.error?.code ?? "ENGINE_FAILED"));
        setState("error");
        return;
      }
      setProgress(status.progress?.percent ?? 0);
      const interval = Date.now() - startedAt > 15000 ? 3000 : 1000;
      pollRef.current = setTimeout(tick, interval);
    };
    void tick();
  }, []);

  useEffect(() => () => {
    if (pollRef.current) clearTimeout(pollRef.current);
    abortRef.current?.abort();
  }, []);

  useEffect(() => {
    if (state === "done") downloadRef.current?.focus({ preventScroll: true });
    if (state === "error") errorRef.current?.focus({ preventScroll: true });
  }, [state]);

  const reset = useCallback(() => {
    pending.clear();
    if (pollRef.current) clearTimeout(pollRef.current);
    abortRef.current?.abort();
    if (job) void deleteJob(job.jobId, job.token);
    setFiles([]);
    setValues(defaultOptionValues(tool.options));
    setState("idle");
    setJob(null);
    setResult(null);
    setProgress(0);
    setUploadPct(0);
    setErrorMessage(null);
    setNotice(null);
    setCopied(false);
    setWrongKind(null);
  }, [job, pending, tool.options]);

  const removeFile = useCallback(
    (index: number) => {
      setFiles((prev) => {
        const next = prev.filter((_, i) => i !== index);
        if (next.length === 0) setState("idle");
        return next;
      });
    },
    []
  );

  // Re-run with whatever options are set now (old job is dropped first).
  const rerun = useCallback(() => {
    if (pollRef.current) clearTimeout(pollRef.current);
    if (job) void deleteJob(job.jobId, job.token);
    setJob(null);
    setResult(null);
    setProgress(0);
    setUploadPct(0);
    setErrorMessage(null);
    void start();
  }, [job, start]);

  // Go back to the upload view and open the file picker straight away. The click is
  // dispatched inside this user gesture so the browser allows the picker to open.
  const chooseDifferent = useCallback(() => {
    reset();
    pickerRef.current?.click();
  }, [reset]);

  const onPick = useCallback(
    (list: FileList | null) => {
      if (list && list.length > 0) void onDrop(Array.from(list));
    },
    [onDrop]
  );

  const busy = state === "uploading" || state === "processing";

  // On-device result text -> a downloadable .txt blob (no server involved).
  const textBlobUrl = useMemo(
    () => (result?.text ? URL.createObjectURL(new Blob([result.text], { type: "text/plain" })) : null),
    [result?.text]
  );
  useEffect(() => () => {
    if (textBlobUrl) URL.revokeObjectURL(textBlobUrl);
  }, [textBlobUrl]);

  // Tools that fit the current file — lets the user change the converter at any stage.
  const fitTools = useMemo(
    () => (files.length > 0 ? toolsForKinds(files.map((f) => f.kind)) : []),
    [files]
  );

  const switchTool = useCallback(
    (slug: string) => {
      const next = fitTools.find((t) => t.slug === slug);
      if (!next || next.slug === tool.slug) return;
      pending.setFiles(files);
      if (onChangeTool) {
        onChangeTool(next);
        return;
      }
      router.push(`/${next.slug}`);
    },
    [files, fitTools, onChangeTool, pending, router, tool.slug]
  );

  return (
    <div className={compact ? "flex w-full flex-col gap-4" : "mx-auto flex w-full max-w-widget flex-col gap-5"}>
      {/* Banner: wrong file type on this tool page (doc 05, section 8). */}
      {wrongKind && (
        <Banner
          tone="warning"
          title={copy.smartDrop.wrongFileOnTool(kindWord(wrongKind as never), tool.actionLabel.toLowerCase())}
          action={
            <Link
              href="/"
              className="min-h-[48px] rounded border-2 border-ink bg-orange px-4 py-2 text-helper font-bold"
            >
              See what we can do
            </Link>
          }
        >
          <span />
        </Banner>
      )}

      {files.length === 0 ? (
        <DropBox
          label={copy.drop.tool(tool.accepts.kinds.includes("pdf") ? "PDF" : "file")}
          helper={copy.drop.homeHelp}
          accept={acceptString(tool)}
          multiple={tool.accepts.multiple}
          limitsLine={copy.drop.limits(tool.limits.maxFileMB)}
          compact={compact}
          onFiles={(f) => void onDrop(f)}
        />
      ) : (
        <div className="rounded-2xl border-2 border-ink bg-surface p-4 sm:p-5">
          <div className="space-y-4">
            {/* Change the converter: the "choose what to do" dropdown stays available every stage. */}
            {fitTools.length > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-line pb-3">
                <span className="text-helper font-bold text-muted">{copy.drop.chooseAction}</span>
                <CapsuleSelect
                  options={fitTools.map((t) => ({
                    value: t.slug,
                    label: t.plainLabel,
                    badge: t.status === "beta" ? "Beta" : undefined,
                  }))}
                  value={tool.slug}
                  variant="plain"
                  placeholder={copy.drop.chooseAction}
                  ariaLabel={copy.drop.chooseAction}
                  onChange={switchTool}
                />
              </div>
            )}

            {/* Files */}
            <ul className="divide-y divide-line">
              {files.map((f, i) => (
                <li key={i} className="flex items-center gap-3 py-2 first:pt-0">
                  <Icon name="file" size={22} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold" title={f.file.name}>
                      {truncateMiddle(f.file.name, 44)}
                    </p>
                    <p className="text-helper text-muted">
                      {formatBytes(f.file.size)}
                      {f.facts?.pageCount !== undefined
                        ? ` · ${f.facts.pageCount} ${f.facts.pageCount === 1 ? "page" : "pages"}`
                        : ""}
                      {` · ${kindWord(f.kind)}`}
                    </p>
                  </div>
                  {!busy && (
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="flex min-h-[40px] items-center gap-1 rounded-full border-2 border-ink px-3 text-helper font-bold hover:bg-highlight"
                      aria-label={`${copy.drop.remove} ${f.file.name}`}
                    >
                      <Icon name="close" size={16} />
                      {copy.drop.remove}
                    </button>
                  )}
                </li>
              ))}
            </ul>

            {/* Options stay on screen for the whole flow (including while converting) so the
                user can change them right up to the final step, then hit Convert again. */}
            {tool.options.length > 0 && (
              <OptionsPanel options={tool.options} values={values} onChange={(id, v) => setValues((s) => ({ ...s, [id]: v }))} />
            )}

            {/* Uploading */}
            {state === "uploading" && (
              <div className="space-y-2">
                <p className="text-[20px] font-bold">{copy.steps.sending}</p>
                <ProgressBar percent={uploadPct} label="Upload progress" />
                <button
                  type="button"
                  onClick={() => abortRef.current?.abort()}
                  className="text-helper font-bold underline underline-offset-[5px]"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Processing */}
            {state === "processing" && (
              <div className="space-y-2">
                <ProgressBar percent={progress} label="Conversion progress" />
                <p className="text-helper text-muted">{copy.steps.working}</p>
                <button type="button" onClick={reset} className="text-helper font-bold underline underline-offset-[5px]">
                  {copy.steps.stopAndRestart}
                </button>
              </div>
            )}

            {/* Run */}
            {(state === "fileChosen" || state === "idle") && (
              <Button size={compact ? "md" : "lg"} disabled={files.length === 0} onClick={() => void start()}>
                {tool.actionLabel}
              </Button>
            )}

            {/* Result */}
            {state === "done" && result && (
              <div className="space-y-3">
                {result.text !== undefined ? (
                  <>
                    <Banner tone="success" role="status" title={copy.ocr.ready}>
                      {copy.ocr.pagesRead(result.pages ?? 0)}
                    </Banner>
                    <textarea
                      readOnly
                      value={result.text || copy.ocr.empty}
                      rows={10}
                      className="w-full resize-y rounded border-2 border-ink bg-surface p-3 font-mono text-helper"
                      aria-label={copy.ocr.ready}
                    />
                    {notice && <p className="text-helper text-muted">{notice}</p>}
                    <div className="flex flex-wrap gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          void navigator.clipboard?.writeText(result.text ?? "").then(() => {
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          });
                        }}
                        className="inline-flex min-h-[56px] items-center justify-center rounded border-2 border-ink bg-surface px-6 text-helper font-bold hover:bg-highlight"
                      >
                        {copied ? copy.ocr.copied : copy.ocr.copy}
                      </button>
                      <a
                        href={textBlobUrl ?? "#"}
                        download="extracted-text.txt"
                        className="inline-flex min-h-[56px] items-center justify-center rounded border-2 border-ink bg-orange px-6 text-helper font-bold text-ink hover:bg-orange-hover"
                      >
                        {copy.ocr.download}
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <Banner tone="success" role="status" title={copy.steps.ready}>
                      {result.outputs[0]?.name}
                      {result.outputs[0]?.size ? ` · ${formatBytes(result.outputs[0].size!)}` : ""}
                    </Banner>
                    <a
                      ref={downloadRef}
                      href={job ? downloadUrl(job.jobId, job.token) : "#"}
                      className={`inline-flex w-full items-center justify-center gap-3 rounded border-2 border-ink bg-orange font-bold text-ink hover:bg-orange-hover ${
                        compact ? "min-h-[64px] px-8 text-[22px]" : "min-h-[92px] px-10 text-[26px]"
                      }`}
                    >
                      {result.outputs.length > 1 ? "Download ZIP of files" : "Download your file"}
                    </a>
                  </>
                )}
                {/* Options stay editable here too, so this re-runs with the new settings. */}
                <button
                  type="button"
                  onClick={rerun}
                  className="inline-flex min-h-[56px] w-full items-center justify-center rounded border-2 border-ink bg-surface px-8 text-helper font-bold hover:bg-highlight"
                >
                  {copy.steps.reconvert}
                </button>
                <div className="flex flex-wrap gap-4">
                  <button type="button" onClick={chooseDifferent} className="text-helper font-bold underline underline-offset-[5px]">
                    {copy.steps.another}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (job) void deleteJob(job.jobId, job.token);
                      reset();
                    }}
                    className="text-helper font-bold underline underline-offset-[5px]"
                  >
                    {copy.steps.deleteNow}
                  </button>
                </div>
              </div>
            )}

            {/* Choose a different file */}
            {!busy && state !== "done" && (
              <div className="pt-4">
                <button type="button" onClick={chooseDifferent} className="text-helper font-bold underline underline-offset-[5px]">
                  {copy.drop.chooseDifferent}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {state === "error" && (
        <div ref={errorRef} tabIndex={-1}>
          <Banner
            tone="error"
            title="We could not finish that"
            action={
              <Button size="md" variant="secondary" onClick={() => setState("fileChosen")}>
                Try again
              </Button>
            }
          >
            {errorMessage}
          </Banner>
        </div>
      )}

      {/* Always-mounted picker so "Choose a different file" can open it within the click gesture. */}
      <input
        ref={pickerRef}
        type="file"
        accept={acceptString(tool)}
        multiple={tool.accepts.multiple}
        tabIndex={-1}
        aria-hidden="true"
        className="sr-only"
        onChange={(e) => {
          onPick(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
