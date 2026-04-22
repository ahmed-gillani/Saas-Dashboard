// src/hooks/useDashboard.ts
import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRevenueData() {
  return useQuery({
    queryKey: ['revenue-data'],
    queryFn: dashboardApi.getRevenueData,
    staleTime: 10 * 60 * 1000,
  });
}

export function useActivityData() {
  return useQuery({
    queryKey: ['activity-data'],
    queryFn: dashboardApi.getUserActivity,
    staleTime: 10 * 60 * 1000,
  });
}