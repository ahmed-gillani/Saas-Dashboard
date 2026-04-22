// // src/api/dashboardApi.ts
// import type {
//   DashboardStats,
//   RevenueData,
//   UserActivity,
//   TopUser
// } from './dashboardApi.types';

// // Mock data for dashboard (you can later move to Firestore)
// const MOCK_STATS: DashboardStats = {
//   revenue: 48200,
//   totalUsers: 2847,
//   totalRevenue: 48200,
//   activeSessions: 342,
//   churnRate: 3.2,
//   newUsersThisMonth: 312,
//   revenueChange: 8.3,
//   sessionChange: -2.1,
//   churnChange: -0.5,
// };

// const MOCK_REVENUE: RevenueData[] = [
//   { month: 'Jan', revenue: 28000, target: 30000 },
//   { month: 'Feb', revenue: 35000, target: 32000 },
//   { month: 'Mar', revenue: 22000, target: 35000 },
//   { month: 'Apr', revenue: 42000, target: 38000 },
//   { month: 'May', revenue: 38000, target: 40000 },
//   { month: 'Jun', revenue: 48000, target: 45000 },
//   { month: 'Jul', revenue: 44000, target: 48000 },
// ];

// export type { TopUser };

// export const dashboardApi = {
//   getStats: async (): Promise<DashboardStats> => MOCK_STATS,

//   getRevenueData: async (): Promise<RevenueData[]> => MOCK_REVENUE,

//   getUserActivity: async (): Promise<UserActivity[]> => {
//     // TODO: Later fetch from Firestore
//     return [];
//   },

//   getTopUsers: async (): Promise<TopUser[]> => {
//     // TODO: Later fetch from Firestore 'users' collection
//     return [];
//   },
// };

// src/api/dashboardApi.ts
import type {
  DashboardStats,
  RevenueData,
  UserActivity,
  TopUser
} from './dashboardApi.types';

// Mock data for dashboard (you can later move to Firestore)
const MOCK_STATS: DashboardStats = {
  revenue: 48200,
  totalUsers: 2847,
  totalRevenue: 48200,
  activeSessions: 342,
  churnRate: 3.2,
  newUsersThisMonth: 312,
  revenueChange: 8.3,
  sessionChange: -2.1,
  churnChange: -0.5,
};

const MOCK_REVENUE: RevenueData[] = [
  { month: 'Jan', revenue: 28000, target: 30000 },
  { month: 'Feb', revenue: 35000, target: 32000 },
  { month: 'Mar', revenue: 22000, target: 35000 },
  { month: 'Apr', revenue: 42000, target: 38000 },
  { month: 'May', revenue: 38000, target: 40000 },
  { month: 'Jun', revenue: 48000, target: 45000 },
  { month: 'Jul', revenue: 44000, target: 48000 },
];

// FIX: User Activity chart was blank because this returned [].
// Now it returns 30 days of realistic mock data so the chart renders correctly.
// TODO: Replace with a real Firestore fetch when the collection is set up.
function generateActivityData(): UserActivity[] {
  const data: UserActivity[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    // Generate realistic-looking daily numbers with a slight upward trend
    const base = 30 - i;
    data.push({
      date: dateStr,
      logins: Math.round(80 + base * 2 + Math.random() * 40),
      signups: Math.round(5 + base * 0.4 + Math.random() * 10),
    });
  }
  return data;
}

export type { TopUser };

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => MOCK_STATS,

  getRevenueData: async (): Promise<RevenueData[]> => MOCK_REVENUE,

  getUserActivity: async (): Promise<UserActivity[]> => generateActivityData(),

  getTopUsers: async (): Promise<TopUser[]> => {
    // TODO: Later fetch from Firestore 'users' collection
    return [];
  },
};