import { Component, computed, input, signal } from '@angular/core';

const money = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function niceCeil(v: number): number {
  if (v <= 0) return 0;
  const mag = 10 ** Math.floor(Math.log10(v));
  const step = [1, 2, 2.5, 5, 10].find(s => s >= v / mag) ?? 10;
  return step * mag;
}

function short(v: number): string {
  return Math.abs(v) >= 1000 ? `${+(v / 1000).toFixed(1)}k` : `${Math.round(v)}`;
}

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.html',
  styleUrl: './line-chart.css',
})
export class LineChart {
  readonly W = 640;
  readonly H = 260;
  readonly L = 48;
  readonly R = 14;
  readonly T = 12;
  readonly B = 26;

  labels = input<string[]>([]);
  sales = input<number[]>([]);
  profit = input<number[]>([]);
  hover = signal<number | null>(null);

  private hi = computed(() => niceCeil(Math.max(0, ...this.sales(), ...this.profit())) || 100);
  private lo = computed(() => {
    const m = Math.min(0, ...this.sales(), ...this.profit());
    return m < 0 ? -niceCeil(-m) : 0;
  });

  ticks = computed(() =>
    [0, 1, 2, 3, 4].map(i => {
      const v = this.lo() + ((this.hi() - this.lo()) * i) / 4;
      return { v, y: this.y(v), text: short(v) };
    }),
  );

  xLabels = computed(() => {
    const step = Math.ceil(this.labels().length / 8) || 1;
    return this.labels()
      .map((t, i) => ({ t, i, x: this.x(i) }))
      .filter(p => p.i % step === 0);
  });

  salesPath = computed(() => this.path(this.sales()));
  profitPath = computed(() => this.path(this.profit()));

  marker = computed(() => {
    const i = this.hover();
    if (i === null || i >= this.labels().length) return null;
    return { x: this.x(i), ys: this.y(this.sales()[i]), yp: this.y(this.profit()[i]) };
  });

  readout = computed(() => {
    const i = this.hover();
    if (i === null || i >= this.labels().length) return 'Point at the chart for exact figures.';
    return `${this.labels()[i]}: sales ${money.format(this.sales()[i])}, profit ${money.format(this.profit()[i])}`;
  });

  x(i: number): number {
    const n = this.labels().length;
    return this.L + (n <= 1 ? 0 : (i * (this.W - this.L - this.R)) / (n - 1));
  }

  y(v: number): number {
    const span = this.hi() - this.lo();
    return this.T + (this.H - this.T - this.B) * (1 - (v - this.lo()) / span);
  }

  private path(values: number[]): string {
    return values.map((v, i) => `${i ? 'L' : 'M'}${this.x(i)},${this.y(v)}`).join(' ');
  }

  move(e: MouseEvent) {
    const n = this.labels().length;
    if (n === 0) return;
    const box = (e.currentTarget as SVGElement).getBoundingClientRect();
    const px = ((e.clientX - box.left) / box.width) * this.W;
    const gap = (this.W - this.L - this.R) / Math.max(n - 1, 1);
    this.hover.set(Math.min(n - 1, Math.max(0, Math.round((px - this.L) / gap))));
  }
}