"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface CaseStudyDialogProps {
  title: string;
  imageUrl: string;
  /** Fired for every close path — the button, ESC, or a backdrop click. */
  onClose: () => void;
}

/**
 * The card's case study preview, opened when a project has no live `link`
 * yet. A native <dialog> shown modally, so the top layer, the backdrop, ESC
 * and the focus trap are the platform's rather than a hand-rolled overlay.
 *
 * Portalled to <body> because the card sits inside a clipped, animated
 * stacking context that a fixed-position panel would inherit.
 */
export default function CaseStudyDialog({
  title,
  imageUrl,
  onClose,
}: CaseStudyDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    // Guarded because React's development StrictMode runs this effect twice.
    if (!dialog.open) dialog.showModal();

    // A modal dialog makes the rest of the document inert but does not stop
    // it scrolling under the backdrop, so hold the page still while open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // The backdrop lives on the ::backdrop pseudo-element, so a press outside
    // the panel targets the dialog itself. It has to be a native pointerdown
    // rather than React's click: the opening click is still bubbling while
    // this dialog mounts, and a click handler would hear it as an outside
    // press and close what it just opened.
    const onPointerDown = (event: PointerEvent) => {
      if (event.target === dialog) dialog.close();
    };
    dialog.addEventListener("pointerdown", onPointerDown);

    return () => {
      // No `dialog.close()` here on purpose. React removes the portalled node
      // on unmount, which drops the dialog out of the top layer anyway, and
      // closing would fire `close` — calling back into the card's state while
      // it is being torn down, which in StrictMode's mount/unmount/mount
      // immediately shuts the dialog again.
      dialog.removeEventListener("pointerdown", onPointerDown);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return createPortal(
    <dialog
      ref={ref}
      className="case-study-dialog"
      aria-label={title}
      onClose={onClose}
    >
      <button
        type="button"
        className="case-study-dialog-close"
        aria-label="Close dialog"
        autoFocus
        onClick={() => ref.current?.close()}
      >
        &times;
      </button>
      <h2 className="case-study-dialog-title">{title}</h2>
      {imageUrl && (
        <img className="case-study-dialog-image" src={imageUrl} alt={title} />
      )}
    </dialog>,
    document.body,
  );
}