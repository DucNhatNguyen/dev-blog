"use client";

import { useState } from "react";

export function CodeCopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button className="code-copy-button" type="button" onClick={copyCode} aria-label="Sao chép đoạn mã">
      {copied ? "Đã chép" : "Sao chép"}
    </button>
  );
}
