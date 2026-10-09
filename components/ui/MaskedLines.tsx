import type { ReactNode } from "react";

/**
 * Headline split into explicit lines, each inside an overflow mask, so
 * animations can lift every line into view. Without JavaScript or with
 * reduced motion the text simply renders as normal.
 */
export function MaskedLines({ lines, lineClassName }: { lines: ReactNode[]; lineClassName?: string }) {
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} data-line className={`mask-line ${lineClassName ?? ""}`}>
          <span>{line}</span>
        </span>
      ))}
    </>
  );
}
