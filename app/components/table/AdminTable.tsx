"use client";

import { useState } from "react";
import { Edit, Trash2, MoreVertical, Eye, Download } from "lucide-react";
import { statusConfig, StatusType } from "@/constants/status";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface AdminTableProps {
  columns: Column[];
  data: any[];
  onEdit?: (row: any) => void;
  onDelete?: (id: string | number) => void;
  onView?: (row: any) => void;
  onExport?: () => void;
  isLoading?: boolean;
  emptyMessage?: string;
  showActions?: boolean;
  rowKey?: string;
  // Pagination props
  currentPage?: number;
  lastPage?: number;
  total?: number;
  onPageChange?: (page: number) => void;
}

export default function AdminTable({
  columns,
  data,
  onEdit,
  onDelete,
  onView,
  onExport,
  isLoading = false,
  emptyMessage = "No data found",
  showActions = true,
  rowKey = "id",
  currentPage,
  lastPage,
  total,
  onPageChange,
}: AdminTableProps) {
  const [actionMenu, setActionMenu] = useState<string | number | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const renderStatusBadge = (status: StatusType) => {
    const config = statusConfig[status];
    if (!config) return null;

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.color} border ${config.borderColor}`}
      >
        {config.label}
      </span>
    );
  };

  const renderCell = (column: Column, row: any) => {
    const value = row[column.key];

    if (column.render) {
      return column.render(value, row);
    }

    // Default renderers for common data types
    switch (column.key) {
      case "status":
        return renderStatusBadge(value as StatusType);

      case "price":
        return <span className="font-medium text-gradient-gold">{value}</span>;

      default:
        return <span className="text-[#d4d4d4]">{value}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#121212] rounded-xl border border-[rgba(255,255,255,0.1)] p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-12 bg-[#2a2a2a] rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const showPagination =
    onPageChange && currentPage !== undefined && lastPage !== undefined;

  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#121212] rounded-xl border border-[rgba(255,255,255,0.1)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.1)]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="py-4 px-6 text-left text-sm font-semibold text-[#737373] cursor-pointer hover:text-white transition-colors"
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {column.sortable && (
                      <span className="text-xs">
                        {sortColumn === column.key
                          ? sortDirection === "asc"
                            ? "↑"
                            : "↓"
                          : "↕"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {showActions && (
                <th className="py-4 px-6 text-left text-sm font-semibold text-[#737373]">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showActions ? 1 : 0)}
                  className="py-12 text-center"
                >
                  <div className="text-[#737373]">{emptyMessage}</div>
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row[rowKey]}
                  className="border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="py-4 px-6">
                      {renderCell(column, row)}
                    </td>
                  ))}

                  {showActions && (
                    <td className="py-4 px-6">
                      <div className="relative">
                        <button
                          onClick={() =>
                            setActionMenu(
                              actionMenu === row[rowKey] ? null : row[rowKey],
                            )
                          }
                          className="p-2 hover:bg-[#262626] rounded-lg transition-colors"
                        >
                          <MoreVertical className="h-5 w-5 text-[#737373]" />
                        </button>

                        {actionMenu === row[rowKey] && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] rounded-lg shadow-lg z-10">
                            {onView && (
                              <button
                                onClick={() => {
                                  onView(row);
                                  setActionMenu(null);
                                }}
                                className="flex items-center gap-2 w-full px-4 py-3 text-sm text-[#d4d4d4] hover:bg-[#262626]"
                              >
                                <Eye className="h-4 w-4" />
                                View Details
                              </button>
                            )}
                            {onEdit && (
                              <button
                                onClick={() => {
                                  onEdit(row);
                                  setActionMenu(null);
                                }}
                                className="flex items-center gap-2 w-full px-4 py-3 text-sm text-[#d4d4d4] hover:bg-[#262626]"
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </button>
                            )}
                            {onDelete && (
                              <div className="border-t border-[rgba(255,255,255,0.1)]">
                                <button
                                  onClick={() => {
                                    onDelete(row[rowKey]);
                                    setActionMenu(null);
                                  }}
                                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-rose-400 hover:bg-[#262626] rounded-b-lg"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer / Pagination */}
      {showPagination && data.length > 0 && (
        <div className="px-6 py-4 border-t border-[rgba(255,255,255,0.1)] flex items-center justify-between">
          <div className="text-sm text-[#737373]">
            Showing {data.length > 0 ? (currentPage - 1) * data.length + 1 : 0}{" "}
            to {(currentPage - 1) * data.length + data.length} of {total}{" "}
            results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-1.5 bg-[#1f1f1f] text-[#d4d4d4] rounded-lg hover:bg-[#262626] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* Simple page numbers (could be more complex logic for many pages) */}
            {Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                    currentPage === pageNum
                      ? "bg-gradient-gold text-black"
                      : "bg-[#1f1f1f] text-[#d4d4d4] hover:bg-[#262626]"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            {lastPage > 5 && <span className="text-[#737373] px-1">...</span>}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= lastPage}
              className="px-3 py-1.5 bg-[#1f1f1f] text-[#d4d4d4] rounded-lg hover:bg-[#262626] text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
