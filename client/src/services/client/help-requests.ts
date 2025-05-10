import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HelpRequest } from "@/@types/db";
import { toast } from "sonner";
import { QUERY_KEYS } from "./query-keys";

import {
    getHelpRequests,
    getHelpRequest,
    createHelpRequest,
    updateHelpRequest,
    partialUpdateHelpRequest,
    deleteHelpRequest,
    getHelpRequestStats,
    CreateHelpRequestPayload,
    UpdateHelpRequestPayload
} from "@/services/server/help-requests";

// Get all help requests with optional filtering
export const useHelpRequests = (payload?: { params?: Record<string, string | number | boolean> }) => {
return useQuery({
    queryKey: [QUERY_KEYS.get_help_requests, payload],
    queryFn: async () => {
        return getHelpRequests(payload);
    },
});
};

// Get a single help request by ID
export const useHelpRequest = (id: string) => {
return useQuery({
    queryKey: [QUERY_KEYS.get_help_request, id],
    queryFn: async () => {
        return getHelpRequest(id);
    },
    enabled: !!id,
});
};

// Get help request statistics
export const useHelpRequestStats = () => {
return useQuery({
    queryKey: [QUERY_KEYS.get_help_request_stats],
    queryFn: async () => {
        return getHelpRequestStats();
    },
});
};

// Create a new help request
export const useCreateHelpRequest = () => {
const queryClient = useQueryClient();

return useMutation({
    mutationKey: [QUERY_KEYS.create_help_request],
    mutationFn: (payload: CreateHelpRequestPayload) => {
        return createHelpRequest(payload);
    },
    onSuccess: (data) => {
        if (data?.data) {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.get_help_requests] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.get_help_request_stats] });
        } else {
            toast.error(data?.message || "Failed to submit help request");
        }
    },
    onError: (error: any) => {
        console.error(error)
        toast.error(
            error?.message || "An error occurred while submitting the help request"
        );
    },
});
};

// Update an existing help request
export const useUpdateHelpRequest = () => {
const queryClient = useQueryClient();

return useMutation({
    mutationKey: [QUERY_KEYS.update_help_request],
    mutationFn: ({ id, payload, partial = false }: { 
        id: string; 
        payload: UpdateHelpRequestPayload;
        partial?: boolean;
    }) => {
        return partial ? partialUpdateHelpRequest(id, payload) : updateHelpRequest(id, payload);
    },
    onSuccess: (data) => {
        if (data?.data) {
            toast.success("Help request updated successfully");
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.get_help_requests] });
            queryClient.invalidateQueries({ 
                queryKey: [QUERY_KEYS.get_help_request, data.data.id] 
            });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.get_help_request_stats] });
        } else {
            toast.error(data?.message || "Failed to update help request");
        }
    },
    onError: (error: any) => {
        toast.error(
            error?.message || "An error occurred while updating the help request"
        );
    },
});
};

// Delete a help request
export const useDeleteHelpRequest = () => {
const queryClient = useQueryClient();

return useMutation({
    mutationKey: [QUERY_KEYS.delete_help_request],
    mutationFn: (id: string) => {
        return deleteHelpRequest(id);
    },
    onSuccess: (data) => {
        if (data?.status === 204 || data?.data === null) {
            toast.success("Help request deleted successfully");
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.get_help_requests] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.get_help_request_stats] });
        } else {
            toast.error(data?.message || "Failed to delete help request");
        }
    },
    onError: (error: any) => {
        toast.error(
            error?.message || "An error occurred while deleting the help request"
        );
    },
});
};