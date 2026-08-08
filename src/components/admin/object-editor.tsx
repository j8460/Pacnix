"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ObjectEditorProps = {
  value: Record<string, unknown>;
  onChange: (value: Record<string, unknown>) => void;
  path?: string;
  depth?: number;
};

function fieldLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function StringListEditor({
  items,
  onChange,
  label,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => {
                const next = [...items];
                next[index] = e.target.value;
                onChange(next);
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={() => onChange([...items, ""])}>
        Add item
      </Button>
    </div>
  );
}

function ObjectField({
  fieldKey,
  value,
  onChange,
  depth,
}: {
  fieldKey: string;
  value: unknown;
  onChange: (value: unknown) => void;
  depth: number;
}) {
  const label = fieldLabel(fieldKey);

  if (typeof value === "boolean") {
    return (
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300"
        />
        <span className="font-medium text-slate-700">{label}</span>
      </label>
    );
  }

  if (typeof value === "number") {
    return (
      <div className="space-y-1">
        <Label>{label}</Label>
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    );
  }

  if (typeof value === "string") {
    const isLong = value.length > 120 || value.includes("\n");
    return (
      <div className="space-y-1">
        <Label>{label}</Label>
        {isLong ? (
          <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} />
        ) : (
          <Input value={value} onChange={(e) => onChange(e.target.value)} />
        )}
      </div>
    );
  }

  if (Array.isArray(value)) {
    if (value.every((item) => typeof item === "string")) {
      return (
        <StringListEditor
          label={label}
          items={value as string[]}
          onChange={(items) => onChange(items)}
        />
      );
    }

    return (
      <div className="space-y-3 rounded-xl border border-slate-200 p-4">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        {value.map((item, index) => (
          <div key={index} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium uppercase text-slate-400">Item {index + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onChange(value.filter((_, i) => i !== index))}
              >
                Remove
              </Button>
            </div>
            {isPlainObject(item) ? (
              <ObjectEditor
                value={item}
                onChange={(next) => {
                  const copy = [...value];
                  copy[index] = next;
                  onChange(copy);
                }}
                depth={depth + 1}
              />
            ) : (
              <Input
                value={String(item ?? "")}
                onChange={(e) => {
                  const copy = [...value];
                  copy[index] = e.target.value;
                  onChange(copy);
                }}
              />
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const template = isPlainObject(value[0]) ? { ...value[0] } : "";
            onChange([...value, template]);
          }}
        >
          Add {label.toLowerCase()}
        </Button>
      </div>
    );
  }

  if (isPlainObject(value)) {
    return (
      <div className={cn("space-y-4", depth > 0 && "rounded-xl border border-slate-200 p-4")}>
        {depth > 0 && <p className="text-sm font-semibold text-slate-700">{label}</p>}
        <ObjectEditor
          value={value}
          onChange={onChange}
          depth={depth + 1}
        />
      </div>
    );
  }

  return null;
}

export function ObjectEditor({ value, onChange, depth = 0 }: ObjectEditorProps) {
  const keys = Object.keys(value);

  return (
    <div className="space-y-4">
      {keys.map((key) => (
        <ObjectField
          key={key}
          fieldKey={key}
          value={value[key]}
          onChange={(next) => onChange({ ...value, [key]: next })}
          depth={depth}
        />
      ))}
    </div>
  );
}

export function ObjectEditorPanel({
  title,
  value,
  onSave,
  saving,
}: {
  title: string;
  value: Record<string, unknown>;
  onSave: (value: Record<string, unknown>) => Promise<void>;
  saving?: boolean;
}) {
  const [draft, setDraft] = useState(value);
  const [dirty, setDirty] = useState(false);

  function handleChange(next: Record<string, unknown>) {
    setDraft(next);
    setDirty(true);
  }

  async function handleSave() {
    await onSave(draft);
    setDirty(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        <Button onClick={handleSave} disabled={!dirty || saving}>
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <ObjectEditor value={draft} onChange={handleChange} />
      </div>
    </div>
  );
}
