import { User } from './user';
export interface AuthCache {
  user: User;
  expiry: number;
}