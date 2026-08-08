"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { ObjectEditor } from "./object-editor";

type ArrayEditorProps<T extends Record<string, unknown>> = {
  title: string;
  items: T[];
  onSave: (items: T[]) => Promise<void>;
  saving?: boolean;
  getItemLabel?: (item: T, index: number) => string;
  createItem?: () => T;
};

function defaultCreateItem(): Record<string, unknown> {
  return { id: crypto.randomUUID() };
}

export function ArrayEditor<T extends Record<string, unknown>>({
  title,
  items,
  onSave,
  saving,
  getItemLabel,
  createItem = defaultCreateItem as () => T,
}: ArrayEditorProps<T>) {
  const [draft, setDraft] = useState(items);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 0: true });
  const [dirty, setDirty] = useState(false);

  function updateItem(index: number, next: T) {
    const copy = [...draft];
    copy[index] = next;
    setDraft(copy);
    setDirty(true);
  }

  function removeItem(index: number) {
    setDraft(draft.filter((_, i) => i !== index));
    setDirty(true);
  }

  function addItem() {
    setDraft([...draft, createItem()]);
    setExpanded((prev) => ({ ...prev, [draft.length]: true }));
    setDirty(true);
  }

  async function handleSave() {
    await onSave(draft);
    setDirty(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{draft.length} items</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addItem}>
            Add item
          </Button>
          <Button onClick={handleSave} disabled={!dirty || saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {draft.map((item, index) => {
          const open = expanded[index] ?? false;
          const label = getItemLabel?.(item, index) ?? `Item ${index + 1}`;
          return (
            <div key={index} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                onClick={() => setExpanded((prev) => ({ ...prev, [index]: !open }))}
              >
                <div className="flex items-center gap-2">
                  {open ? (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  )}
                  <span className="font-medium text-slate-800">{label}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeItem(index);
                  }}
                >
                  Remove
                </Button>
              </button>
              {open && (
                <div className="border-t border-slate-100 px-5 py-4">
                  <ObjectEditor
                    value={item}
                    onChange={(next) => updateItem(index, next as T)}
                  />
                </div>
              )}
            </div>
          );
        })}
        {draft.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            No items yet. Click &quot;Add item&quot; to create one.
          </div>
        )}
      </div>
    </div>
  );
}

export function SimpleArrayEditor({
  title,
  items,
  onSave,
  saving,
}: {
  title: string;
  items: string[];
  onSave: (items: string[]) => Promise<void>;
  saving?: boolean;
}) {
  const [draft, setDraft] = useState(items);
  const [dirty, setDirty] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        <Button
          onClick={async () => {
            await onSave(draft);
            setDirty(false);
          }}
          disabled={!dirty || saving}
        >
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>
      <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-6">
        {draft.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => {
                const next = [...draft];
                next[index] = e.target.value;
                setDraft(next);
                setDirty(true);
              }}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setDraft(draft.filter((_, i) => i !== index));
                setDirty(true);
              }}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setDraft([...draft, ""]);
            setDirty(true);
          }}
        >
          Add item
        </Button>
      </div>
    </div>
  );
}
