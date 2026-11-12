import { Component, OnInit, computed, input, output, signal } from '@angular/core';
import { DateRange, monthRange, startOfMonth, toIso } from '../../utils/dates';

const titleFmt = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' });
const dayFmt = new Intl.DateTimeFormat('en-GB', { weekday: 'short' });
const fullFmt = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

@Component({
  selector: 'app-calender',
  templateUrl: './calender.html',
  styleUrl: './calender.css',
})
export class Calender implements OnInit {
  closed = input<ReadonlySet<string>>(new Set());
  weekStart = input(6);
  toggled = output<string>();
  monthChange = output<DateRange>();

  private view = signal(startOfMonth(new Date()));

  title = computed(() => titleFmt.format(this.view()));

  names = computed(() =>
    Array.from({ length: 7 }, (_, i) => dayFmt.format(new Date(2024, 0, 7 + ((this.weekStart() + i) % 7)))),
  );

  blanks = computed(() => {
    const first = this.view().getDay();
    return Array.from({ length: (first - this.weekStart() + 7) % 7 });
  });

  cells = computed(() => {
    const v = this.view();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const count = new Date(v.getFullYear(), v.getMonth() + 1, 0).getDate();

    return Array.from({ length: count }, (_, k) => {
      const date = new Date(v.getFullYear(), v.getMonth(), k + 1);
      const iso = toIso(date);
      const closed = this.closed().has(iso);
      return {
        iso,
        n: k + 1,
        closed,
        past: date < today,
        today: date.getTime() === today.getTime(),
        label: fullFmt.format(date) + (closed ? ', closed' : ''),
      };
    });
  });

  ngOnInit() {
    this.monthChange.emit(monthRange(this.view()));
  }

  step(by: number) {
    const v = this.view();
    this.view.set(new Date(v.getFullYear(), v.getMonth() + by, 1));
    this.monthChange.emit(monthRange(this.view()));
  }
}