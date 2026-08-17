import type { ReactNode } from "react";
import { codeToHtml, type BundledLanguage } from "shiki";
import { CodeCopyButton } from "./code-copy-button";

const languageAliases: Record<string, BundledLanguage> = {
  bash: "bash", css: "css", html: "html", javascript: "javascript", js: "javascript",
  json: "json", markdown: "markdown", md: "markdown", python: "python", py: "python",
  rust: "rust", rs: "rust", shell: "bash", sql: "sql", ts: "typescript", tsx: "tsx",
  typescript: "typescript", yaml: "yaml", yml: "yaml",
};

function languageFor(value: string) {
  return languageAliases[value.toLowerCase()] ?? "text";
}

export async function CodeSnippet({ code, filename, language = "typescript" }: { code?: string; filename?: string; language?: string }) {
  const source = code ?? "";
  const html = await codeToHtml(source, {
    lang: languageFor(language),
    themes: { light: "github-light", dark: "github-dark" },
  });

  return (
    <figure className="code-snippet">
      <figcaption className="code-snippet-header">
        <span className="code-window-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="code-snippet-filename">{filename || "snippet"}</span>
        <span className="code-snippet-language">{language}</span>
        <CodeCopyButton code={source} />
      </figcaption>
      <div className="code-snippet-body" dangerouslySetInnerHTML={{ __html: html }} />
    </figure>
  );
}

export function Callout({ children, title, tone = "note" }: { children: ReactNode; title?: string; tone?: "note" | "tip" | "warning" }) {
  const labels = { note: "Ghi chú", tip: "Mẹo", warning: "Lưu ý" };
  const safeTone = tone in labels ? tone : "note";
  return <aside className={`dev-callout dev-callout-${safeTone}`}><div className="dev-callout-label"><span>{safeTone === "tip" ? "✦" : safeTone === "warning" ? "!" : "i"}</span>{title || labels[safeTone]}</div><div className="dev-callout-content">{children}</div></aside>;
}

export function Details({ children, summary }: { children: ReactNode; summary?: string }) {
  return <details className="dev-details"><summary>{summary || "Xem thêm"}<span aria-hidden="true">+</span></summary><div>{children}</div></details>;
}

export const mdxComponents = { Callout, CodeSnippet, Details };
