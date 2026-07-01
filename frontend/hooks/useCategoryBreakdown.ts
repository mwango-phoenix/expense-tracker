import { useEffect, useState, useCallback } from 'react';
import { CategoryBreakdownItem } from '@/components/SpendingChart';
import { TimePeriod, getPeriodRange } from '@/utils/dateRange';
import colours from '@/constants/colours';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3001';

const CATEGORY_COLOR_PALETTE: string[] = [
  colours.primary,
  colours.secondary,
  colours.warning,
  '#A78BFA', // violet
  '#FB923C', // orange
  '#F472B6', // pink
  '#34D399', // emerald
  colours.info,
  '#F87171', // red
  '#FACC15', // yellow
  '#818CF8', // indigo
  '#2DD4BF', // teal
];

const getCategoryColor = (category: string) => {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = (hash * 31 + category.charCodeAt(i)) >>> 0;
  }
  return CATEGORY_COLOR_PALETTE[hash % CATEGORY_COLOR_PALETTE.length];
};

interface UseCategoryBreakdownResult {
  chartData: CategoryBreakdownItem[];
  totalExpenses: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Fetches the expense category breakdown for a given period
export function useCategoryBreakdown(
  token: string | null,
  period: TimePeriod
): UseCategoryBreakdownResult {
  const [chartData, setChartData] = useState<CategoryBreakdownItem[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const refetch = useCallback(() => setRefreshIndex((i) => i + 1), []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const { start, end } = getPeriodRange(period);

    (async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/dashboard/summary?period=${period}&type=expense&startDate=${start.toISOString()}&endDate=${end.toISOString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || 'Failed to load category breakdown');
        }

        const breakdown = data.summary?.categoryBreakdown ?? {};
        const total = data.summary?.totalExpenses || 0;

        const formattedData: CategoryBreakdownItem[] = Object.entries(breakdown)
          .map(([category, value]) => ({
            value: value as number,
            color: getCategoryColor(category),
            text: category,
          }))
          .sort((a, b) => b.value - a.value);

        setChartData(formattedData);
        setTotalExpenses(total);
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        console.error('Error fetching category breakdown:', err);
        setError(err?.message || 'Failed to load category breakdown');
        setChartData([]);
        setTotalExpenses(0);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [token, period, refreshIndex]);

  return { chartData, totalExpenses, loading, error, refetch };
}
