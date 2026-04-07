export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'returned';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'bog_ipay' | 'tbc_checkout' | 'cash_on_delivery';

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod | null;
  payment_transaction_id: string | null;
  subtotal: number;
  shipping_cost: number;
  total: number;
  currency: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_city: string;
  delivery_address: string;
  delivery_postal_code: string | null;
  delivery_method: 'standard' | 'express';
  notes: string | null;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_sku: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}
