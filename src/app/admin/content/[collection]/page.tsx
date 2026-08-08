import { notFound } from "next/navigation";
import { ContentEditor } from "@/components/admin/content-editor";
import { collectionSavers } from "@/lib/cms";
import type { ContentCollection } from "@/lib/types";

const VALID_COLLECTIONS = Object.keys(collectionSavers) as ContentCollection[];

export function generateStaticParams() {
  return VALID_COLLECTIONS.map((collection) => ({ collection }));
}

export default async function AdminContentPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection } = await params;
  if (!VALID_COLLECTIONS.includes(collection as ContentCollection)) {
    notFound();
  }

  return <ContentEditor collection={collection as ContentCollection} />;
}
