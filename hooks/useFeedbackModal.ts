import { useState, useCallback } from "react";
import type {
  FeedbackType,
  FeedbackAction,
} from "@/app/components/modal/FeedbackModal";

// ─── State held by the hook ───────────────────────────────────────────────────

interface FeedbackState {
  isOpen: boolean;
  type: FeedbackType;
  title: string;
  message?: string;
  actions?: FeedbackAction[];
  autoClose?: number;
}

// ─── Options passed to open() ─────────────────────────────────────────────────

interface OpenOptions {
  type: FeedbackType;
  title: string;
  message?: string;
  actions?: FeedbackAction[];
  /** Auto-close delay in ms. Omit or pass 0 to disable. */
  autoClose?: number;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useFeedbackModal
 *
 * Returns `modal` (props to spread onto <FeedbackModal />) and helpers:
 *   open(options) — show the modal
 *   success(title, message?, options?) — shorthand for type "success"
 *   error(title, message?, options?)   — shorthand for type "error"
 *   warning(title, message?, options?) — shorthand for type "warning"
 *   info(title, message?, options?)    — shorthand for type "info"
 *   close()                            — hide the modal
 *
 * Usage:
 *   const { modal, success, error } = useFeedbackModal();
 *
 *   // trigger
 *   success("Enrolled!", "You can start learning now.", { autoClose: 3000 });
 *
 *   // render
 *   <FeedbackModal {...modal} />
 */
export function useFeedbackModal() {
  const [state, setState] = useState<FeedbackState>({
    isOpen: false,
    type: "success",
    title: "",
  });

  const close = useCallback(() => {
    setState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const open = useCallback((options: OpenOptions) => {
    setState({ isOpen: true, ...options });
  }, []);

  const success = useCallback(
    (
      title: string,
      message?: string,
      extra?: Omit<OpenOptions, "type" | "title" | "message">,
    ) => open({ type: "success", title, message, ...extra }),
    [open],
  );

  const error = useCallback(
    (
      title: string,
      message?: string,
      extra?: Omit<OpenOptions, "type" | "title" | "message">,
    ) => open({ type: "error", title, message, ...extra }),
    [open],
  );

  const warning = useCallback(
    (
      title: string,
      message?: string,
      extra?: Omit<OpenOptions, "type" | "title" | "message">,
    ) => open({ type: "warning", title, message, ...extra }),
    [open],
  );

  const info = useCallback(
    (
      title: string,
      message?: string,
      extra?: Omit<OpenOptions, "type" | "title" | "message">,
    ) => open({ type: "info", title, message, ...extra }),
    [open],
  );

  return {
    /** Spread these props onto <FeedbackModal {...modal} /> */
    modal: { ...state, onClose: close },
    open,
    close,
    success,
    error,
    warning,
    info,
  };
}
