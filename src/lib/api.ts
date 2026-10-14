/**
 * API client (doc 09). One place that talks to the backend. A mock mode lets the
 * whole UI run without a server (NEXT_PUBLIC_USE_MOCK_API=true or ?mock=1).
 */

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000/api/v1";

export interface ApiTool {
  slug: string;
  status?: string;
  min_files?: number;
  max_files?: number;
  max_file_mb?: number;
  max_total_mb?: number;
  max_pages?: number;
}

export interface CreateJobResult {
  jobId: string;
  status: string;
  deleteToken: string;
}

export interface JobProgress {
  percent?: number;
  message?: string;
}

export interface JobOutput {
  name: string;
  size?: number;
  downloadUrl?: string;
}

export interface JobResult {
  ok: boolean;
  outputs: JobOutput[];
  stats?: { beforeBytes?: number; afterBytes?: number };
  /** Set by on-device tools (e.g. OCR) instead of downloadable outputs. */
  text?: string;
  pages?: number;
}

export interface JobStatus {
  status: "queued" | "processing" | "completed" | "failed";
  progress?: JobProgress;
  result?: JobResult;
  error?: { code: string; message?: string };
}

export function isMockMode(): boolean {
  if (process.env.NEXT_PUBLIC_USE_MOCK_API === "true") return true;
  if (typeof window !== "undefined") {
    return new URLSearchParams(window.location.search).get("mock") === "1";
  }
  return false;
}

export function downloadUrl(jobId: string, token: string): string {
  return `${API_BASE}/jobs/${jobId}/download?token=${encodeURIComponent(token)}`;
}

export async function fetchTools(): Promise<ApiTool[]> {
  if (isMockMode()) return [];
  try {
    const res = await fetch(`${API_BASE}/tools`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = (await res.json()) as ApiTool[] | { tools?: ApiTool[] };
    return Array.isArray(data) ? data : data.tools ?? [];
  } catch {
    return [];
  }
}

export interface UploadArgs {
  tool: string;
  files: File[];
  options: Record<string, unknown>;
  onProgress?: (percent: number) => void;
  signal?: AbortSignal;
}

export function createJob(args: UploadArgs): Promise<CreateJobResult> {
  if (isMockMode()) return mockCreateJob(args);
  return new Promise((resolve, reject) => {
    const form = new FormData();
    for (const file of args.files) form.append("files", file, file.name);
    form.append("options", JSON.stringify(args.options));

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE}/jobs/${args.tool}`);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && args.onProgress) args.onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText) as CreateJobResult);
        } catch {
          reject({ code: "ENGINE_FAILED" });
        }
      } else {
        reject(parseError(xhr.responseText));
      }
    };
    xhr.onerror = () => reject({ code: "NETWORK" });
    xhr.onabort = () => reject({ code: "ABORTED" });
    args.signal?.addEventListener("abort", () => xhr.abort());
    xhr.send(form);
  });
}

export async function getJob(jobId: string): Promise<JobStatus> {
  if (isMockMode()) return mockJobStatus(jobId);
  try {
    const res = await fetch(`${API_BASE}/jobs/${jobId}`, { cache: "no-store" });
    if (!res.ok) return { status: "failed", error: { code: "JOB_NOT_FOUND" } };
    return (await res.json()) as JobStatus;
  } catch {
    return { status: "failed", error: { code: "NETWORK" } };
  }
}

export async function deleteJob(jobId: string, token: string): Promise<void> {
  if (isMockMode()) return;
  try {
    await fetch(`${API_BASE}/jobs/${jobId}?token=${encodeURIComponent(token)}`, { method: "DELETE" });
  } catch {
    // Deleting is best-effort; files still expire automatically.
  }
}

function parseError(text: string): { code: string } {
  try {
    const data = JSON.parse(text) as { error?: { code?: string } };
    return { code: data.error?.code ?? "ENGINE_FAILED" };
  } catch {
    return { code: "ENGINE_FAILED" };
  }
}

/* ------------------------------- Mock mode ------------------------------- */

const mockJobs = new Map<string, { started: number; files: number; outputName: string }>();

function mockCreateJob(args: UploadArgs): Promise<CreateJobResult> {
  return new Promise((resolve) => {
    let pct = 0;
    const tick = setInterval(() => {
      pct += 20;
      args.onProgress?.(Math.min(100, pct));
      if (pct >= 100) {
        clearInterval(tick);
        const jobId = `mock-${Date.now()}`;
        const outputName = args.files[0]?.name.replace(/\.[^.]+$/, "") + "-ready.pdf";
        mockJobs.set(jobId, { started: Date.now(), files: args.files.length, outputName });
        resolve({ jobId, status: "queued", deleteToken: "mock-token" });
      }
    }, 150);
  });
}

async function mockJobStatus(jobId: string): Promise<JobStatus> {
  const job = mockJobs.get(jobId);
  if (!job) return { status: "failed", error: { code: "JOB_NOT_FOUND" } };
  const elapsed = Date.now() - job.started;
  if (elapsed < 2000) return { status: "processing", progress: { percent: Math.min(90, elapsed / 25) } };
  return {
    status: "completed",
    result: { ok: true, outputs: [{ name: job.outputName, downloadUrl: "#" }] },
  };
}
