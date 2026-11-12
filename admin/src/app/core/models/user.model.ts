export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  apartment?: string;
  ordersCount?: number;
  createdAt: string;
}

export type AdminRole = 'Admin' | 'Staff';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  twoFactorEnabled: boolean;
}