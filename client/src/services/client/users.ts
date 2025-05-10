import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@/@types/db";
import { 
  getUsers, 
  getUser, 
  createUser, 
  updateUser, 
  deleteUser,
  CreateUserPayload,
  UpdateUserPayload 
} from "@/services/server/users";
import { QUERY_KEYS } from "./query-keys";
import { toast } from "sonner";

// Get all users with optional filtering
export const useUsers = (payload?: { params?: Record<string, string | number | boolean> }) => {
  return useQuery({
    queryKey: [QUERY_KEYS.get_users, payload],
    queryFn: async () => {
      return getUsers(payload);
    },
  });
};

// Get a single user by ID
export const useUser = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.get_user, id],
    queryFn: async () => {
      return getUser(id);
    },
    enabled: !!id,
  });
};

// Create a new user
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: [QUERY_KEYS.create_user],
    mutationFn: (payload: CreateUserPayload) => {
      return createUser(payload);
    },
    onSuccess: (data) => {
      if (data?.data) {
        toast.success("User created successfully");
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.get_users] });
      } else {
        toast.error(data?.message || "Failed to create user");
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.message || "An error occurred while creating the user"
      );
    },
  });
};

// Update an existing user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: [QUERY_KEYS.update_user],
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserPayload }) => {
      return updateUser(id, payload);
    },
    onSuccess: (data) => {
      if (data?.data) {
        toast.success("User updated successfully");
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.get_users] });
        queryClient.invalidateQueries({ 
          queryKey: [QUERY_KEYS.get_user, data.data.id] 
        });
      } else {
        toast.error(data?.message || "Failed to update user");
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.message || "An error occurred while updating the user"
      );
    },
  });
};

// Delete a user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: [QUERY_KEYS.delete_user],
    mutationFn: (id: string) => {
      return deleteUser(id);
    },
    onSuccess: (data) => {
      if (data?.status === 204 || data?.data) {
        toast.success("User deleted successfully");
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.get_users] });
      } else {
        toast.error(data?.message || "Failed to delete user");
      }
    },
    onError: (error: any) => {
      toast.error(
        error?.message || "An error occurred while deleting the user"
      );
    },
  });
};
