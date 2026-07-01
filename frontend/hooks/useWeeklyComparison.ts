import { useEffect, useState, useCallback } from 'react';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3001';

export interface WeeklyComparisonData {
  currentWeek: number;
  previousWeek: number;
  difference: number;
  percentageChange: number;
}

interface UseWeeklyComparisonResult {
  weeklyData: WeeklyComparisonData | null;
  refetch: () => void;
}

export function useWeeklyComparison(token: string | null): UseWeeklyComparisonResult {
  const [weeklyData, setWeeklyData] = useState<WeeklyComparisonData | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const refetch = useCallback(() => setRefreshIndex((i) => i + 1), []);

  useEffect(() => {
    if (!token) return;

    const controller = new AbortController();

    (async () => {
      try {
        const now = new Date();
        const currentWeekStart = new Date(now);
        currentWeekStart.setDate(now.getDate() - now.getDay());
        currentWeekStart.setHours(0, 0, 0, 0);

        const currentWeekEnd = new Date(currentWeekStart);
        currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
        currentWeekEnd.setHours(23, 59, 59, 999);

        const previousWeekStart = new Date(currentWeekStart);
        previousWeekStart.setDate(currentWeekStart.getDate() - 7);

        const previousWeekEnd = new Date(currentWeekStart);
        previousWeekEnd.setDate(currentWeekStart.getDate() - 1);
        previousWeekEnd.setHours(23, 59, 59, 999);

        const headers = { Authorization: `Bearer ${token}` };

        const [currentWeekResponse, previousWeekResponse] = await Promise.all([
          fetch(
            `${API_URL}/api/dashboard/summary?period=week&type=expense&startDate=${currentWeekStart.toISOString()}&endDate=${currentWeekEnd.toISOString()}`,
            { headers, signal: controller.signal }
          ),
          fetch(
            `${API_URL}/api/dashboard/summary?period=week&type=expense&startDate=${previousWeekStart.toISOString()}&endDate=${previousWeekEnd.toISOString()}`,
            { headers, signal: controller.signal }
          ),
        ]);

        const currentWeekData = await currentWeekResponse.json();
        const previousWeekData = await previousWeekResponse.json();

        const currentTotal = currentWeekData.summary?.totalExpenses || 0;
        const previousTotal = previousWeekData.summary?.totalExpenses || 0;
        const difference = currentTotal - previousTotal;
        const percentageChange = previousTotal > 0 ? (difference / previousTotal) * 100 : 0;

        setWeeklyData({
          currentWeek: currentTotal,
          previousWeek: previousTotal,
          difference,
          percentageChange,
        });
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        console.error('Error fetching weekly comparison:', err);
      }
    })();

    return () => controller.abort();
  }, [token, refreshIndex]);

  return { weeklyData, refetch };
}
