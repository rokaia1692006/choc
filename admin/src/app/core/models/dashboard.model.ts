export type Period = 'day' | 'week' | 'month' | 'year';

export interface PeriodSummary {
  period: Period;
  orders: number;
  sales: number;
  costs: number;
  profit: number;
}

export interface SeriesPoint {
  label: string;
  sales: number;
  profit: number;
}

export interface ScheduleSettings {
  dailyOrderLimit: number;
}