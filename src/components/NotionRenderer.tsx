import React from "react";
import Image from "next/image";

interface RichTextItem {
  type?: string;
  text?: {
    content: string;
    link?: { url: string } | null;
  };
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: string;
  };
  plain_text: string;
  href?: string | null;
}

interface NotionBlock {
  id: string;
  type: string;
  [key: string]: any;
}

interface NotionRendererProps {
  blocks: NotionBlock[];
  className?: string;
}

/**
 * Renders an array of Notion rich_text objects with full annotations support
 */
export function NotionRichText({ items }: { items?: RichTextItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <>
      {items.map((item, index) => {
        const { annotations, plain_text, href } = item;
        let content: React.ReactNode = plain_text;

        if (annotations?.code) {
          content = (
            <code className="px-1.5 py-0.5 rounded bg-[#EFE9DD] font-mono text-xs text-[#BA6341]">
              {content}
            </code>
          );
        }
        if (annotations?.bold) {
          content = <strong className="font-bold text-[#262626]">{content}</strong>;
        }
        if (annotations?.italic) {
          content = <em className="italic">{content}</em>;
        }
        if (annotations?.strikethrough) {
          content = <s className="line-through opacity-70">{content}</s>;
        }
        if (annotations?.underline) {
          content = <u className="underline underline-offset-2">{content}</u>;
        }

        if (href) {
          return (
            <a
              key={index}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#BA6341] hover:underline underline-offset-2 transition-colors font-medium"
            >
              {content}
            </a>
          );
        }

        return <React.Fragment key={index}>{content}</React.Fragment>;
      })}
    </>
  );
}

/**
 * Robust, editorial-standard Notion Block Renderer
 * Strictly adheres to Day 5 design guidelines: standard Sans-serif, Reporter charcoal color hierarchy.
 */
