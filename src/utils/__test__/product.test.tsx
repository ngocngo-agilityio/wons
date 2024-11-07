// Components
import { MedalIcon } from '@/components';

// Utils
import {
  calcTotalAmount,
  filterProductsNotInInvoice,
  formatProduct,
  getDataByID,
  getSerialNumberWithMedal,
  sortByTotalSaleDescending,
  sortProducts,
  sortProductsByTotalSale,
} from '../product';

// Types
import {
  TInvoiceProductTable,
  TProductInvoiceWithTotalSaleResponse,
} from '@/types';

// Mocks
import {
  MOCK_INVOICE_PRODUCT_RESPONSE,
  MOCK_PRODUCTS,
  MOCK_PRODUCTS_WITHOUT_ATTRIBUTES,
  MOCK_PRODUCTS_WITH_STRAPI_MODEL,
} from '@/mocks';

describe('getSerialNumberWithMedal', () => {
  it('returns MedalIcon for top three items', () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const result = getSerialNumberWithMedal(data, { id: 1 });
    expect(result.type).toBe(MedalIcon);
  });
});

describe('sortByTotalSaleDescending', () => {
  it('should sort products by totalSale in descending order', () => {
    const productsBeforeSort = [
      {
        id: 1,
        attributes: MOCK_PRODUCTS[0],
      },
      {
        id: 2,
        attributes: MOCK_PRODUCTS[1],
      },
      {
        id: 3,
        attributes: MOCK_PRODUCTS[2],
      },
    ] as unknown as TProductInvoiceWithTotalSaleResponse[];

    const productsAfterSort = [
      {
        id: 3,
        attributes: MOCK_PRODUCTS[2],
      },
      {
        id: 2,
        attributes: MOCK_PRODUCTS[1],
      },
      {
        id: 1,
        attributes: MOCK_PRODUCTS[0],
      },
    ] as unknown as TProductInvoiceWithTotalSaleResponse[];

    const sortedProducts = sortByTotalSaleDescending(productsBeforeSort);

    expect(sortedProducts).toEqual(productsAfterSort);
  });

  it('should handle products with missing totalSale values, treating them as 0', () => {
    const products = [
      { attributes: { totalSale: 100 } },
      { attributes: {} }, // Missing totalSale
      { attributes: { totalSale: 300 } },
    ] as unknown as TProductInvoiceWithTotalSaleResponse[];

    const sortedProducts = sortByTotalSaleDescending(products);

    expect(sortedProducts).toEqual([
      { attributes: { totalSale: 300 } },
      { attributes: { totalSale: 100 } },
      { attributes: {} },
    ]);
  });

  it('should return an empty array if the input is an empty array', () => {
    const products: TProductInvoiceWithTotalSaleResponse[] = [];
    const sortedProducts = sortByTotalSaleDescending(products);

    expect(sortedProducts).toEqual([]);
  });
});

describe('sortProductsByTotalSale', () => {
  it('calculates total sale and sorts products by it', () => {
    const result = sortProductsByTotalSale(MOCK_INVOICE_PRODUCT_RESPONSE);
    expect(result[0].attributes.totalSale).toBe(12000);
    expect(result[1].attributes.totalSale).toBe(1200);
  });
});

describe('filterProductsNotInInvoice', () => {
  it('filters out products that are in the invoice', () => {
    const invoiceProductIds = new Set([1, 2]); // IDs of products in the invoice

    const result = filterProductsNotInInvoice(
      invoiceProductIds,
      MOCK_PRODUCTS_WITH_STRAPI_MODEL,
    );

    // Only products not in invoiceProductIds should remain
    const expected = [MOCK_PRODUCTS_WITH_STRAPI_MODEL[2]];

    expect(result).toEqual(expected);
  });

  it('returns all products if none are in the invoice', () => {
    const invoiceProductIds = new Set([]); // Empty set

    const result = filterProductsNotInInvoice(
      invoiceProductIds,
      MOCK_PRODUCTS_WITH_STRAPI_MODEL,
    );

    expect(result).toEqual(MOCK_PRODUCTS_WITH_STRAPI_MODEL); // No products are filtered out
  });

  it('returns an empty array if all products are in the invoice', () => {
    const invoiceProductIds = new Set([1, 2]);

    const result = filterProductsNotInInvoice(
      invoiceProductIds,
      MOCK_PRODUCTS_WITH_STRAPI_MODEL,
    );

    expect(result).toEqual([MOCK_PRODUCTS_WITH_STRAPI_MODEL[2]]); // All products are filtered out
  });
});

