"use client";

import { useState } from "react";
import type { ToolOption } from "@/config/tools.config";

export type OptionValues = Record<string, string | number | boolean>;

interface OptionsPanelProps {
  options: ToolOption[];
  values: OptionValues;
  onChange: (id: string, value: string | number | boolean) => void;
}

export function defaultOptionValues(options: ToolOption[]): OptionValues {
  const out: OptionValues = {};
  for (const o of options) out[o.id] = o.default;
  return out;
}

export function OptionsPanel({ options, values, onChange }: OptionsPanelProps) {
  if (options.length === 0) return null;

  return (
    <div className="space-y-6">
      {options.map((option) => (
        <div key={option.id}>
          <FieldLabel option={option} />
          <Control option={option} value={values[option.id]} onChange={onChange} />
          {option.helper && option.type !== "radio" && (
            <p className="mt-1 text-[16px] text-muted">{option.helper}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function FieldLabel({ option }: { option: ToolOption }) {
  if (option.type === "radio") {
    return <p className="mb-2 text-[20px] font-bold">{option.label}</p>;
  }
  return (
    <label htmlFor={`opt-${option.id}`} className="mb-2 block text-[20px] font-bold">
      {option.label}
    </label>
  );
}

function Control({
  option,
  value,
  onChange,
}: {
  option: ToolOption;
  value: string | number | boolean | undefined;
  onChange: (id: string, value: string | number | boolean) => void;
}) {
  const id = `opt-${option.id}`;
  const inputClass =
    "min-h-[56px] w-full rounded border-2 border-ink bg-surface px-4 text-[20px] focus-visible:bg-highlight";

  switch (option.type) {
    case "radio":
      return (
        <div className="flex flex-wrap gap-3">
          {option.choices?.map((choice) => {
            const selected = value === choice.value;
            return (
              <label
                key={choice.value}
                className={`flex min-h-[72px] cursor-pointer flex-col justify-center rounded border-2 border-ink px-4 py-2 ${
                  selected ? "bg-highlight" : "bg-surface hover:bg-ground"
                }`}
              >
                <span className="flex items-center gap-2 text-[20px] font-bold">
                  <input
                    type="radio"
                    name={option.id}
                    value={choice.value}
                    checked={selected}
                    onChange={() => onChange(option.id, choice.value)}
                    className="h-5 w-5"
                  />
                  {choice.label}
                </span>
                {choice.helper && <span className="ml-7 text-[16px] text-muted">{choice.helper}</span>}
              </label>
            );
          })}
        </div>
      );

    case "select":
      return (
        <select id={id} className={inputClass} value={String(value ?? "")} onChange={(e) => onChange(option.id, e.target.value)}>
          {option.choices?.map((choice) => (
            <option key={choice.value} value={choice.value}>
              {choice.label}
            </option>
          ))}
        </select>
      );

    case "toggle":
      return (
        <label className="flex min-h-[56px] cursor-pointer items-center gap-3">
          <input
            id={id}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(option.id, e.target.checked)}
            className="h-6 w-6"
          />
          <span className="text-helper text-muted">{option.helper ?? option.label}</span>
        </label>
      );

    case "number":
      return (
        <input
          id={id}
          type="number"
          className={inputClass}
          value={Number(value ?? option.default)}
          min={option.min}
          max={option.max}
          step={option.step}
          onChange={(e) => onChange(option.id, Number(e.target.value))}
        />
      );

    case "password":
      return <PasswordControl option={option} value={String(value ?? "")} onChange={onChange} />;

    case "pages-range":
    case "text":
    default:
      return (
        <input
          id={id}
          type="text"
          className={inputClass}
          value={String(value ?? "")}
          placeholder={option.placeholder}
          onChange={(e) => onChange(option.id, e.target.value)}
        />
      );
  }
}

function PasswordControl({
  option,
  value,
  onChange,
}: {
  option: ToolOption;
  value: string;
  onChange: (id: string, value: string) => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex gap-2">
      <input
        id={`opt-${option.id}`}
        type={show ? "text" : "password"}
        className="min-h-[56px] w-full rounded border-2 border-ink bg-surface px-4 text-[20px] focus-visible:bg-highlight"
        value={value}
        onChange={(e) => onChange(option.id, e.target.value)}
      />
      <button
        type="button"
        className="min-h-[56px] rounded border-2 border-ink px-4 text-helper font-bold hover:bg-highlight"
        onClick={() => setShow((s) => !s)}
        aria-pressed={show}
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}
