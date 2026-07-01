import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colours from '@/constants/colours';
import SpendingChart, { CategoryBreakdownItem } from '@/components/SpendingChart';
import PeriodSelector from '@/components/PeriodSelector';
import { useAuthStore } from '@/store/authStore';
import styles from '@/styles/home.styles';
import analyticsStyles from '@/styles/analytics.styles';
import {
  TimePeriod,
  getPeriodRange,
  getPeriodLabel,
  getChartTitle,
  formatDateRange,
  getDayCount,
  getWeekCount,
} from '@/utils/dateRange';

export default function Analytics() {
  const { token } = useAuthStore() as { token: string | null };
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [chartData, setChartData] = useState<CategoryBreakdownItem[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month');
  const [weeklyData, setWeeklyData] = useState<{
    currentWeek: number;
    previousWeek: number;
    difference: number;
    percentageChange: number;
  } | null>(null);
  const [totalSpendingExpanded, setTotalSpendingExpanded] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:3001";

  // A palette of visually distinct colours. Any category is deterministically
  // mapped to one of these (via getCategoryColor below), so new/custom
  // categories always get their own colour instead of falling back to a
  // shared default.
  const categoryColorPalette: string[] = [
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
    return categoryColorPalette[hash % categoryColorPalette.length];
  };

  const fetchCategoryBreakdown = async () => {
    try {
      const response = await fetch(`${API_URL}/api/dashboard/summary?period=${selectedPeriod}&type=expense`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (response.ok && data.summary?.categoryBreakdown) {
        const breakdown = data.summary.categoryBreakdown;
        const total = data.summary.totalExpenses || 0;

        const formattedData: CategoryBreakdownItem[] = Object.entries(breakdown).map(
          ([category, value]) => ({
            value: value as number,
            color: getCategoryColor(category),
            text: category,
          })
        );

        formattedData.sort((a, b) => b.value - a.value);

        setChartData(formattedData);
        setTotalExpenses(total);
      }
    } catch (error) {
      console.error('Error fetching category breakdown:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchWeeklyComparison = async () => {
    try {
      // Get current week dates
      const now = new Date();
      const currentWeekStart = new Date(now);
      currentWeekStart.setDate(now.getDate() - now.getDay()); // Sunday
      currentWeekStart.setHours(0, 0, 0, 0);
      
      const currentWeekEnd = new Date(currentWeekStart);
      currentWeekEnd.setDate(currentWeekStart.getDate() + 6); // Saturday
      currentWeekEnd.setHours(23, 59, 59, 999);

      // Get previous week dates
      const previousWeekStart = new Date(currentWeekStart);
      previousWeekStart.setDate(currentWeekStart.getDate() - 7);
      
      const previousWeekEnd = new Date(currentWeekStart);
      previousWeekEnd.setDate(currentWeekStart.getDate() - 1);
      previousWeekEnd.setHours(23, 59, 59, 999);

      // Fetch current week data
      const currentWeekResponse = await fetch(
        `${API_URL}/api/dashboard/summary?period=week&type=expense&startDate=${currentWeekStart.toISOString()}&endDate=${currentWeekEnd.toISOString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const currentWeekData = await currentWeekResponse.json();

      // Fetch previous week data
      const previousWeekResponse = await fetch(
        `${API_URL}/api/dashboard/summary?period=week&type=expense&startDate=${previousWeekStart.toISOString()}&endDate=${previousWeekEnd.toISOString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const previousWeekData = await previousWeekResponse.json();

      const currentTotal = currentWeekData.summary?.totalExpenses || 0;
      const previousTotal = previousWeekData.summary?.totalExpenses || 0;
      const difference = currentTotal - previousTotal;
      const percentageChange = previousTotal > 0 
        ? ((difference / previousTotal) * 100) 
        : 0;

      setWeeklyData({
        currentWeek: currentTotal,
        previousWeek: previousTotal,
        difference,
        percentageChange,
      });
    } catch (error) {
      console.error('Error fetching weekly comparison:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCategoryBreakdown();
      fetchWeeklyComparison();
    }
  }, [token, selectedPeriod]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCategoryBreakdown();
    fetchWeeklyComparison();
  };


  const TotalSpendingInsight = () => {
    const { start, end } = getPeriodRange(selectedPeriod);
    const dayCount = getDayCount(start, end);
    const weekCount = getWeekCount(start, end);
    return (
      <TouchableOpacity 
        style={analyticsStyles.insightCard} 
        onPress={() => setTotalSpendingExpanded(!totalSpendingExpanded)}
        activeOpacity={0.7}
      >
        <View style={analyticsStyles.accordionHeader}>
          <View style={{ flex: 1 }}>
            <Text style={analyticsStyles.insightLabel}>Total Spending</Text>
            <Text style={analyticsStyles.insightValue}>
              ${totalExpenses.toFixed(2)}
            </Text>
            <Text style={analyticsStyles.insightPercentage}>
              {getPeriodLabel(selectedPeriod)} ({formatDateRange(start, end)})
            </Text>
          </View>
          <Ionicons 
            name={totalSpendingExpanded ? "chevron-up" : "chevron-down"} 
            size={24} 
            color={colours.textSecondary} 
          />
        </View>
        
        {totalSpendingExpanded && (
          <View style={analyticsStyles.accordionContent}>
            <View style={analyticsStyles.accordionItem}>
              <Text style={analyticsStyles.accordionItemLabel}>Average per day</Text>
              <Text style={analyticsStyles.accordionItemValue}>
                ${(totalExpenses / dayCount).toFixed(2)}
              </Text>
            </View>
            <View style={analyticsStyles.accordionItem}>
              <Text style={analyticsStyles.accordionItemLabel}>Avg per week</Text>
              <Text style={analyticsStyles.accordionItemValue}>
                ${(totalExpenses / weekCount).toFixed(2)}
              </Text>
            </View>
            {chartData.length > 0 && (
              <View style={analyticsStyles.accordionItem}>
                <Text style={analyticsStyles.accordionItemLabel}>Top category</Text>
                <Text style={analyticsStyles.accordionItemValue}>
                  {chartData[0]?.text} (${chartData[0]?.value.toFixed(2)})
                </Text>
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const WeeklyComparisonInsight = () => {
    if (!weeklyData) return null;

    const { currentWeek, previousWeek, difference, percentageChange } = weeklyData;
    const isIncrease = difference > 0;
    const isDecrease = difference < 0;

    let message = 'Same as last week';
    let trendColor = colours.textSecondary;

    if (isDecrease) {
      message = `You spent $${Math.abs(difference).toFixed(2)} less this week`;
      trendColor = colours.success;
    } else if (isIncrease) {
      message = `You spent $${difference.toFixed(2)} more this week`;
      trendColor = colours.error;
    }

    return (
      <View style={analyticsStyles.insightCard}>
        <Text style={analyticsStyles.insightLabel}>Weekly Comparison</Text>
        <Text style={analyticsStyles.insightValue}>
          ${currentWeek.toFixed(2)}
        </Text>
        <Text style={analyticsStyles.insightAmount}>
          This week vs last week
        </Text>
        <View style={analyticsStyles.weeklyComparisonDetails}>
          <Text style={[analyticsStyles.weeklyComparisonText, { color: trendColor }]}>
            {message}
          </Text>
          {previousWeek > 0 && difference !== 0 && (
            <Text style={analyticsStyles.weeklyComparisonSubtext}>
              {isDecrease ? '↓' : '↑'} {Math.abs(percentageChange).toFixed(1)}% vs last week (${previousWeek.toFixed(2)})
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top + 10 }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colours.primary}
        />
      }
    >
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Analytics</Text>
        <View style={analyticsStyles.chartToggleContainer}>
          <TouchableOpacity
            style={[
              analyticsStyles.chartToggleButton,
              chartType === 'pie' && analyticsStyles.chartToggleButtonActive
            ]}
            onPress={() => setChartType('pie')}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="pie-chart" 
              size={20} 
              color={chartType === 'pie' ? colours.background : colours.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              analyticsStyles.chartToggleButton,
              chartType === 'bar' && analyticsStyles.chartToggleButtonActive
            ]}
            onPress={() => setChartType('bar')}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="bar-chart" 
              size={20} 
              color={chartType === 'bar' ? colours.background : colours.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <PeriodSelector value={selectedPeriod} onChange={setSelectedPeriod} />

      {loading ? (
        <View style={analyticsStyles.loadingContainer}>
          <ActivityIndicator size="large" color={colours.primary} />
          <Text style={analyticsStyles.loadingText}>Loading analytics...</Text>
        </View>
      ) : chartData.length === 0 ? (
        <View style={analyticsStyles.emptyContainer}>
          <Ionicons name="pie-chart-outline" size={64} color={colours.textDisabled} />
          <Text style={analyticsStyles.emptyText}>
            No expenses {getPeriodLabel(selectedPeriod).toLowerCase()}
          </Text>
          <Text style={analyticsStyles.emptySubtext}>
            Start adding expenses to see your spending breakdown
          </Text>
        </View>
      ) : (
        <>
          <SpendingChart data={chartData} totalExpenses={totalExpenses} chartType={chartType} title={getChartTitle(selectedPeriod)} />
          
          <View style={analyticsStyles.insightsContainer}>
            <Text style={analyticsStyles.insightsTitle}>Insights</Text>
            <TotalSpendingInsight />
            <WeeklyComparisonInsight />
          </View>
        </>
      )}
    </ScrollView>
  );
}