describe('formatProduct', () => {
  it('formats products correctly', () => {
    const result = formatProduct(MOCK_PRODUCTS_WITH_STRAPI_MODEL);

    const expected = [
      {
        id: 1,
        attributes: {
          price: 0,
          quantity: 0,
          product: { data: MOCK_PRODUCTS_WITH_STRAPI_MODEL[0] },
        },
      },
      {
        id: 2,
        attributes: {
          price: 0,
          quantity: 0,
          product: { data: MOCK_PRODUCTS_WITH_STRAPI_MODEL[1] },
        },
      },
      {
        id: 3,
        attributes: {
          price: 0,
          quantity: 0,
          product: { data: MOCK_PRODUCTS_WITH_STRAPI_MODEL[2] },
        },
      },
    ];

    expect(result).toEqual(expected);
  });

  it('returns an empty array when no products are provided', () => {
    const result = formatProduct();

    expect(result).toEqual([]); // Expecting an empty array as no products are passed
  });

  it('handles a single product correctly', () => {
    const result = formatProduct([MOCK_PRODUCTS_WITH_STRAPI_MODEL[2]]);

    const expected = [
      {
        id: 3,
        attributes: {
          price: 0,
          quantity: 0,
          product: { data: MOCK_PRODUCTS_WITH_STRAPI_MODEL[2] },
        },
      },
    ];

    expect(result).toEqual(expected);
  });
});

describe('getDataByID', () => {
  it('returns the correct item when the ID exists', () => {
    const result = getDataByID(MOCK_PRODUCTS_WITH_STRAPI_MODEL, 2);

    const expected = MOCK_PRODUCTS_WITH_STRAPI_MODEL[1];

    expect(result).toEqual(expected);
  });

  it('throws an error when the ID does not exist', () => {
    expect(() => getDataByID(MOCK_PRODUCTS_WITH_STRAPI_MODEL, 6)).toThrowError(
      'Item with ID 6 not found',
    );
  });

  it('throws an error when the data array is empty', () => {
    expect(() => getDataByID([], 1)).toThrowError('Item with ID 1 not found');
  });
});

describe('calcTotalAmount', () => {
  it('calculates total amount correctly for positive values', () => {
    const price = 10;
    const quantity = 5;

    const result = calcTotalAmount(price, quantity);

    expect(result).toBe(50); // 10 * 5 = 50
  });

  it('returns 0 when price is 0', () => {
    const price = 0;
    const quantity = 5;

    const result = calcTotalAmount(price, quantity);

    expect(result).toBe(0); // 0 * 5 = 0
  });

  it('returns 0 when quantity is 0', () => {
    const price = 10;
    const quantity = 0;

    const result = calcTotalAmount(price, quantity);

    expect(result).toBe(0); // 10 * 0 = 0
  });

  it('calculates total amount correctly for negative price', () => {
    const price = -10;
    const quantity = 5;

    const result = calcTotalAmount(price, quantity);

    expect(result).toBe(-50); // -10 * 5 = -50
  });

  it('calculates total amount correctly for negative quantity', () => {
    const price = 10;
    const quantity = -5;

    const result = calcTotalAmount(price, quantity);

    expect(result).toBe(-50); // 10 * -5 = -50
  });

  it('calculates total amount correctly for negative price and quantity', () => {
    const price = -10;
    const quantity = -5;

    const result = calcTotalAmount(price, quantity);

    expect(result).toBe(50); // -10 * -5 = 50
  });
});

const PRODUCTS_MOCK: TInvoiceProductTable[] =
  MOCK_PRODUCTS_WITHOUT_ATTRIBUTES.map((product, index) => ({
    product: {
      data: {
        id: index + 1,
        title: product.title,
        price: product.price,
        rating: product.rating,
        imageUrl: product.imageUrl,
      },
    },
    quantity: 2,
    price: product.price,
  }));

