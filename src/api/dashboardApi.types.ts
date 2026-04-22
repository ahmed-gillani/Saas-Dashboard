// src/api/dashboardApi.types.ts
export interface DashboardStats {
  revenue: number;
  totalUsers: number;
  totalRevenue: number;
  activeSessions: number;
  churnRate: number;
  newUsersThisMonth: number;
  revenueChange: number;
  sessionChange: number;
  churnChange: number;
}

export interface RevenueData {
  month: string;
  revenue: number;
  target: number;
}

export interface UserActivity {
  date: string;
  logins: number;
  signups: number;
}

export interface TopUser {
  id: string;
  name: string;
  email: string;
  role: string;
  lastActive: string;
  status: 'active' | 'inactive';
}