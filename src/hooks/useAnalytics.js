import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analyticsService';

export const useOverview = () => {
  return useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: async () => {
      const { data } = await analyticsService.getOverview();
      return data.data;
    },
    refetchInterval: 30000,
    staleTime: 15000,
  });
};

export const useTimeseries = (hours = 24) => {
  return useQuery({
    queryKey: ['analytics', 'timeseries', hours],
    queryFn: async () => {
      const { data } = await analyticsService.getTimeseries(hours);
      return data.data.timeseries;
    },
    refetchInterval: 60000,
    staleTime: 30000,
  });
};

export const useLogs = (params = {}) => {
  return useQuery({
    queryKey: ['analytics', 'logs', params],
    queryFn: async () => {
      const { data } = await analyticsService.getLogs(params);
      return data.data;
    },
    refetchInterval: 10000,
    staleTime: 5000,
  });
};