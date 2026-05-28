"use client";

import ReactMarkdown from "react-markdown";

export function MarkdownView({ content }: { content: string }) {
  return (
    <div className="md-output">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
