import { render, screen, fireEvent } from '@testing-library/react';

// components
import InvoiceProductTable from '..';

// mocks
import { PRODUCT_WITHOUT_STRAPI_MODEL } from '@/mocks';

jest.mock('@/utils', () => ({
  formatTotalAmount: jest.fn((price, quantity) => price * quantity),
  sortProducts: jest.fn(),
}));

describe('InvoiceProductTable Component', () => {
  const mockSetProductsValues = jest.fn();
  const mockSetErrorProducts = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product table with initial state', () => {
    render(
      <InvoiceProductTable
        products={PRODUCT_WITHOUT_STRAPI_MODEL}
        errorProducts=""
        productsValues={[]}
        setProductsValues={mockSetProductsValues}
        setErrorProducts={mockSetErrorProducts}
      />,
    );

    expect(screen.getByText('Product Description')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Add new product/i }),
    ).toBeInTheDocument();
  });

  it('adds a new product when clicking the add button', () => {
    render(
      <InvoiceProductTable
        products={PRODUCT_WITHOUT_STRAPI_MODEL}
        errorProducts=""
        productsValues={[]}
        setProductsValues={mockSetProductsValues}
        setErrorProducts={mockSetErrorProducts}
      />,
    );

    const addButton = screen.getByRole('button', { name: /Add new product/i });
    fireEvent.click(addButton);

    expect(mockSetProductsValues).toHaveBeenCalled();
  });

  it('updates quantity when input value changes', () => {
    const productsValues = [
      {
        quantity: 1,
        price: PRODUCT_WITHOUT_STRAPI_MODEL[0].price,
        product: { data: PRODUCT_WITHOUT_STRAPI_MODEL[0] },
      },
    ];

    render(
      <InvoiceProductTable
        products={PRODUCT_WITHOUT_STRAPI_MODEL}
        errorProducts=""
        productsValues={productsValues}
        setProductsValues={mockSetProductsValues}
        setErrorProducts={mockSetErrorProducts}
      />,
    );

    const quantityInput = screen.getByLabelText(/Quantity field/i);
    fireEvent.change(quantityInput, { target: { value: '5' } });

    expect(mockSetProductsValues).toHaveBeenCalled();
  });

  it('removes a product when delete button is clicked', () => {
    const productsValues = [
      {
        quantity: 1,
        price: PRODUCT_WITHOUT_STRAPI_MODEL[0].price,
        product: { data: PRODUCT_WITHOUT_STRAPI_MODEL[0] },
      },
    ];

    render(
      <InvoiceProductTable
        products={PRODUCT_WITHOUT_STRAPI_MODEL}
        errorProducts=""
        productsValues={productsValues}
        setProductsValues={mockSetProductsValues}
        setErrorProducts={mockSetErrorProducts}
      />,
    );

    const deleteButton = screen.getByLabelText(/Remove product/i);
    fireEvent.click(deleteButton);
    expect(mockSetProductsValues).toHaveBeenCalled();
  });
});
