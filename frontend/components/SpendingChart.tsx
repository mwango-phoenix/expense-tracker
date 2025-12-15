// components/SpendingChart.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { colours } from '@/constants/colours';
import styles from '@/styles/chart.styles';


export interface CategoryBreakdownItem {
  value: number;
  color: string;
  text: string;
  shiftText?: number;
}

interface SpendingChartProps {
  data: CategoryBreakdownItem[];
  totalExpenses: number;
}

export default function SpendingChart({ data, totalExpenses }: SpendingChartProps) {

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const renderLegend = () => {
    return (
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColorBox, { backgroundColor: item.color }]} />
            <Text style={styles.legendText} numberOfLines={1}>
              {item.text}
            </Text>
            <Text style={styles.legendValue}>
              {formatCurrency(item.value)}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  if (!data || data.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Monthly Spending</Text>

      <View style={styles.chartRow}>
        {/* The Donut Chart */}
        <View style={styles.chartWrapper}>
          <PieChart
            data={data}
            donut
            showText={false}
            radius={70}
            innerRadius={45}
            innerCircleColor={colours.cardBackground}
            centerLabelComponent={() => {
              return (
                <View style={styles.centerLabel}>
                  <Text style={styles.centerLabelText}>Total</Text>
                  <Text style={styles.centerLabelValue}>
                    {formatCurrency(totalExpenses)}
                  </Text>
                </View>
              );
            }}
          />
        </View>

        {/* The Legend List */}
        {renderLegend()}
      </View>
    </View>
  );
}
