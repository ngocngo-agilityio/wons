import { screen, fireEvent } from '@testing-library/react';

// Components
import ProductDrawer from '../index';

// Mocks
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: {
      user: {
        role: {
          id: 3,
        },
      },
    },
  })),
}));

describe('ProductDrawer', () => {
  it('should match snapshot', () => {
    const { container } = testLibJestUtils.render(<ProductDrawer />);

    expect(container).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should open drawer', async () => {
    testLibJestUtils.render(<ProductDrawer />);

    const buttonAddProduct = await screen.findByRole('button', {
      name: /add product/i,
    });

    expect(buttonAddProduct).toBeInTheDocument();
    fireEvent.click(buttonAddProduct);

    const drawerHeading = screen.getByRole('heading', {
      name: /add a new product/i,
    });

    expect(drawerHeading).toBeInTheDocument();
  });
});
