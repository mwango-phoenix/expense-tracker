export type TimePeriod = 'day' | 'week' | 'month' | 'year';

export interface DateRange {
  start: Date;
  end: Date;
}

// Mirrors the backend getDefaultRange logic (Sunday-start week, calendar
// month/year) so the labels shown in the UI match the data the API returns.
export const getPeriodRange = (period: TimePeriod): DateRange => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  switch (period) {
    case 'day':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'week': {
      const dayOfWeek = start.getDay();
      start.setDate(start.getDate() - dayOfWeek);
      start.setHours(0, 0, 0, 0);
      end.setTime(start.getTime());
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      break;
    }
    case 'year':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;
    case 'month':
    default:
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(end.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
  }

  return { start, end };
};

export const getPeriodLabel = (period: TimePeriod): string => {
  switch (period) {
    case 'day':
      return 'Today';
    case 'week':
      return 'This week';
    case 'year':
      return 'This year';
    case 'month':
    default:
      return 'This month';
  }
};

export const getChartTitle = (period: TimePeriod): string => {
  switch (period) {
    case 'day':
      return 'Daily Spending';
    case 'week':
      return 'Weekly Spending';
    case 'year':
      return 'Yearly Spending';
    case 'month':
    default:
      return 'Monthly Spending';
  }
};

export const formatDateRange = (start: Date, end: Date): string => {
  const sameYear = start.getFullYear() === end.getFullYear();
  const startStr = start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
  const endStr = end.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return `${startStr} \u2013 ${endStr}`;
};

// Inclusive day count between two dates (at least 1).
export const getDayCount = (start: Date, end: Date): number => {
  const msPerDay = 24 * 60 * 60 * 1000;
  const days = Math.round((end.getTime() - start.getTime()) / msPerDay);
  return Math.max(1, days + 1);
};

export const getWeekCount = (start: Date, end: Date): number => {
  return Math.max(1, getDayCount(start, end) / 7);
};
