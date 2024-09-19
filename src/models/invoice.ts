// Constants
import { InvoiceStatus } from '@/constants';

export type TInvoiceProduct<T> = {
  price: number;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  quantity: number;
  product: { data: T };
};

export type TInvoice = {
  invoiceId: string;
  customer: number;
  imageUrl: string;
  status: InvoiceStatus;
  address: string;
  isSelected: boolean;
  date: string;
  email: string;
};
