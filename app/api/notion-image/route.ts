import { NextRequest, NextResponse } from "next/server";
import { Client, LogLevel } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  logLevel: LogLevel.ERROR,
});

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const blockId = searchParams.get("blockId");
  const rawUrl = searchParams.get("url");

  let targetUrl: string | null = rawUrl;

  // 1. If blockId is provided, retrieve fresh signed S3 URL from Notion block
  if (blockId) {
    try {
      const cleanId = blockId.replace(/-/g, "");
      const block: any = await notion.blocks.retrieve({ block_id: cleanId });
      targetUrl = block?.image?.file?.url || block?.image?.external?.url || null;
    } catch (err: any) {
      console.error("Error retrieving block in /api/notion-image:", err?.message);
    }
  } else if (rawUrl && (rawUrl.includes("file.notion.com") || rawUrl.includes("file.notion.so"))) {
    try {
      const parsed = new URL(rawUrl);
      const extractedId = parsed.searchParams.get("id");
      if (extractedId) {
        const cleanId = extractedId.replace(/-/g, "");
        const block: any = await notion.blocks.retrieve({ block_id: cleanId });
        targetUrl = block?.image?.file?.url || block?.image?.external?.url || targetUrl;
      }
    } catch (err: any) {
      console.error("Error parsing rawUrl in /api/notion-image:", err?.message);
    }
  }

  if (!targetUrl) {
    return new NextResponse("Image not found", { status: 404 });
  }

  try {
    const res = await fetch(targetUrl);
    if (!res.ok) {
      return new NextResponse(`Image fetch failed: ${res.status}`, { status: res.status });
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await res.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err: any) {
    console.error("Error streaming image in /api/notion-image:", err?.message);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
