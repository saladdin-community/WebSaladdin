"use client";

import { useEffect } from "react";
import { CheckCircle2, XCircle, X, AlertTriangle, Info } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FeedbackType = "success" | "error" | "warning" | "info";

export interface FeedbackAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "outline" | "ghost";
}

export interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: FeedbackType;
  title: string;
  message?: string;
  /** Optional primary / secondary action buttons */
  actions?: FeedbackAction[];
  /** Auto-close after N milliseconds (0 = never) */
  autoClose?: number;
}

// ─── Config per type ──────────────────────────────────────────────────────────

const CONFIG: Record<
  FeedbackType,
  {
    Icon: React.ComponentType<{ className?: string }>;
    iconClass: string;
    ringClass: string;
    glowClass: string;
    badgeClass: string;
  }
> = {
  success: {
    Icon: CheckCircle2,
    iconClass: "text-emerald-400",
    ringClass: "bg-emerald-500/10 border border-emerald-500/20",
    glowClass: "shadow-[0_0_40px_rgba(52,211,153,0.12)]",
    badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  error: {
    Icon: XCircle,
    iconClass: "text-red-400",
    ringClass: "bg-red-500/10 border border-red-500/20",
    glowClass: "shadow-[0_0_40px_rgba(239,68,68,0.12)]",
    badgeClass: "bg-red-500/15 text-red-400 border-red-500/30",
  },
  warning: {
    Icon: AlertTriangle,
    iconClass: "text-amber-400",
    ringClass: "bg-amber-500/10 border border-amber-500/20",
    glowClass: "shadow-[0_0_40px_rgba(245,158,11,0.12)]",
    badgeClass: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  info: {
    Icon: Info,
    iconClass: "text-sky-400",
    ringClass: "bg-sky-500/10 border border-sky-500/20",
    glowClass: "shadow-[0_0_40px_rgba(56,189,248,0.12)]",
    badgeClass: "bg-sky-500/15 text-sky-400 border-sky-500/30",
  },
};

const TYPE_LABEL: Record<FeedbackType, string> = {
  success: "Success",
  error: "Failed",
  warning: "Warning",
  info: "Info",
};

// ─── Action button styles ─────────────────────────────────────────────────────

const BUTTON_STYLES: Record<NonNullable<FeedbackAction["variant"]>, string> = {
  primary:
    "bg-gradient-to-r from-[#d4af35] to-[#fde047] text-black font-semibold hover:opacity-90",
  outline:
    "border border-[rgba(255,255,255,0.15)] text-[#d4d4d4] hover:bg-[rgba(255,255,255,0.05)]",
  ghost: "text-[#737373] hover:text-white hover:bg-[rgba(255,255,255,0.05)]",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function FeedbackModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  actions,
  autoClose = 0,
}: FeedbackModalProps) {
  const cfg = CONFIG[type];

  // Auto-close timer
  useEffect(() => {
    if (!isOpen || autoClose <= 0) return;
    const id = setTimeout(onClose, autoClose);
    return () => clearTimeout(id);
  }, [isOpen, autoClose, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Dimmed background */}
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div
        className={`relative w-full max-w-sm rounded-2xl bg-gradient-to-br from-[#1c1c1c] to-[#141414] border border-[rgba(255,255,255,0.1)] overflow-hidden animate-slide-up ${cfg.glowClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle top accent line */}
        <div
          className={`h-0.5 w-full ${
            type === "success"
              ? "bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
              : type === "error"
                ? "bg-gradient-to-r from-transparent via-red-400 to-transparent"
                : type === "warning"
                  ? "bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                  : "bg-gradient-to-r from-transparent via-sky-400 to-transparent"
          }`}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#525252] hover:text-white hover:bg-[rgba(255,255,255,0.07)] transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Body */}
        <div className="px-7 pt-8 pb-7 flex flex-col items-center text-center">
          {/* Icon ring */}
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${cfg.ringClass}`}
          >
            <cfg.Icon className={`h-8 w-8 ${cfg.iconClass}`} />
          </div>

          {/* Type badge */}
          <span
            className={`inline-block px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-widest border mb-3 ${cfg.badgeClass}`}
          >
            {TYPE_LABEL[type]}
          </span>

          {/* Title */}
          <h2 className="text-xl font-bold text-white mb-2 leading-snug">
            {title}
          </h2>

          {/* Message */}
          {message && (
            <p className="text-sm text-[#737373] leading-relaxed mb-6">
              {message}
            </p>
          )}

          {/* Auto-close progress bar */}
          {autoClose > 0 && (
            <div className="w-full h-0.5 bg-[#262626] rounded-full overflow-hidden mb-6">
              <div
                className={`h-full rounded-full ${cfg.iconClass.replace("text-", "bg-")}`}
                style={{
                  animation: `shrink ${autoClose}ms linear forwards`,
                }}
              />
            </div>
          )}

          {/* Actions */}
          {actions && actions.length > 0 ? (
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              {actions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => {
                    action.onClick();
                    onClose();
                  }}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 active:scale-95 ${
                    BUTTON_STYLES[action.variant ?? "primary"]
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          ) : (
            // Default close button when no actions provided
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#d4af35] to-[#fde047] text-black hover:opacity-90 active:scale-95 transition-all duration-200"
            >
              Got it
            </button>
          )}
        </div>
      </div>

      {/* Keyframe for auto-close bar */}
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </div>
  );
}
