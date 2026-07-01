// components/SpendingChart.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PieChart, BarChart } from 'react-native-gifted-charts';
import { Ionicons } from '@expo/vector-icons';
import COLOURS from "../constants/colours";
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
  chartType?: 'pie' | 'bar';
  title?: string;
}

export default function SpendingChart({ data, totalExpenses, chartType = 'pie', title = 'Monthly Spending' }: SpendingChartProps) {
  const [selectedBar, setSelectedBar] = useState<number | null>(null);

  useEffect(() => {
    setSelectedBar(null);
  }, [data, totalExpenses, chartType, title]);

  const chartKey = `${title}-${totalExpenses}-${data.map((d) => `${d.text}:${d.value}`).join(',')}`;

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

  const renderBarChart = () => {
    const maxValue = Math.max(...data.map(d => d.value));
    const roundedMax = Math.ceil(maxValue / 10) * 10;
    const stepValue = roundedMax / 5;

    const barData = data.map((item, index) => ({
      value: item.value,
      label: item.text.length > 8 ? item.text.substring(0, 8) + '...' : item.text,
      frontColor: item.color,
      labelTextStyle: { color: COLOURS.textSecondary, fontSize: 10 },
      onPress: () => setSelectedBar(index),
    }));

    return (
      <View style={styles.barChartContainer}>
        <BarChart
          key={chartKey}
          data={barData}
          barWidth={32}
          spacing={20}
          roundedTop
          roundedBottom
          hideRules={false}
          rulesColor={COLOURS.border}
          rulesType="solid"
          xAxisThickness={1}
          yAxisThickness={1}
          xAxisColor={COLOURS.border}
          yAxisColor={COLOURS.border}
          yAxisTextStyle={{ color: COLOURS.textSecondary, fontSize: 10 }}
          noOfSections={5}
          maxValue={roundedMax}
          stepValue={stepValue}
          yAxisLabelTexts={[
            '0',
            formatCurrency(stepValue),
            formatCurrency(stepValue * 2),
            formatCurrency(stepValue * 3),
            formatCurrency(stepValue * 4),
            formatCurrency(roundedMax),
          ]}
          isAnimated
          animationDuration={800}
          barBorderRadius={4}
        />
        {selectedBar !== null && (
          <View style={styles.selectedBarInfo}>
            <View style={styles.selectedBarHeader}>
              <Text style={styles.selectedBarLabel}>{data[selectedBar].text}</Text>
              <TouchableOpacity 
                onPress={() => setSelectedBar(null)}
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={24} color={COLOURS.textSecondary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.selectedBarValue}>{formatCurrency(data[selectedBar].value)}</Text>
            <Text style={styles.selectedBarPercentage}>
              {((data[selectedBar].value / totalExpenses) * 100).toFixed(1)}% of total
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderPieChart = () => {
    return (
      <View style={styles.chartRow}>
        {/* The Donut Chart */}
        <View style={styles.chartWrapper}>
          <PieChart
            key={chartKey}
            data={data}
            donut
            showText={false}
            radius={70}
            innerRadius={45}
            innerCircleColor={COLOURS.card}
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
    );
  };

  if (!data || data.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>
      
      {chartType === 'pie' ? renderPieChart() : renderBarChart()}
    </View>
  );
}
