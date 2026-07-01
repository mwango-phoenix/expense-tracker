import React, { useState } from 'react';
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
import SpendingChart from '@/components/SpendingChart';
import PeriodSelector from '@/components/PeriodSelector';
import TotalSpendingInsight from '@/components/TotalSpendingInsight';
import WeeklyComparisonInsight from '@/components/WeeklyComparisonInsight';
import { useAuthStore } from '@/store/authStore';
import { useCategoryBreakdown } from '@/hooks/useCategoryBreakdown';
import { useWeeklyComparison } from '@/hooks/useWeeklyComparison';
import styles from '@/styles/home.styles';
import analyticsStyles from '@/styles/analytics.styles';
import { TimePeriod, getPeriodLabel, getChartTitle } from '@/utils/dateRange';

export default function Analytics() {
  const { token } = useAuthStore() as { token: string | null };
  const insets = useSafeAreaInsets();

  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month');
  const [totalSpendingExpanded, setTotalSpendingExpanded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const {
    chartData,
    totalExpenses,
    loading,
    refetch: refetchBreakdown,
  } = useCategoryBreakdown(token, selectedPeriod);
  const { weeklyData, refetch: refetchWeekly } = useWeeklyComparison(token);

  const onRefresh = () => {
    setRefreshing(true);
    refetchBreakdown();
    refetchWeekly();
    // Both hooks manage their own loading state; this just drives the
    // pull-to-refresh spinner for a beat so it doesn't feel instantaneous.
    setTimeout(() => setRefreshing(false), 500);
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
      ) : (
        <>
          {chartData.length === 0 ? (
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
            <SpendingChart
              data={chartData}
              totalExpenses={totalExpenses}
              chartType={chartType}
              title={getChartTitle(selectedPeriod)}
            />
          )}

          <View style={analyticsStyles.insightsContainer}>
            <Text style={analyticsStyles.insightsTitle}>Insights</Text>
            <TotalSpendingInsight
              totalExpenses={totalExpenses}
              chartData={chartData}
              period={selectedPeriod}
              expanded={totalSpendingExpanded}
              onToggle={() => setTotalSpendingExpanded((prev) => !prev)}
            />
            <WeeklyComparisonInsight weeklyData={weeklyData} />
          </View>
        </>
      )}
    </ScrollView>
  );
}
