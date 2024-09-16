// Types
import { StrapiModel } from '@/types';

// Models
import { IProduct, TInvoiceProduct } from '@/models';

export const formatPrice = (price: number, isDigits: boolean = false) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;

  if (isNaN(numPrice) || !numPrice) return '';

  return numPrice?.toLocaleString(
    isDigits ? 'de-DE' : 'en-US',
    isDigits ? { minimumFractionDigits: 2 } : undefined,
  );
};

export const formatTotalAmount = (
  price: number,
  quantity: number,
  isDigits: boolean = false,
) => {
  if (isDigits) return formatPrice(price * quantity, true);

  return formatPrice(price * quantity);
};

export const InsertSkeletonRow = (quantity: number) =>
  Array.from({ length: quantity }, (_, i) => ({ id: i + 1 }));

export const formattedResponseData = <T>(data: StrapiModel<T>[]) =>
  data.map((item) => {
    const { id, attributes } = item;

    return {
      id,
      ...attributes,
    };
  });

export const formatPhoneNumber = (value: string) => {
  const phone = value.replace(/[()\\-]/g, ' ');

  if (phone) return `+${phone}`;

  return '';
};

/**
 *
 * @param products - the products from api
 * @returns - Calc the price of all products in the table
 *
 */
export const formatSubtotal = (
  data: StrapiModel<TInvoiceProduct<StrapiModel<IProduct>>>[],
  discount: number = 0,
) => {
  const subtotal = data.reduce(
    (prevResult, item) =>
      prevResult + item.attributes.price * item.attributes.quantity,
    0,
  );
  const subtotalWithDiscount = subtotal * (discount / 100);

  if (discount) return `${formatPrice(subtotalWithDiscount, true)} USD`;

  return `${formatPrice(subtotal, true)} USD`;
};

export const formatAmountWithDiscount = (
  data: StrapiModel<TInvoiceProduct<StrapiModel<IProduct>>>[],
  discount: number = 0,
) => {
  const subtotal = data.reduce(
    (prevResult, item) =>
      prevResult + item.attributes.price * item.attributes.quantity,
    0,
  );
  const subtotalWithDiscount = subtotal * (discount / 100);
  const total = subtotal - subtotalWithDiscount;

  return `${formatPrice(total, true)} USD`;
};
