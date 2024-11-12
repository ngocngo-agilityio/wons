import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Components
import ProductDetails from '../index';

// Types
import { TProductInvoiceResponse } from '@/types';

jest.mock('@/utils', () => ({
  formatPrice: jest.fn((price) => price.toFixed(2)),
  formatTotalAmount: jest.fn((price, quantity) =>
    (price * quantity).toFixed(2),
  ),
}));

describe('ProductDetails Component', () => {
  const mockProduct: TProductInvoiceResponse = {
    id: 1,
    attributes: {
      quantity: 5,
      price: 100,
      product: {
        data: {
          id: 1,
          attributes: {
            id: 1,
            price: 100,
            rating: 4.5,
            imageUrl: '/test-image.jpg',
            title: 'Test Product',
            negotiable: true,
            brand: 'Test Brand',
            description: 'This is a test product description.',
          },
        },
      },
    },
  };

  const setup = (productProps = mockProduct) =>
    render(<ProductDetails product={productProps} />);

  const emptyProduct = {
    id: 1,
  } as TProductInvoiceResponse;
  it('handles missing attributes gracefully', () => {
    setup(emptyProduct);

    expect(screen.queryByText('Price:')).not.toBeInTheDocument();
    expect(screen.queryByText('Total Order:')).not.toBeInTheDocument();
    expect(screen.queryByText('Total Sales:')).not.toBeInTheDocument();
    expect(screen.queryByText('Negotiable')).not.toBeInTheDocument();
  });

  it('renders product image, title, and brand', () => {
    setup();

    expect(
      screen.getByAltText('Test Brand+/test-image.jpg'),
    ).toBeInTheDocument();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test Brand')).toBeInTheDocument();
  });

  it('renders price, quantity, and total sales', () => {
    setup();

    expect(screen.getByText('Price: $100.00')).toBeInTheDocument();
    expect(screen.getByText('Total Order: 5 Pieces')).toBeInTheDocument();
    expect(screen.getByText('Total Sales: $500.00')).toBeInTheDocument();
  });

  it('displays "Negotiable" text when negotiable is true', () => {
    setup();

    expect(screen.getByText('Negotiable')).toBeInTheDocument();
  });

  it('does not display "Negotiable" text when negotiable is false', () => {
    const nonNegotiableProduct = {
      ...mockProduct,
      attributes: {
        ...mockProduct.attributes,
        product: {
          data: {
            ...mockProduct.attributes.product.data,
            id: mockProduct.attributes.product.data.id,
            attributes: {
              ...mockProduct.attributes.product.data.attributes,
              negotiable: false,
            },
          },
        },
      },
    };
    setup(nonNegotiableProduct);

    expect(screen.queryByText('Negotiable')).not.toBeInTheDocument();
  });

  it('renders product description', () => {
    setup();

    expect(
      screen.getByText('This is a test product description.'),
    ).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = setup();
    expect(container).toMatchSnapshot();
  });
});
