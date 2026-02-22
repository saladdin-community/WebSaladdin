"use client";

import { useState, useEffect, useRef } from "react";
import { X, Pencil } from "lucide-react";

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title: string;
  message?: string;
  placeholder?: string;
  defaultValue?: string;
  confirmLabel?: string;
}

export default function PromptModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  placeholder = "Type here...",
  defaultValue = "",
  confirmLabel = "Confirm",
}: PromptModalProps) {
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset & focus when opened
  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, defaultValue]);

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
    if (!value.trim()) return;
    onConfirm(value.trim());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-sm rounded-2xl bg-gradient-to-br from-[#1c1c1c] to-[#141414] border border-[rgba(255,255,255,0.1)] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gold accent top line */}
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#d4af35] to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#d4af35]/15 border border-[#d4af35]/20 flex items-center justify-center">
              <Pencil className="h-4 w-4 text-[#d4af35]" />
            </div>
            <h2 className="text-base font-bold text-white">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#525252] hover:text-white hover:bg-[rgba(255,255,255,0.07)] rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 space-y-4">
          {message && (
            <p className="text-sm text-[#737373] leading-relaxed -mt-1">
              {message}
            </p>
          )}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
            placeholder={placeholder}
            className="w-full input py-3 text-sm"
          />
          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm btn-dark rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!value.trim()}
              className="flex-1 px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-[#d4af35] to-[#fde047] text-black rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
