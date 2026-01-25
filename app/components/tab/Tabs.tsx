"use client";

import { ReactNode } from "react";

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: "default" | "pills" | "underline";
}

export default function Tabs({
  tabs,
  activeTab,
  onChange,
  className = "",
  variant = "default",
}: TabsProps) {
  const baseClasses = "flex space-x-1";

  const variantClasses = {
    default: "border-b border-[rgba(255,255,255,0.1)]",
    pills: "",
    underline: "",
  };

  const tabClasses = {
    default: `px-4 py-3 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
      activeTab === "tab.id"
        ? "border-[#d4af35] text-white bg-[#262626]"
        : "border-transparent text-[#737373] hover:text-white hover:bg-[#262626]"
    }`,
    pills: `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      activeTab === "tab.id"
        ? "bg-gradient-gold text-black"
        : "bg-[#1f1f1f] text-[#737373] hover:text-white hover:bg-[#262626]"
    }`,
    underline: `px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
      activeTab === "tab.id"
        ? "border-[#d4af35] text-white"
        : "border-transparent text-[#737373] hover:text-white hover:border-[#737373]"
    }`,
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => !tab.disabled && onChange(tab.id)}
          disabled={tab.disabled}
          className={`
            flex items-center gap-2
            ${tabClasses[variant].replace('"tab.id"', tab.id)}
            ${tab.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          `}
        >
          {tab.icon && <span>{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
