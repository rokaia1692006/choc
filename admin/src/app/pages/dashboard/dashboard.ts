import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Period, PeriodSummary, SeriesPoint } from '../../core/models/dashboard.model';
import { DashboardService } from '../../core/services/dashboard.service';
import { ScheduleService } from '../../core/services/schedule.service';
import { ErrorLine } from '../../shared/components/error-line/error-line';
import { LineChart } from '../../shared/components/line-chart/line-chart';
import { Calender } from '../../shared/components/calender/calender';
import { MoneyPipe } from '../../shared/pipes/money-pipe';
import { DateRange } from '../../shared/utils/dates';

const NAMES: Record<Period, string> = {
  day: 'Today',
  week: 'This week',
  month: 'This month',
  year: 'This year',
};

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, ErrorLine, LineChart, Calender, MoneyPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardPage implements OnInit {
  private dashboard = inject(DashboardService);
  private schedule = inject(ScheduleService);

  periods: Period[] = ['day', 'week', 'month', 'year'];
  summary = signal<PeriodSummary[]>([]);
  period = signal<Period>('month');
  series = signal<SeriesPoint[]>([]);
  closed = signal<ReadonlySet<string>>(new Set());
  error = signal('');
  note = signal('');
  dailyLimit = 0;

  labels = computed(() => this.series().map(p => p.label));
  sales = computed(() => this.series().map(p => p.sales));
  profit = computed(() => this.series().map(p => p.profit));

  ngOnInit() {
    this.dashboard.summary().subscribe({
      next: r => this.summary.set(r),
      error: () => this.error.set('Could not load the sales figures. Reload the page.'),
    });
    this.schedule.settings().subscribe({
      next: s => (this.dailyLimit = s.dailyOrderLimit),
      error: () => this.error.set('Could not load the order limit.'),
    });
    this.setPeriod('month');
  }

  nameOf(p: Period): string {
    return NAMES[p];
  }

  share(s: PeriodSummary): string {
    return s.sales > 0 ? `${((s.profit / s.sales) * 100).toFixed(1)}%` : 'none yet';
  }

  setPeriod(p: Period) {
    this.period.set(p);
    this.dashboard.series(p).subscribe({
      next: r => this.series.set(r),
      error: () => this.error.set('Could not load the chart.'),
    });
  }

  loadMonth(r: DateRange) {
    this.schedule.closedDays(r.from, r.to).subscribe({
      next: days =>
        this.closed.update(old => {
          const next = new Set([...old].filter(d => d < r.from || d > r.to));
          days.forEach(d => next.add(d));
          return next;
        }),
      error: () => this.error.set('Could not load the closed days for that month.'),
    });
  }

  toggleDay(iso: string) {
    const close = !this.closed().has(iso);
    this.mark(iso, close);
    this.schedule.setClosed(iso, close).subscribe({
      error: () => {
        this.mark(iso, !close);
        this.error.set('That change was not saved. The day was put back.');
      },
    });
  }

  saveLimit() {
    this.schedule.saveSettings({ dailyOrderLimit: this.dailyLimit }).subscribe({
      next: () => this.note.set('Order limit saved.'),
      error: () => this.error.set('Could not save the order limit.'),
    });
  }

  private mark(iso: string, on: boolean) {
    this.closed.update(old => {
      const next = new Set(old);
      if (on) next.add(iso);
      else next.delete(iso);
      return next;
    });
  }
}