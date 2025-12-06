import { View, StyleSheet, Animated } from "react-native";
import React, { useEffect, useRef } from "react";
import colours from "@/constants/colours";

export const SkeletonCard = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          <View style={[styles.line, { width: "60%", height: 16 }]} />
          <View style={[styles.line, { width: "40%", height: 12, marginTop: 8 }]} />
          <View style={[styles.line, { width: "30%", height: 12, marginTop: 6 }]} />
        </View>
        <View style={[styles.line, { width: 80, height: 20 }]} />
      </View>
    </Animated.View>
  );
};

export const SkeletonSummaryCard = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.summaryCard, { opacity }]}>
      <View style={[styles.line, { width: "30%", height: 14, marginBottom: 8 }]} />
      <View style={[styles.line, { width: "50%", height: 32, marginBottom: 16 }]} />
      
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <View style={[styles.line, { width: 60, height: 12, marginBottom: 6 }]} />
          <View style={[styles.line, { width: 80, height: 16 }]} />
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <View style={[styles.line, { width: 60, height: 12, marginBottom: 6 }]} />
          <View style={[styles.line, { width: 80, height: 16 }]} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colours.card,
    borderRadius: 10,
    padding: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colours.border,
  },
  summaryCard: {
    backgroundColor: colours.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colours.border,
  },
  line: {
    backgroundColor: colours.surface,
    borderRadius: 4,
  },
});
