// components/MarkdownPreview.tsx
"use client";
import MDEditor from "@uiw/react-md-editor";

export default function MarkdownPreview({ content }: { content: string }) {
  return (
    <div data-color-mode="light">
      <MDEditor.Markdown source={content} style={{ whiteSpace: "pre-wrap" }} />
    </div>
  );
}
