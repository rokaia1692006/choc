import {Product} from './product.model';  

export type SeasonState = 'year-round' | 'upcoming' | 'live' | 'ended';

export function seasonState(p: Product, now = new Date()): SeasonState {
  if (!p.isSeasonal || !p.seasonal) return 'year-round';
  if (now < new Date(p.seasonal.startsAt)) return 'upcoming';
  if (now > new Date(p.seasonal.endsAt)) return 'ended';
  return 'live';
}