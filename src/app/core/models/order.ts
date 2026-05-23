export type OrderStatus = 'pending' | 'preparing' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
}

export interface Order {
  id: string;
  userId: string | null;    
  customerName: string;
  phone: string;
  address: string;
  city: string;
  apartment?: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  total: number;
  deliveryDate: string;      
  status: OrderStatus;
  placedAt: string;         
  cancelledAt?: string;
}