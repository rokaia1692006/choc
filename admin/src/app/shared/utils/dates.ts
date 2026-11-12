export interface DateRange {
  from: string;
  to: string;
}

const two = (n: number) => String(n).padStart(2, '0');

export const toIso = (d: Date): string => `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}`;

export const startOfMonth = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), 1);

export const monthRange = (d: Date): DateRange => ({
  from: toIso(new Date(d.getFullYear(), d.getMonth(), 1)),
  to: toIso(new Date(d.getFullYear(), d.getMonth() + 1, 0)),
});