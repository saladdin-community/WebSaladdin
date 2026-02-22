"use client";

import { useEffect } from "react";
import { X, AlertTriangle, Trash2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning";
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
}: ConfirmModalProps) {
  // Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!isOpen) return null;

  const isDanger = variant === "danger";

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div
        className={`relative w-full max-w-sm rounded-2xl bg-gradient-to-br from-[#1c1c1c] to-[#141414] border border-[rgba(255,255,255,0.1)] shadow-2xl overflow-hidden ${
          isDanger
            ? "shadow-[0_0_40px_rgba(239,68,68,0.08)]"
            : "shadow-[0_0_40px_rgba(245,158,11,0.08)]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent top line */}
        <div
          className={`h-0.5 w-full ${
            isDanger
              ? "bg-gradient-to-r from-transparent via-red-400 to-transparent"
              : "bg-gradient-to-r from-transparent via-amber-400 to-transparent"
          }`}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#525252] hover:text-white hover:bg-[rgba(255,255,255,0.07)] rounded-lg transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Body */}
        <div className="px-7 pt-8 pb-7 flex flex-col items-center text-center">
          {/* Icon */}
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${
              isDanger
                ? "bg-red-500/10 border border-red-500/20"
                : "bg-amber-500/10 border border-amber-500/20"
            }`}
          >
            {isDanger ? (
              <Trash2
                className={`h-7 w-7 ${isDanger ? "text-red-400" : "text-amber-400"}`}
              />
            ) : (
              <AlertTriangle className="h-7 w-7 text-amber-400" />
            )}
          </div>

          {/* Title */}
          <h2 className="text-lg font-bold text-white mb-2">{title}</h2>

          {/* Message */}
          {message && (
            <p className="text-sm text-[#737373] leading-relaxed mb-6">
              {message}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2 w-full mt-1">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm btn-dark rounded-xl font-medium"
            >
              {cancelLabel}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl active:scale-95 transition-all ${
                isDanger
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-amber-500 hover:bg-amber-600 text-black"
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
