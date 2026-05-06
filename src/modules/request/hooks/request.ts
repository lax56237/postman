import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addRequestToCollection,
  getAllRequestFromCollection,
  Request,
  run,
  saveRequest,
} from "../actions";
import { useRequestPlaygroundStore } from "../store/useRequestStore";

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

export function useRunRequest(requestId: string) {

  const {setResponseViewerData} = useRequestPlaygroundStore();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => await run(requestId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      if (data && data.result) {
        setResponseViewerData({ ...data.result, success: true, requestRun: { id: requestId } });
      } else if (data && data.error) {
        setResponseViewerData({ ...data.error, success: false, requestRun: requestId });
      }
    },
  });
}