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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      let headers = undefined;
      let parameters = undefined;
      let body = undefined;

      try { if (tab.headers) headers = JSON.parse(tab.headers); } catch(e) {}
      try { if (tab.parameters) parameters = JSON.parse(tab.parameters); } catch(e) {}
      try { if (tab.body) body = JSON.parse(tab.body); } catch(e) { body = tab.body; }

      return await runDirect({
        id: tab.requestId,
        method: tab.method,
        url: tab.url,
        headers,
        parameters,
        body,
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      setResponseViewerData(data as any);
    },
  });
}