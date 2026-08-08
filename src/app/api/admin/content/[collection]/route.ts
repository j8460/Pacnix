import { NextResponse } from "next/server";
import { collectionSavers } from "@/lib/cms";
import { getCollectionData, saveCollectionData } from "@/lib/db";
import type { ContentCollection } from "@/lib/types";

const VALID_COLLECTIONS = Object.keys(collectionSavers) as ContentCollection[];

function isValidCollection(value: string): value is ContentCollection {
  return VALID_COLLECTIONS.includes(value as ContentCollection);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params;
  if (!isValidCollection(collection)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }

  const data = await getCollectionData(collection);
  return NextResponse.json({ collection, data });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ collection: string }> }
) {
  const { collection } = await params;
  if (!isValidCollection(collection)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    await saveCollectionData(collection, body);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save collection";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
