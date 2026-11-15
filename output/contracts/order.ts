import { LocalizedText } from './Localized';

export type OrderStatus = 'pending' | 'preparing' | 'delivered' | 'cancelled';
export type PaymentMethod = 'card' | 'wallet' | 'cash_on_delivery';
export type PaymentStatus = 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded';

export interface BoxSelection {
  bonbonId: number;
  pieces: number;
}

export interface CartLineRequest {
  productId: number;
  quantity: number;
  selection: BoxSelection[];
}

export interface PlaceOrderRequest {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  apartment: string;
  notes: string;
  deliveryDate: string;
  paymentMethod: PaymentMethod;
  lines: CartLineRequest[];
  verificationToken: string;
}

export interface OrderLine {
  productId: number;
  name: LocalizedText;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  selection: { bonbonId: number; name: LocalizedText; pieces: number }[];
}

export interface Order {
  id: string;
  userId: string | null;
  customerName: string;
  phone: string;
  address: string;
  city: string;
  apartment: string;
  notes: string;
  lines: OrderLine[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  deliveryDate: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  placedAt: string;
  cancelledAt: string | null;
}

export interface AdminOrder extends Order {
  paymobOrderId: string | null;
  paymobTransactionId: string | null;
  internalNotes: string;
}

export interface PlaceOrderResponse {
  order: Order;
  paymentUrl: string | null;
}

export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}