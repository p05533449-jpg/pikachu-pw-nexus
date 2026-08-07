import { useEffect } from "react";

/** Allow native behaviour inside real inputs so the admin panel stays usable. */
const isEditable = (el: EventTarget | null) => {
  const node = el as HTMLElement | null;
  if (!node || typeof node.closest !== "function") return false;
  return !!node.closest("input, textarea, select, [contenteditable='true']");
};

/**
 * Blocks context menu, selection, copy/cut/paste and image dragging
 * everywhere except editable fields.
 */
export function useContentProtection() {
  useEffect(() => {
    const block = (e: Event) => {
      if (isEditable(e.target)) return;
      e.preventDefault();
    };

    const events: Array<keyof DocumentEventMap> = [
      "contextmenu",
      "copy",
      "cut",
      "paste",
      "dragstart",
      "selectstart",
    ];

    events.forEach((name) => document.addEventListener(name, block));
    return () => events.forEach((name) => document.removeEventListener(name, block));
  }, []);
}
