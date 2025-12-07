import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import colours from "@/constants/colours";

interface DatePickerProps {
  date: Date;
  onDateChange: (date: Date) => void;
  onClose: () => void;
  visible: boolean;
}

export default function DatePicker({ date, onDateChange, onClose, visible }: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState(date);
  const [currentMonth, setCurrentMonth] = useState(date.getMonth());
  const [currentYear, setCurrentYear] = useState(date.getFullYear());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  useEffect(() => {
    if (visible) {
      setSelectedDate(date);
      setCurrentMonth(date.getMonth());
      setCurrentYear(date.getFullYear());
    }
  }, [visible]);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleConfirm = () => {
    onDateChange(selectedDate);
    onClose();
  };

  const handleCancel = () => {
    setSelectedDate(date);
    onClose();
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newDate);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.dayCell}>
          <Text style={styles.emptyDay}></Text>
        </View>
      );
    }

    // Actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth &&
        selectedDate.getFullYear() === currentYear;

      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === currentMonth &&
        new Date().getFullYear() === currentYear;

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            isSelected && styles.selectedDay,
            isToday && !isSelected && styles.todayDay,
          ]}
          onPress={() => handleDateSelect(day)}
        >
          <Text
            style={[
              styles.dayText,
              isSelected && styles.selectedDayText,
              isToday && !isSelected && styles.todayDayText,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header with month/year navigation */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handlePrevMonth} style={styles.navButton}>
              <FontAwesome5 name="chevron-left" size={20} color={colours.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerText}>
              {months[currentMonth]} {currentYear}
            </Text>
            <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
              <FontAwesome5 name="chevron-right" size={20} color={colours.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Days of week header */}
          <View style={styles.daysOfWeekRow}>
            {daysOfWeek.map((day) => (
              <View key={day} style={styles.dayOfWeekCell}>
                <Text style={styles.dayOfWeekText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar grid */}
          <View style={styles.calendarGrid}>{renderCalendar()}</View>

          {/* Action buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: colours.card,
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxWidth: 380,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 4,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: colours.textPrimary,
    letterSpacing: 0.5,
  },
  daysOfWeekRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  dayOfWeekCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
  },
  dayOfWeekText: {
    fontSize: 12,
    fontWeight: "700",
    color: colours.textSecondary,
    textTransform: "uppercase",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  dayCell: {
    width: "14.28%",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    borderWidth: 2,
    borderColor: "transparent",
  },
  emptyDay: {
    fontSize: 15,
  },
  dayText: {
    fontSize: 15,
    color: colours.textPrimary,
    fontWeight: "500",
  },
  selectedDay: {
    backgroundColor: colours.primary,
    borderRadius: 50,
  },
  selectedDayText: {
    color: colours.background,
    fontWeight: "700",
  },
  todayDay: {
    borderWidth: 2,
    borderColor: colours.primary + "80",
    borderRadius: 50,
  },
  todayDayText: {
    color: colours.primary,
    fontWeight: "700",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cancelButton: {
    backgroundColor: colours.surface,
    borderWidth: 1,
    borderColor: colours.textSecondary + "30",
  },
  confirmButton: {
    backgroundColor: colours.primary,
    shadowColor: colours.primary,
    shadowOpacity: 0.3,
  },
  cancelText: {
    color: colours.textPrimary,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
  confirmText: {
    color: colours.background,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});