describe('sortProducts', () => {
  const ASC = 'asc';
  const DESC = 'desc';
  let setProductsValuesMock: jest.Mock;

  beforeEach(() => {
    setProductsValuesMock = jest.fn();
    jest.clearAllMocks();
  });

  it('sorts products by title in ascending order', () => {
    const order = DESC; // Current order is descending, so it should switch to ASC
    const newOrder = sortProducts(
      order,
      'title',
      ASC,
      DESC,
      PRODUCTS_MOCK,
      setProductsValuesMock,
    );

    expect(newOrder).toBe(ASC);
    expect(setProductsValuesMock).toHaveBeenCalledWith(PRODUCTS_MOCK);
  });

  it('sorts products by title in descending order', () => {
    const order = ASC; // Current order is ascending, so it should switch to DESC
    const newOrder = sortProducts(
      order,
      'title',
      ASC,
      DESC,
      PRODUCTS_MOCK,
      setProductsValuesMock,
    );

    expect(newOrder).toBe(DESC);
    expect(setProductsValuesMock).toHaveBeenCalledWith(PRODUCTS_MOCK.reverse());
  });

  it('sorts products by price in descending order', () => {
    const order = ASC; // Current order is ascending, so it should switch to DESC
    const newOrder = sortProducts(
      order,
      'price',
      ASC,
      DESC,
      PRODUCTS_MOCK,
      setProductsValuesMock,
    );

    expect(newOrder).toBe(DESC);
    expect(setProductsValuesMock).toHaveBeenCalledWith(PRODUCTS_MOCK);
  });

  it('sorts products by price in ASC order', () => {
    const order = DESC; // Current order is ascending, so it should switch to DESC
    const newOrder = sortProducts(
      order,
      'price',
      ASC,
      DESC,
      PRODUCTS_MOCK,
      setProductsValuesMock,
    );

    expect(newOrder).toBe(ASC);
    expect(setProductsValuesMock).toHaveBeenCalledWith(PRODUCTS_MOCK.reverse());
  });

  it('returns original order when an unsupported sortBy value is provided', () => {
    const order = ASC;
    const newOrder = sortProducts(
      order,
      'unsupported',
      ASC,
      DESC,
      PRODUCTS_MOCK,
      setProductsValuesMock,
    );

    expect(newOrder).toBe(DESC); // Order should still toggle
    expect(setProductsValuesMock).toHaveBeenCalledWith(PRODUCTS_MOCK); // No sorting applied
  });

  it('sorts products by quantity in descending order', () => {
    const order = ASC; // Current order is ascending, so it should switch to DESC
    const newOrder = sortProducts(
      order,
      'quantity',
      ASC,
      DESC,
      PRODUCTS_MOCK,
      setProductsValuesMock,
    );

    expect(newOrder).toBe(DESC);
    expect(setProductsValuesMock).toHaveBeenCalledWith(PRODUCTS_MOCK);
  });

  it('sorts products by quantity in ASC order', () => {
    const order = DESC; // Current order is ascending, so it should switch to DESC
    const newOrder = sortProducts(
      order,
      'quantity',
      ASC,
      DESC,
      PRODUCTS_MOCK,
      setProductsValuesMock,
    );

    expect(newOrder).toBe(ASC);
  });

  it('sorts products by amount in descending order', () => {
    const order = ASC; // Current order is ascending, so it should switch to DESC
    const newOrder = sortProducts(
      order,
      'amount',
      ASC,
      DESC,
      PRODUCTS_MOCK,
      setProductsValuesMock,
    );

    expect(newOrder).toBe(DESC);
    expect(setProductsValuesMock).toHaveBeenCalledWith(PRODUCTS_MOCK.reverse());
  });

  it('sorts products by amount in ASC order', () => {
    const order = DESC; // Current order is ascending, so it should switch to DESC
    const newOrder = sortProducts(
      order,
      'amount',
      ASC,
      DESC,
      PRODUCTS_MOCK,
      setProductsValuesMock,
    );

    expect(newOrder).toBe(ASC);
  });
});
