import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createHistory,
  updateHistoryStatus,
  getUserHistory,
  getWorkspaceHistory,
  deleteHistory,
  clearUserHistory,
  CreateHistoryParams,
} from "../actions";
import { HISTORY_STATUS } from "@prisma/client";

export function useUserHistory() {
  return useQuery({
    queryKey: ["history", "user"],
    queryFn: async () => getUserHistory(),
  });
}

export function useWorkspaceHistory(workspaceId: string) {
  return useQuery({
    queryKey: ["history", "workspace", workspaceId],
    queryFn: async () => getWorkspaceHistory(workspaceId),
    enabled: !!workspaceId,
  });
}

export function useCreateHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateHistoryParams) => createHistory(params),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["history", "user"] });
      queryClient.invalidateQueries({ queryKey: ["history", "workspace", data.workspaceId] });
    },
  });
}

export function useUpdateHistoryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      historyId,
      status,
      httpStatus,
    }: {
      historyId: string;
      status: HISTORY_STATUS;
      httpStatus?: number;
    }) => updateHistoryStatus(historyId, status, httpStatus),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["history", "user"] });
      queryClient.invalidateQueries({ queryKey: ["history", "workspace", data.workspaceId] });
    },
  });
}

export function useDeleteHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (historyId: string) => deleteHistory(historyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}

export function useClearHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => clearUserHistory(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}
