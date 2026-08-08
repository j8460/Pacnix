"use client";

import { useState } from "react";
import { ArrayEditor } from "./array-editor";
import type { Product } from "@/lib/types";

type ProductsEditorProps = {
  products: Product[];
  onSave: (products: Product[]) => Promise<void>;
  saving?: boolean;
};

function createProduct(): Product {
  return {
    slug: "",
    name: "",
    categoryId: "",
    featured: false,
    summary: "",
    description: "",
    features: [],
    applications: [],
    benefits: [],
    specifications: [],
    images: [],
    imageAlt: "",
    cataloguePath: "",
    relatedSlugs: [],
  };
}

export function ProductsEditor({ products, onSave, saving }: ProductsEditorProps) {
  const [draft, setDraft] = useState(products);

  return (
    <ArrayEditor<Product>
      title="Products"
      items={draft}
      onSave={async (items) => {
        await onSave(items);
        setDraft(items);
      }}
      saving={saving}
      createItem={createProduct}
      getItemLabel={(item) => item.name || item.slug || "Untitled product"}
    />
  );
}
