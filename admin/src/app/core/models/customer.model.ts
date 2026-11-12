export interface OnlineCustomer {
  sessionId: string;
  customerId: number;
  name: string;
  email: string;
  phoneMasked: string;
  device: string;
  signedInAt: string;
  lastActiveAt: string;
}