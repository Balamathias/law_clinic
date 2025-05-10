import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Publication, PublicationCategory } from "@/@types/db";

import { toast } from "sonner";

import {
    getPublications, 
    getPublication,
    createPublication,
    updatePublication,
    partialUpdatePublication,
    deletePublication,
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    partialUpdateCategory,
    deleteCategory,
    CreatePublicationPayload,
    UpdatePublicationPayload,
    CreateCategoryPayload,
    UpdateCategoryPayload
} from "@/services/server/publications";
import { QUERY_KEYS } from "./query-keys";


// Get all publications with optional filtering
export const usePublications = (payload?: { params?: Record<string, string | number | boolean> }) => {
    return useQuery({
        queryKey: [QUERY_KEYS.get_publications, payload],
        queryFn: async () => {
            return getPublications(payload);
        },
    });
};

// Get a single publication by ID
export const usePublication = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.get_publication, id],
        queryFn: async () => {
            return getPublication(id);
        },
        enabled: !!id,
    });
};

// Create a new publication
export const useCreatePublication = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationKey: [QUERY_KEYS.create_publication],
        mutationFn: (payload: CreatePublicationPayload) => {
            return createPublication(payload);
        },
        onSuccess: (data) => {
            if (data?.data) {
                toast.success("Publication created successfully");
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.get_publications] });
            } else {
                toast.error(data?.message || "Failed to create publication");
            }
        },
        onError: (error: any) => {
            toast.error(
                error?.message || "An error occurred while creating the publication"
            );
        },
    });
};

// Update an existing publication
export const useUpdatePublication = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationKey: [QUERY_KEYS.update_publication],
        mutationFn: ({ id, payload, partial = false }: { 
            id: string; 
            payload: UpdatePublicationPayload;
            partial?: boolean;
        }) => {
            return partial ? partialUpdatePublication(id, payload) : updatePublication(id, payload);
        },
        onSuccess: (data) => {
            if (data?.data) {
                toast.success("Publication updated successfully");
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.get_publications] });
                queryClient.invalidateQueries({ 
                    queryKey: [QUERY_KEYS.get_publication, data.data.id] 
                });
            } else {
                toast.error(data?.message || "Failed to update publication");
            }
        },
        onError: (error: any) => {
            toast.error(
                error?.message || "An error occurred while updating the publication"
            );
        },
    });
};

// Delete a publication
export const useDeletePublication = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationKey: [QUERY_KEYS.delete_publication],
        mutationFn: (id: string) => {
            return deletePublication(id);
        },
        onSuccess: (data) => {
            if (data?.status === 204 || data?.data === null) {
                toast.success("Publication deleted successfully");
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.get_publications] });
            } else {
                toast.error(data?.message || "Failed to delete publication");
            }
        },
        onError: (error: any) => {
            toast.error(
                error?.message || "An error occurred while deleting the publication"
            );
        },
    });
};

// Category hooks

// Get all categories with optional filtering
export const useCategories = (payload?: { params?: Record<string, string | number | boolean> }) => {
    return useQuery({
        queryKey: [QUERY_KEYS.get_categories, payload],
        queryFn: async () => {
            return getCategories(payload);
        },
    });
};

// Get a single category by ID
export const useCategory = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.get_category, id],
        queryFn: async () => {
            return getCategory(id);
        },
        enabled: !!id,
    });
};

// Create a new category
export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationKey: [QUERY_KEYS.create_category],
        mutationFn: (payload: CreateCategoryPayload) => {
            return createCategory(payload);
        },
        onSuccess: (data) => {
            if (data?.data) {
                toast.success("Category created successfully");
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.get_categories] });
            } else {
                toast.error(data?.message || "Failed to create category");
            }
        },
        onError: (error: any) => {
            toast.error(
                error?.message || "An error occurred while creating the category"
            );
        },
    });
};

// Update an existing category
export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationKey: [QUERY_KEYS.update_category],
        mutationFn: ({ id, payload, partial = false }: { 
            id: string; 
            payload: UpdateCategoryPayload;
            partial?: boolean;
        }) => {
            return partial ? partialUpdateCategory(id, payload) : updateCategory(id, payload);
        },
        onSuccess: (data) => {
            if (data?.data) {
                toast.success("Category updated successfully");
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.get_categories] });
                queryClient.invalidateQueries({ 
                    queryKey: [QUERY_KEYS.get_category, data.data.id] 
                });
            } else {
                toast.error(data?.message || "Failed to update category");
            }
        },
        onError: (error: any) => {
            toast.error(
                error?.message || "An error occurred while updating the category"
            );
        },
    });
};

// Delete a category
export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationKey: [QUERY_KEYS.delete_category],
        mutationFn: (id: string) => {
            return deleteCategory(id);
        },
        onSuccess: (data) => {
            if (data?.status === 204 || data?.data === null) {
                toast.success("Category deleted successfully");
                queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.get_categories] });
            } else {
                toast.error(data?.message || "Failed to delete category");
            }
        },
        onError: (error: any) => {
            toast.error(
                error?.message || "An error occurred while deleting the category"
            );
        },
    });
};