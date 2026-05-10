import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addRequestToCollection,
  getAllRequestFromCollection,
  Request,
  run,
  runDirect,
  saveRequest,
} from "../actions";
import { useRequestPlaygroundStore, RequestTab } from "../store/useRequestStore";
import { createHistory, updateHistoryStatus } from "@/modules/history/actions";
import { useWorkspaceStore } from "@/modules/Layout/store";
import { HISTORY_STATUS, REST_METHOD } from "@prisma/client";

export function useAddRequestToCollection(collectionId: string) {
  const queryClient = useQueryClient();
  const { updateTabFromSavedRequest, activeTabId } = useRequestPlaygroundStore();
  return useMutation({
    mutationFn: async (value: Request) => addRequestToCollection(collectionId, value),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["requests", collectionId] });
      // @ts-ignore
      updateTabFromSavedRequest(activeTabId!, data);
    },
  });
}

export function useGetAllRequestFromCollection(collectionId: string) {

  return useQuery({
    queryKey: ["requests", collectionId],
    queryFn: async () => getAllRequestFromCollection(collectionId),
    enabled: !!collectionId,
  });
}

export function useSaveRequest(id: string) {
  const { updateTabFromSavedRequest, activeTabId } = useRequestPlaygroundStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (value: Request) => saveRequest(id, value),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });

      // @ts-ignore
      updateTabFromSavedRequest(activeTabId!, data);
    },
  });
}

export function useRunRequest(tab: RequestTab) {
  const { setResponseViewerData } = useRequestPlaygroundStore();
  const { selectedWorkspace } = useWorkspaceStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      let headers = undefined;
      let parameters = undefined;
      let body = undefined;

      try { if (tab.headers) headers = JSON.parse(tab.headers); } catch(e) {}
      try { if (tab.parameters) parameters = JSON.parse(tab.parameters); } catch(e) {}
      try { if (tab.body) body = JSON.parse(tab.body); } catch(e) { body = tab.body; }

      // Create history entry with PENDING status
      let historyId: string | null = null;
      if (selectedWorkspace) {
        try {
          const history = await createHistory({
            workspaceId: selectedWorkspace.id,
            workspaceName: selectedWorkspace.name,
            collectionId: tab.collectionId,
            collectionName: undefined, // Will be populated on the server if needed
            requestId: tab.requestId,
            requestName: tab.title || "Untitled Request",
            method: tab.method as REST_METHOD,
            url: tab.url,
            status: HISTORY_STATUS.PENDING,
          });
          historyId = history.id;
        } catch (e) {
          console.error("Failed to create history entry:", e);
        }
      }

      // Send the request
      const result = await runDirect({
        id: tab.requestId,
        method: tab.method,
        url: tab.url,
        headers,
        parameters,
        body,
      });

      // Update history with final status
      if (historyId) {
        try {
          const isSuccess = result.success && result.requestRun && result.requestRun.status >= 200 && result.requestRun.status < 300;
          await updateHistoryStatus(
            historyId,
            isSuccess ? HISTORY_STATUS.SUCCESS : HISTORY_STATUS.FAILED,
            result.requestRun?.status
          );
        } catch (e) {
          console.error("Failed to update history entry:", e);
        }
      }

      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["history", "workspace", selectedWorkspace?.id] });
      queryClient.invalidateQueries({ queryKey: ["history", "user"] });
      setResponseViewerData(data as any);
    },
  });
}