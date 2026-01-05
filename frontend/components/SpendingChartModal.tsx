// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   Modal,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import COLOURS from '../constants/colours';
// import SpendingChart, { CategoryBreakdownItem } from './SpendingChart';
// import { useAuthStore } from '@/store/authStore';

// interface SpendingChartModalProps {
//   visible: boolean;
//   onClose: () => void;
// }

// export default function SpendingChartModal({ visible, onClose }: SpendingChartModalProps) {
//   const { token } = useAuthStore() as { token: string | null };
//   const [loading, setLoading] = useState(true);
//   const [chartData, setChartData] = useState<CategoryBreakdownItem[]>([]);
//   const [totalExpenses, setTotalExpenses] = useState(0);

//   const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:3001";

//   // Predefined color palette for categories
//   const categoryColors: { [key: string]: string } = {
//     Food: COLOURS.primary,
//     Transport: COLOURS.secondary,
//     Entertainment: COLOURS.warning,
//     Shopping: '#A78BFA',
//     Bills: '#FB923C',
//     Healthcare: '#F472B6',
//     Education: '#34D399',
//     Other: COLOURS.info,
//   };

//   const fetchCategoryBreakdown = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/api/dashboard/summary?period=month`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = await response.json();

//       if (response.ok && data.summary?.categoryBreakdown) {
//         const breakdown = data.summary.categoryBreakdown;
//         const total = data.summary.totalExpenses || 0;

//         // Transform the data for the chart
//         const formattedData: CategoryBreakdownItem[] = Object.entries(breakdown).map(
//           ([category, value]) => ({
//             value: value as number,
//             color: categoryColors[category] || COLOURS.textDisabled,
//             text: category,
//           })
//         );

//         // Sort by value descending
//         formattedData.sort((a, b) => b.value - a.value);

//         setChartData(formattedData);
//         setTotalExpenses(total);
//       }
//     } catch (error) {
//       console.error('Error fetching category breakdown:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (visible && token) {
//       fetchCategoryBreakdown();
//     }
//   }, [visible, token]);

//   return (
//     <Modal
//       visible={visible}
//       animationType="slide"
//       transparent={true}
//       onRequestClose={onClose}
//     >
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContent}>
//           {/* Header */}
//           <View style={styles.modalHeader}>
//             <Text style={styles.modalTitle}>Spending Breakdown</Text>
//             <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//               <Ionicons name="close" size={24} color={COLOURS.textPrimary} />
//             </TouchableOpacity>
//           </View>

//           {/* Content */}
//           <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
//             {loading ? (
//               <View style={styles.loadingContainer}>
//                 <ActivityIndicator size="large" color={COLOURS.primary} />
//                 <Text style={styles.loadingText}>Loading chart...</Text>
//               </View>
//             ) : chartData.length === 0 ? (
//               <View style={styles.emptyContainer}>
//                 <Ionicons name="pie-chart-outline" size={64} color={COLOURS.textDisabled} />
//                 <Text style={styles.emptyText}>No expense data available</Text>
//                 <Text style={styles.emptySubtext}>
//                   Start adding expenses to see your spending breakdown
//                 </Text>
//               </View>
//             ) : (
//               <>
//                 <SpendingChart data={chartData} totalExpenses={totalExpenses} />
                
//                 {/* Additional insights */}
//                 <View style={styles.insightsContainer}>
//                   <Text style={styles.insightsTitle}>💡 Insights</Text>
//                   <View style={styles.insightCard}>
//                     <Text style={styles.insightLabel}>Top Category</Text>
//                     <Text style={styles.insightValue}>
//                       {chartData[0]?.text || 'N/A'} - ${chartData[0]?.value.toFixed(2) || '0.00'}
//                     </Text>
//                     <Text style={styles.insightPercentage}>
//                       {totalExpenses > 0
//                         ? `${((chartData[0]?.value / totalExpenses) * 100).toFixed(1)}% of total`
//                         : '0%'}
//                     </Text>
//                   </View>
//                 </View>
//               </>
//             )}
//           </ScrollView>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: COLOURS.overlay,
//     justifyContent: 'flex-end',
//   },
//   modalContent: {
//     backgroundColor: COLOURS.background,
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     maxHeight: '90%',
//     paddingBottom: 20,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: COLOURS.border,
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: COLOURS.textPrimary,
//   },
//   closeButton: {
//     padding: 4,
//   },
//   scrollContent: {
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },
//   loadingContainer: {
//     paddingVertical: 60,
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 16,
//     fontSize: 16,
//     color: COLOURS.textSecondary,
//   },
//   emptyContainer: {
//     paddingVertical: 60,
//     alignItems: 'center',
//   },
//   emptyText: {
//     marginTop: 16,
//     fontSize: 18,
//     fontWeight: '600',
//     color: COLOURS.textPrimary,
//   },
//   emptySubtext: {
//     marginTop: 8,
//     fontSize: 14,
//     color: COLOURS.textSecondary,
//     textAlign: 'center',
//     paddingHorizontal: 40,
//   },
//   insightsContainer: {
//     marginTop: 24,
//     paddingTop: 20,
//     borderTopWidth: 1,
//     borderTopColor: COLOURS.border,
//   },
//   insightsTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: COLOURS.textPrimary,
//     marginBottom: 12,
//   },
//   insightCard: {
//     backgroundColor: COLOURS.card,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: COLOURS.border,
//   },
//   insightLabel: {
//     fontSize: 13,
//     color: COLOURS.textSecondary,
//     marginBottom: 6,
//   },
//   insightValue: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: COLOURS.textPrimary,
//     marginBottom: 4,
//   },
//   insightPercentage: {
//     fontSize: 14,
//     color: COLOURS.primary,
//   },
// });
