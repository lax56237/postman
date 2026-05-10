"use client";

import { useState } from "react";
import { useWorkspaceHistory, useDeleteHistory, useClearHistory } from "../hooks/history";
import { Loader, Trash2, Clock, CheckCircle, XCircle, AlertCircle, Folder, FileText, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { HISTORY_STATUS } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";

interface HistoryListProps {
  workspaceId: string;
  workspaceName: string;
}

const statusConfig = {
  [HISTORY_STATUS.PENDING]: {
    icon: Clock,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    label: "Pending",
  },
  [HISTORY_STATUS.SUCCESS]: {
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    label: "Success",
  },
  [HISTORY_STATUS.FAILED]: {
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    label: "Failed",
  },
};

const methodColors: Record<string, string> = {
  GET: "text-green-500",
  POST: "text-blue-500",
  PUT: "text-yellow-500",
  DELETE: "text-red-500",
  PATCH: "text-purple-500",
};

export function HistoryList({ workspaceId, workspaceName }: HistoryListProps) {
  const { data: histories, isLoading } = useWorkspaceHistory(workspaceId);
  const deleteHistory = useDeleteHistory();
  const clearHistory = useClearHistory();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (historyId: string) => {
    setDeletingId(historyId);
    try {
      await deleteHistory.mutateAsync(historyId);
      toast.success("History entry deleted");
    } catch (error) {
      toast.error("Failed to delete history entry");
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!confirm("Are you sure you want to clear all history?")) return;
    try {
      await clearHistory.mutateAsync();
      toast.success("All history cleared");
    } catch (error) {
      toast.error("Failed to clear history");
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader className="w-6 h-6 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (!histories || histories.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <Clock className="w-12 h-12 text-zinc-600 mb-4" />
        <h3 className="text-lg font-medium text-zinc-300 mb-2">No History Yet</h3>
        <p className="text-sm text-zinc-500 text-center">
          Your request history will appear here once you start making API calls.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header with clear all */}
      <div className="flex items-center justify-between p-3 border-b border-zinc-800">
        <span className="text-sm text-zinc-400">
          {histories.length} {histories.length === 1 ? "request" : "requests"}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearAll}
          disabled={clearHistory.isPending}
          className="text-zinc-400 hover:text-red-400"
        >
          {clearHistory.isPending ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
          <span className="ml-2 text-xs">Clear All</span>
        </Button>
      </div>

      {/* History List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {histories.map((history) => {
            const statusConfigItem = statusConfig[history.status];
            const StatusIcon = statusConfigItem.icon;

            return (
              <div
                key={history.id}
                className="group relative p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all"
              >
                {/* Header: Method, Name, Delete */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-xs font-bold ${methodColors[history.method] || "text-zinc-400"}`}>
                      {history.method}
                    </span>
                    <span className="text-sm font-medium text-zinc-200 truncate">
                      {history.requestName}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(history.id)}
                    disabled={deletingId === history.id}
                  >
                    {deletingId === history.id ? (
                      <Loader className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3 text-zinc-500 hover:text-red-400" />
                    )}
                  </Button>
                </div>

                {/* URL */}
                <p className="text-xs text-zinc-500 truncate mb-2" title={history.url}>
                  {history.url}
                </p>

                {/* Metadata Row */}
                <div className="flex items-center gap-3 text-xs">
                  {/* Status Badge */}
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded ${statusConfigItem.bgColor}`}>
                    <StatusIcon className={`w-3 h-3 ${statusConfigItem.color}`} />
                    <span className={statusConfigItem.color}>
                      {history.httpStatus ? `${history.httpStatus} ${statusConfigItem.label}` : statusConfigItem.label}
                    </span>
                  </div>

                  {/* Time */}
                  <span className="text-zinc-500">
                    {formatDistanceToNow(new Date(history.createdAt), { addSuffix: true })}
                  </span>
                </div>

                {/* Collection & Workspace Info */}
                <div className="mt-2 pt-2 border-t border-zinc-800/50 space-y-1">
                  {history.collectionName && (
                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                      <Folder className="w-3 h-3" />
                      <span className="truncate">{history.collectionName}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-xs text-zinc-500">
                    <Building className="w-3 h-3" />
                    <span className="truncate">{history.workspaceName}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
