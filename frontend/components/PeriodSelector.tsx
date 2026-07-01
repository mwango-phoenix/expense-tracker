import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import colours from '@/constants/colours';
import analyticsStyles from '@/styles/analytics.styles';
import { TimePeriod } from '@/utils/dateRange';

interface PeriodSelectorProps {
  value: TimePeriod;
  onChange: (period: TimePeriod) => void;
}

const PERIODS: { key: TimePeriod; label: string }[] = [
  { key: 'day', label: 'Day' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
];

export default function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <View style={analyticsStyles.periodSelectorContainer}>
      {PERIODS.map((period) => {
        const active = value === period.key;
        return (
          <TouchableOpacity
            key={period.key}
            style={[
              analyticsStyles.periodSelectorButton,
              active && analyticsStyles.periodSelectorButtonActive,
            ]}
            onPress={() => onChange(period.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                analyticsStyles.periodSelectorText,
                { color: active ? colours.background : colours.textSecondary },
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
