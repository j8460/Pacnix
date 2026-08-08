"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrayEditor } from "@/components/admin/array-editor";
import { ADMIN_CONTENT_NAV, getCollectionEditorType } from "@/components/admin/config";
import { ObjectEditorPanel } from "@/components/admin/object-editor";
import { ProductsEditor } from "@/components/admin/products-editor";
import type { ContentCollection, Product } from "@/lib/types";

type ContentEditorProps = {
  collection: ContentCollection;
};

export function ContentEditor({ collection }: ContentEditorProps) {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const title =
    ADMIN_CONTENT_NAV.find((item) => item.collection === collection)?.label ?? collection;
  const editorType = getCollectionEditorType(collection);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/content/${collection}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Failed to load content");
        setData(json.data);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to load content");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [collection]);

  async function saveContent(nextData: unknown) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/content/${collection}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextData),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to save");
      setData(nextData);
      toast.success("Content saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
      throw err;
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-500">Loading {title}...</p>;
  }

  if (data === null) {
    return <p className="text-sm text-red-600">Failed to load content.</p>;
  }

  if (editorType === "products") {
    return (
      <ProductsEditor
        products={data as Product[]}
        saving={saving}
        onSave={async (products) => saveContent(products)}
      />
    );
  }

  if (editorType === "object") {
    return (
      <ObjectEditorPanel
        title={title}
        value={data as Record<string, unknown>}
        saving={saving}
        onSave={async (value) => saveContent(value)}
      />
    );
  }

  return (
    <ArrayEditor
      title={title}
      items={(data as Record<string, unknown>[]) ?? []}
      saving={saving}
      onSave={async (items) => saveContent(items)}
      getItemLabel={(item, index) => {
        const record = item as Record<string, unknown>;
        return String(
          record.title ?? record.name ?? record.question ?? record.slug ?? `Item ${index + 1}`
        );
      }}
      createItem={() => ({ id: crypto.randomUUID() })}
    />
  );
}
