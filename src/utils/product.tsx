// Components
import { MedalIcon, Text } from '@/components';
import { IProduct } from '@/models';

// Types
import {
  StrapiModel,
  TInvoiceProductTable,
  TProductInvoiceResponse,
  TProductInvoiceWithTotalSaleResponse,
} from '@/types';

/**
 * Returns a MedalIcon if the product is among the top three items,
 * otherwise returns the product's index in the list as a Text component.
 * @param data Array of product data items
 * @param itemData The product data item for which to get the serial number or medal
 * @returns MedalIcon if in the top three, otherwise a Text component with the serial number
 */
export const getSerialNumberWithMedal = <T extends { id: number }>(
  data: T[],
  itemData: T,
) => {
  const index = data.findIndex((item) => item.id === itemData.id) + 1;

  const topThreeSelling = index <= 3;

  return topThreeSelling ? (
    <MedalIcon />
  ) : (
    <Text size="md" text={String(index)} className="text-nowrap" />
  );
};

/**
 * Sorts an array of products by their total sale in descending order.
 * @param products Array of product data
 * @returns Sorted products by total sale
 */
export const sortByTotalSaleDescending = (
  products: TProductInvoiceWithTotalSaleResponse[],
) =>
  products.toSorted(
    (a, b) => (b.attributes?.totalSale ?? 0) - (a.attributes?.totalSale ?? 0),
  );

export const sortProductsByTotalSale = (
  products: TProductInvoiceResponse[],
) => {
  const productsWithTotalSale = products.map((product) => ({
    ...product,
    attributes: {
      ...product.attributes,
      totalSale:
        product.attributes.product.data.attributes.price *
        product.attributes.quantity,
    },
  }));

  return sortByTotalSaleDescending(productsWithTotalSale);
};

export const filterProductsNotInInvoice = (
  invoiceProductIds: Set<number>,
  products: StrapiModel<IProduct>[],
) => products.filter((product) => !invoiceProductIds.has(product.id));

export const formatProduct = (
  productsNotInInvoice: StrapiModel<IProduct>[] = [],
) =>
  productsNotInInvoice.map((product) => {
    return {
      id: product.id,
      attributes: {
        price: 0,
        quantity: 0,
        product: { data: product },
      },
    };
  });

/**
 *
 * Get data by ID
 *
 * @param data - Array of data
 * @param id - id of data
 * @returns - an object in data by id
 */
export const getDataByID = <T extends { id: number }>(
  data: T[],
  id: number,
): T => {
  const item = data.find((item: T) => item.id === id);

  if (!item) {
    throw new Error(`Item with ID ${id} not found`);
  }

  return item;
};

export const calcTotalAmount = (price: number, quantity: number): number =>
  price * quantity;

export const sortProducts = (
  order: string,
  sortBy: string,
  ASC: string,
  DESC: string,
  productsValues: TInvoiceProductTable[],
  setProductsValues: (updatedProducts: TInvoiceProductTable[]) => void,
) => {
  const newOrder = order === ASC ? DESC : ASC;

  const sortedProducts = [...productsValues].sort(
    (currentProduct, newProduct) => {
      const isASC = newOrder === ASC;

      switch (sortBy) {
        case 'title':
          return isASC
            ? currentProduct.product.data.title.localeCompare(
                newProduct.product.data.title,
              )
            : newProduct.product.data.title.localeCompare(
                currentProduct.product.data.title,
              );

        case 'price':
          return isASC
            ? Number(currentProduct.product.data.price) -
                Number(newProduct.product.data.price)
            : Number(newProduct.product.data.price) -
                Number(currentProduct.product.data.price);

        case 'quantity':
          return isASC
            ? currentProduct.quantity - newProduct.quantity
            : newProduct.quantity - currentProduct.quantity;

        case 'amount': {
          const totalAmountA = calcTotalAmount(
            currentProduct.product.data.price,
            currentProduct.quantity,
          );
          const totalAmountB = calcTotalAmount(
            newProduct.product.data.price,
            newProduct.quantity,
          );
          return isASC
            ? totalAmountA - totalAmountB
            : totalAmountB - totalAmountA;
        }

        default:
          return 0;
      }
    },
  );

  setProductsValues(sortedProducts);
  return newOrder;
};
