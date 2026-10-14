"use client";

import { useId, useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import { Icon } from "./Icons";
import { copy } from "@/config/copy";

interface DropBoxProps {
  label?: string;
  helper?: string;
  accept?: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  onDragStateChange?: (dragging: boolean) => void;
  limitsLine?: string;
  compact?: boolean;
}

export function DropBox({
  label = copy.drop.home,
  helper = copy.drop.homeHelp,
  accept,
  multiple = false,
  onFiles,
  onDragStateChange,
  limitsLine,
  compact = false,
}: DropBoxProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const setDrag = (value: boolean) => {
    setDragging(value);
    onDragStateChange?.(value);
  };

  const handleFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    onFiles(Array.from(list));
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDrag(false);
    handleFiles(e.dataTransfer.files);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label={copy.drop.inputLabel}
        onClick={() => inputRef.current?.click()}
        onKeyDown={onKeyDown}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={(e) => {
          if (e.currentTarget.contains(e.relatedTarget as Node)) return;
          setDrag(false);
        }}
        onDrop={onDrop}
        className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-box border-3 border-dashed text-center transition-colors ${
          compact ? "min-h-[190px] gap-2" : "min-h-[260px] gap-3 sm:min-h-[340px]"
        } ${dragging ? "border-solid bg-highlight" : "border-ink bg-surface hover:bg-ground"}`}
      >
        <Icon name="upload" size={compact ? 44 : 84} />
        <p className={`px-4 font-bold ${compact ? "text-[20px]" : "text-[26px] sm:text-[30px]"}`}>
          {dragging ? copy.drop.dragOver : label}
        </p>
        <p className="text-helper text-muted">{copy.drop.chooseFileAlt}</p>
        <span
          className={`mt-1 inline-flex items-center gap-3 rounded border-2 border-ink bg-orange font-bold text-ink ${
            compact ? "min-h-[52px] px-6 text-[20px]" : "min-h-[60px] px-8 text-[24px]"
          }`}
        >
          {copy.drop.chooseFile}
        </span>
        <p className="px-4 text-helper text-muted">{helper}</p>
        {limitsLine && <p className="text-[16px] text-muted">{limitsLine}</p>}
      </div>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
