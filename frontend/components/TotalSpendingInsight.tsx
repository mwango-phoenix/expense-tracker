import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colours from '@/constants/colours';
import analyticsStyles from '@/styles/analytics.styles';
import { CategoryBreakdownItem } from '@/components/SpendingChart';
import {
  TimePeriod,
  getPeriodRange,
  getPeriodLabel,
  formatDateRange,
  getDayCount,
  getWeekCount,
} from '@/utils/dateRange';

interface TotalSpendingInsightProps {
  totalExpenses: number;
  chartData: CategoryBreakdownItem[];
  period: TimePeriod;
  expanded: boolean;
  onToggle: () => void;
}

export default function TotalSpendingInsight({
  totalExpenses,
  chartData,
  period,
  expanded,
  onToggle,
}: TotalSpendingInsightProps) {
  const { start, end } = getPeriodRange(period);
  const dayCount = getDayCount(start, end);
  const weekCount = getWeekCount(start, end);

  return (
    <TouchableOpacity
      style={analyticsStyles.insightCard}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={analyticsStyles.accordionHeader}>
        <View style={{ flex: 1 }}>
          <Text style={analyticsStyles.insightLabel}>Total Spending</Text>
          <Text style={analyticsStyles.insightValue}>
            ${totalExpenses.toFixed(2)}
          </Text>
          <Text style={analyticsStyles.insightPercentage}>
            {getPeriodLabel(period)} ({formatDateRange(start, end)})
          </Text>
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={colours.textSecondary}
        />
      </View>

      {expanded && (
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
}
