"use client";

import { useEffect, useState } from "react";

/** Types and deletes each word in turn, like a terminal prompt. */
export function TypeWords({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const word = words[index % words.length];

  useEffect(() => {
    const done = !deleting && length === word.length;
    const empty = deleting && length === 0;
    const delay = done ? 1600 : deleting ? 45 : 90;

    const timer = setTimeout(() => {
      if (done) setDeleting(true);
      else if (empty) {
        setDeleting(false);
        setIndex((i) => i + 1);
      } else setLength((l) => l + (deleting ? -1 : 1));
    }, delay);
    return () => clearTimeout(timer);
  }, [length, deleting, word]);

  return (
    <span className="caret text-neon" aria-label={words.join(", ")}>
      {word.slice(0, length)}
    </span>
  );
}
