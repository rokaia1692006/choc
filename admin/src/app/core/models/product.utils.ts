import {Product} from './product.model';

export type SeasonState = 'year-round' | 'upcoming' | 'live' | 'ended';

export function seasonState(p: Product, now = new Date()): SeasonState {
  const { from, until } = p.availability;
  if (!from && !until) return 'year-round';
  if (from && now < new Date(from)) return 'upcoming';
  if (until && now > new Date(until)) return 'ended';
  return 'live';
}