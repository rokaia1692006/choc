export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  apartment: string;
}

export interface AdminCustomer extends Customer {
  email: string | null;
  ordersCount: number;
  createdAt: string;
}

export interface OnlineCustomer {
  sessionId: string;
  customerId: string;
  name: string;
  email: string | null;
  phoneMasked: string;
  device: string;
  signedInAt: string;
  lastActiveAt: string;
}