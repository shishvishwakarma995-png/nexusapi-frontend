import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apisService, keysService } from '../services/apiService';

// =====================
// APIs Hooks
// =====================
export const useApis = () => {
  return useQuery({
    queryKey: ['apis'],
    queryFn: async () => {
      const { data } = await apisService.getAll();
      return data.data.apis;
    },
    staleTime: 30000, // 30 seconds cache
  });
};

export const useCreateApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => apisService.create(formData),
    onSuccess: () => {
      // APIs list refresh ho jaayegi automatically
      queryClient.invalidateQueries({ queryKey: ['apis'] });
    },
  });
};

export const useDeleteApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => apisService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apis'] });
      queryClient.invalidateQueries({ queryKey: ['keys'] });
    },
  });
};

export const useUpdateApi = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => apisService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apis'] });
    },
  });
};

// =====================
// Keys Hooks
// =====================
export const useKeys = (apiId) => {
  return useQuery({
    queryKey: ['keys', apiId],
    queryFn: async () => {
      const { data } = await keysService.getAll(apiId ? { apiId } : {});
      return data.data.keys;
    },
    staleTime: 15000,
  });
};

export const useGenerateKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData) => keysService.generate(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keys'] });
    },
  });
};

export const useRevokeKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }) => keysService.revoke(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keys'] });
    },
  });
};

export const useRotateKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => keysService.rotate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keys'] });
    },
  });
};