import { LocalizedText } from './Localized';

export type OrderStatus = 'pending' | 'preparing' | 'delivered' | 'cancelled';

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
  placedAt: string;
  cancelledAt: string | null;
}