export default function NotionRenderer({
  blocks,
  className = "",
}: NotionRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  // Pre-process blocks to group consecutive bulleted and numbered list items
  const renderElements: React.ReactNode[] = [];
  let currentList: { type: "bulleted" | "numbered"; items: NotionBlock[] } | null = null;

  const flushList = () => {
    if (!currentList) return;

    if (currentList.type === "bulleted") {
      renderElements.push(
        <ul
          key={`list-ul-${renderElements.length}`}
          className="list-disc pl-6 space-y-2 mb-4 text-[#4A4A4A] leading-relaxed"
        >
          {currentList.items.map((item) => (
            <li key={item.id} className="pl-1">
              <NotionRichText items={item.bulleted_list_item?.rich_text} />
            </li>
          ))}
        </ul>
      );
    } else {
      renderElements.push(
        <ol
          key={`list-ol-${renderElements.length}`}
          className="list-decimal pl-6 space-y-2 mb-4 text-[#4A4A4A] leading-relaxed"
        >
          {currentList.items.map((item) => (
            <li key={item.id} className="pl-1">
              <NotionRichText items={item.numbered_list_item?.rich_text} />
            </li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const type = block.type;

    // Handle list item grouping
    if (type === "bulleted_list_item") {
      if (currentList && currentList.type !== "bulleted") {
        flushList();
      }
      if (!currentList) {
        currentList = { type: "bulleted", items: [] };
      }
      currentList.items.push(block);
      continue;
    } else if (type === "numbered_list_item") {
      if (currentList && currentList.type !== "numbered") {
        flushList();
      }
      if (!currentList) {
        currentList = { type: "numbered", items: [] };
      }
      currentList.items.push(block);
      continue;
    } else {
      flushList();
    }

    // Render individual block types
    switch (type) {
      case "paragraph": {
        const richText = block.paragraph?.rich_text;
        if (!richText || richText.length === 0) {
          renderElements.push(<div key={block.id} className="h-4" />);
          break;
        }
        renderElements.push(
          <p
            key={block.id}
            className="text-[#4A4A4A] font-normal text-base leading-relaxed mb-4"
          >
            <NotionRichText items={richText} />
          </p>
        );
        break;
      }

      case "heading_1": {
        renderElements.push(
          <h2
            key={block.id}
            className="text-2xl sm:text-3xl font-bold text-[#262626] tracking-normal leading-snug mt-10 mb-4 font-sans"
          >
            <NotionRichText items={block.heading_1?.rich_text} />
          </h2>
        );
        break;
      }

      case "heading_2": {
        renderElements.push(
          <h3
            key={block.id}
            className="text-xl sm:text-2xl font-bold text-[#262626] tracking-normal leading-snug mt-8 mb-4 font-sans"
          >
            <NotionRichText items={block.heading_2?.rich_text} />
          </h3>
        );
        break;
      }

      case "heading_3": {
        renderElements.push(
          <h4
            key={block.id}
            className="text-lg font-semibold text-[#262626] tracking-normal leading-snug mt-6 mb-2 font-sans"
          >
            <NotionRichText items={block.heading_3?.rich_text} />
          </h4>
        );
        break;
      }

      case "quote": {
        renderElements.push(
          <blockquote
            key={block.id}
            className="border-l-2 border-[#BA6341] pl-4 py-2 italic text-[#4A4A4A] my-6 text-base leading-relaxed bg-[#F4EFE6]/60 rounded-r-xl"
          >
            <NotionRichText items={block.quote?.rich_text} />
          </blockquote>
        );
        break;
      }

      case "callout": {
        const icon =
          block.callout?.icon?.emoji ||
          (block.callout?.icon?.type === "external" ? "📌" : "🌲");

        renderElements.push(
          <div
            key={block.id}
            className="flex items-start gap-3.5 p-5 rounded-2xl bg-[#F4EFE6] border border-[#E0D8CB] my-6 text-sm text-[#4A4A4A] leading-relaxed shadow-2xs"
          >
            <span className="text-xl shrink-0" aria-hidden="true">
              {icon}
            </span>
            <div className="flex-1">
              <NotionRichText items={block.callout?.rich_text} />
            </div>
          </div>
        );
        break;
      }

      case "image": {
        const imageUrl =
          block.image?.type === "external"
            ? block.image?.external?.url
            : block.image?.file?.url;

        if (!imageUrl) break;

        const captionItems = block.image?.caption;
        const hasCaption = captionItems && captionItems.length > 0;
        const captionText = captionItems?.map((c: any) => c.plain_text).join("") || "";

        renderElements.push(
          <figure key={block.id} className="w-full flex flex-col items-center justify-center my-8">
            <div className="w-full flex justify-center">
              <img
                src={imageUrl}
                alt={captionText || "山林記事配圖"}
                loading="lazy"
                className="max-w-full h-auto max-h-[85vh] object-contain rounded-xl shadow-sm border border-[#E0D8CB] bg-[#EBE4D8]"
              />
            </div>
            {hasCaption && (
              <figcaption className="text-center text-xs text-[#737373] mt-2.5 font-mono">
                <NotionRichText items={captionItems} />
              </figcaption>
            )}
          </figure>
        );
        break;
      }

      case "divider": {
        renderElements.push(
          <hr key={block.id} className="my-8 border-t border-stone-200" />
        );
        break;
      }

      case "code": {
        renderElements.push(
          <pre
            key={block.id}
            className="my-6 p-4 rounded-xl bg-[#233F31] text-[#FAF7F2] font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed shadow-2xs"
          >
            <code>
              <NotionRichText items={block.code?.rich_text} />
            </code>
          </pre>
        );
        break;
      }

      case "to_do": {
        const checked = block.to_do?.checked ?? false;
        renderElements.push(
          <div
            key={block.id}
            className="flex items-start gap-3 my-2 text-base text-[#4A4A4A] leading-relaxed"
          >
            <input
              type="checkbox"
              checked={checked}
              readOnly
              className="mt-1 h-4 w-4 rounded border-stone-300 text-[#233F31] focus:ring-0"
            />
            <span className={checked ? "line-through opacity-60" : ""}>
              <NotionRichText items={block.to_do?.rich_text} />
            </span>
          </div>
        );
        break;
      }

      default:
        // Gracefully ignore or render simple text for unsupported block types
        break;
    }
  }

  // Flush any trailing list items
  flushList();

  return <div className={`notion-blocks-content ${className}`}>{renderElements}</div>;
}
