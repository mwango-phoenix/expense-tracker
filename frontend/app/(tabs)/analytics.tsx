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
import COLOURS from '@/constants/colours';
import SpendingChart, { CategoryBreakdownItem } from '@/components/SpendingChart';
import { useAuthStore } from '@/store/authStore';
import styles from '@/styles/home.styles';

export default function Analytics() {
  const { token } = useAuthStore() as { token: string | null };
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [chartData, setChartData] = useState<CategoryBreakdownItem[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:3001";

  const categoryColors: { [key: string]: string } = {
    Food: COLOURS.primary,
    Transport: COLOURS.secondary,
    Entertainment: COLOURS.warning,
    Shopping: '#A78BFA',
    Bills: '#FB923C',
    Healthcare: '#F472B6',
    Education: '#34D399',
    Other: COLOURS.info,
  };

  const fetchCategoryBreakdown = async () => {
    try {
      const response = await fetch(`${API_URL}/api/dashboard/summary?period=month`, {
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
            color: categoryColors[category] || COLOURS.textDisabled,
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

  useEffect(() => {
    if (token) {
      fetchCategoryBreakdown();
    }
  }, [token]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCategoryBreakdown();
  };

  const TopCategoryInsight = () => {
    if (chartData.length === 0) return null;
    
    return (
      <View style={insightCardStyle}>
        <Text style={insightLabelStyle}>🏆 Top Category</Text>
        <Text style={insightValueStyle}>
          {chartData[0]?.text || 'N/A'}
        </Text>
        <Text style={insightAmountStyle}>
          ${chartData[0]?.value.toFixed(2) || '0.00'}
        </Text>
        <Text style={insightPercentageStyle}>
          {totalExpenses > 0
            ? `${((chartData[0]?.value / totalExpenses) * 100).toFixed(1)}% of total spending`
            : '0%'}
        </Text>
      </View>
    );
  };


  const TotalSpendingInsight = () => {
    return (
      <View style={insightCardStyle}>
        <Text style={insightLabelStyle}>💰 Total Spending</Text>
        <Text style={insightValueStyle}>
          ${totalExpenses.toFixed(2)}
        </Text>
        <Text style={insightPercentageStyle}>
          This month
        </Text>
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
          tintColor={COLOURS.primary}
        />
      }
    >
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Analytics</Text>
        <View style={chartToggleContainerStyle}>
          <TouchableOpacity
            style={[
              chartToggleButtonStyle,
              chartType === 'pie' && chartToggleButtonActiveStyle
            ]}
            onPress={() => setChartType('pie')}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="pie-chart" 
              size={20} 
              color={chartType === 'pie' ? COLOURS.background : COLOURS.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              chartToggleButtonStyle,
              chartType === 'bar' && chartToggleButtonActiveStyle
            ]}
            onPress={() => setChartType('bar')}
            activeOpacity={0.7}
          >
            <Ionicons 
              name="bar-chart" 
              size={20} 
              color={chartType === 'bar' ? COLOURS.background : COLOURS.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={loadingContainerStyle}>
          <ActivityIndicator size="large" color={COLOURS.primary} />
          <Text style={loadingTextStyle}>Loading analytics...</Text>
        </View>
      ) : chartData.length === 0 ? (
        <View style={emptyContainerStyle}>
          <Ionicons name="pie-chart-outline" size={64} color={COLOURS.textDisabled} />
          <Text style={emptyTextStyle}>No expense data available</Text>
          <Text style={emptySubtextStyle}>
            Start adding expenses to see your spending breakdown
          </Text>
        </View>
      ) : (
        <>
          <SpendingChart data={chartData} totalExpenses={totalExpenses} chartType={chartType} />
          
          <View style={insightsContainerStyle}>
            <Text style={insightsTitleStyle}>💡 Insights</Text>
            
            <TotalSpendingInsight />
            <TopCategoryInsight />
          </View>
        </>
      )}
    </ScrollView>
  );
}

// Styles
const loadingContainerStyle = {
  paddingVertical: 60,
  alignItems: 'center' as const,
};

const loadingTextStyle = {
  marginTop: 16,
  fontSize: 16,
  color: COLOURS.textSecondary,
};

const emptyContainerStyle = {
  paddingVertical: 60,
  alignItems: 'center' as const,
};

const emptyTextStyle = {
  marginTop: 16,
  fontSize: 18,
  fontWeight: '600' as const,
  color: COLOURS.textPrimary,
};

const emptySubtextStyle = {
  marginTop: 8,
  fontSize: 14,
  color: COLOURS.textSecondary,
  textAlign: 'center' as const,
  paddingHorizontal: 40,
};

const insightsContainerStyle = {
  marginTop: 24,
  paddingTop: 20,
  borderTopWidth: 1,
  borderTopColor: COLOURS.border,
  paddingBottom: 20,
};

const insightsTitleStyle = {
  fontSize: 18,
  fontWeight: '600' as const,
  color: COLOURS.textPrimary,
  marginBottom: 12,
};

const insightCardStyle = {
  backgroundColor: COLOURS.card,
  borderRadius: 12,
  padding: 16,
  marginBottom: 12,
  borderWidth: 1,
  borderColor: COLOURS.border,
};

const insightLabelStyle = {
  fontSize: 13,
  color: COLOURS.textSecondary,
  marginBottom: 6,
};

const insightValueStyle = {
  fontSize: 24,
  fontWeight: 'bold' as const,
  color: COLOURS.textPrimary,
  marginBottom: 4,
};

const insightAmountStyle = {
  fontSize: 20,
  fontWeight: '600' as const,
  color: COLOURS.primary,
  marginBottom: 4,
};

const insightPercentageStyle = {
  fontSize: 14,
  color: COLOURS.textSecondary,
};

const chartToggleContainerStyle = {
  flexDirection: 'row' as const,
  backgroundColor: COLOURS.card,
  borderRadius: 8,
  padding: 4,
  borderWidth: 1,
  borderColor: COLOURS.border,
};

const chartToggleButtonStyle = {
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 6,
};

const chartToggleButtonActiveStyle = {
  backgroundColor: COLOURS.primary,
};
