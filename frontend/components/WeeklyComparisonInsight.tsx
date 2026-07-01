import React from 'react';
import { View, Text } from 'react-native';
import colours from '@/constants/colours';
import analyticsStyles from '@/styles/analytics.styles';
import { WeeklyComparisonData } from '@/hooks/useWeeklyComparison';

interface WeeklyComparisonInsightProps {
  weeklyData: WeeklyComparisonData | null;
}

export default function WeeklyComparisonInsight({ weeklyData }: WeeklyComparisonInsightProps) {
  if (!weeklyData) return null;

  const { currentWeek, previousWeek, difference, percentageChange } = weeklyData;
  const isIncrease = difference > 0;
  const isDecrease = difference < 0;

  let message = 'Same as last week';
  let trendColor: string = colours.textSecondary;

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
}
