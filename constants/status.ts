export type StatusType =
  | "active"
  | "inactive"
  | "blocked"
  | "pending"
  | "published"
  | "draft"
  | "archived";

export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const statusConfig: Record<StatusType, StatusConfig> = {
  active: {
    label: "Active",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    borderColor: "border-emerald-400/20",
  },
  inactive: {
    label: "Inactive",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    borderColor: "border-amber-400/20",
  },
  blocked: {
    label: "Blocked",
    color: "text-rose-400",
    bgColor: "bg-rose-400/10",
    borderColor: "border-rose-400/20",
  },
  pending: {
    label: "Pending",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderColor: "border-blue-400/20",
  },
  published: {
    label: "Published",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    borderColor: "border-emerald-400/20",
  },
  draft: {
    label: "Draft",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
    borderColor: "border-amber-400/20",
  },
  archived: {
    label: "Archived",
    color: "text-slate-400",
    bgColor: "bg-slate-400/10",
    borderColor: "border-slate-400/20",
  },
};
