import userEvent from '@testing-library/user-event';

// Constants
import { MESSAGES } from '@/constants';

// UI
import ProductListClient from '..';

// Mocks
import { MOCK_PRODUCT_LIST } from '@/mocks';

const mockShowToast = jest.fn();
jest.mock('@/hooks', () => ({
  ...jest.requireActual('@/hooks'),
  useToast: () => ({ showToast: mockShowToast }),
}));

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

describe('Product list client', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  const renderComponent = (
    props?: Record<string, Array<Record<string, number | null>>>,
  ) =>
    testLibJestUtils.render(
      <ProductListClient
        {...props}
        productList={MOCK_PRODUCT_LIST}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />,
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot', () => {
    const { container } = renderComponent();

    expect(container).toMatchSnapshot();
  });

  it('calls open details', () => {
    const { container } = renderComponent();

    testLibJestUtils.fireEvent.click(
      container.querySelector('[data-id="1"]') as Element,
    );

    expect(container).toMatchSnapshot();
  });

  it('calls delete', async () => {
    const { getAllByTestId, getByText } = renderComponent();

    testLibJestUtils.fireEvent.click(getAllByTestId('actions-btn')[0]);

    await testLibJestUtils.waitFor(() => {
      expect(getByText('Delete')).toBeTruthy();
    });

    testLibJestUtils.fireEvent.click(getByText('Delete'));

    await testLibJestUtils.waitFor(() => {
      expect(getByText('Delete Item')).toBeTruthy();
    });

    testLibJestUtils.fireEvent.click(getByText('Submit'));

    expect(mockOnDelete).toHaveBeenCalled();
  });

  it('calls delete failed', async () => {
    mockOnDelete.mockReturnValue({ error: MESSAGES.ERROR.UNKNOWN_ERROR });

    const { getAllByTestId, getByText } = renderComponent();

    testLibJestUtils.fireEvent.click(getAllByTestId('actions-btn')[0]);

    await testLibJestUtils.waitFor(() => {
      expect(getByText('Delete')).toBeTruthy();
    });

    testLibJestUtils.fireEvent.click(getByText('Delete'));

    await testLibJestUtils.waitFor(() => {
      expect(getByText('Delete Item')).toBeTruthy();
    });

    testLibJestUtils.fireEvent.click(getByText('Submit'));

    expect(mockOnDelete).toHaveBeenCalled();
  });

  it('calls edit', async () => {
    global.URL.createObjectURL = jest.fn();

    const { getAllByTestId, getByText, getByLabelText, getByTestId } =
      renderComponent();

    testLibJestUtils.fireEvent.click(getAllByTestId('actions-btn')[0]);

    await testLibJestUtils.waitFor(() => {
      expect(getByText('Edit')).toBeTruthy();
    });

    testLibJestUtils.fireEvent.click(getByText('Edit'));

    await testLibJestUtils.waitFor(() => {
      expect(getByText('Update Product')).toBeTruthy();
    });

    await userEvent.upload(
      getByTestId('avatar-upload'),
      new File(['image'], 'test.png', { type: 'image/png' }),
    );
    testLibJestUtils.fireEvent.change(getByLabelText('Product Name'), {
      target: {
        value: 'test',
      },
    });

    await testLibJestUtils.waitFor(() => {
      expect(getByText('Save Product')).toBeEnabled();
    });

    await testLibJestUtils.waitFor(() => {
      testLibJestUtils.fireEvent.submit(getByText('Update Product'));
    });

    expect(mockShowToast).toHaveBeenCalled();
  });

  it('calls edit failed', async () => {
    global.URL.createObjectURL = jest.fn();
    mockOnEdit.mockReturnValue({ error: MESSAGES.ERROR.UNKNOWN_ERROR });

    const { getAllByTestId, getByText, getByLabelText, getByTestId } =
      renderComponent();

    testLibJestUtils.fireEvent.click(getAllByTestId('actions-btn')[0]);

    await testLibJestUtils.waitFor(() => {
      expect(getByText('Edit')).toBeTruthy();
    });

    testLibJestUtils.fireEvent.click(getByText('Edit'));

    await testLibJestUtils.waitFor(() => {
      expect(getByText('Update Product')).toBeTruthy();
    });

    await userEvent.upload(
      getByTestId('avatar-upload'),
      new File(['image'], 'test.png', { type: 'image/png' }),
    );
    testLibJestUtils.fireEvent.change(getByLabelText('Product Name'), {
      target: {
        value: 'test',
      },
    });

    await testLibJestUtils.waitFor(() => {
      expect(getByText('Save Product')).toBeEnabled();
    });

    await testLibJestUtils.waitFor(() => {
      testLibJestUtils.fireEvent.submit(getByText('Update Product'));
    });

    expect(mockShowToast).toHaveBeenCalled();
  });

  it('calls close edit drawer', async () => {
    global.URL.createObjectURL = jest.fn();

    const { container, getAllByTestId, getByText, getByTestId } =
      renderComponent();

    testLibJestUtils.fireEvent.click(getAllByTestId('actions-btn')[0]);

    await testLibJestUtils.waitFor(() => {
      expect(getByText('Edit')).toBeTruthy();
    });

    testLibJestUtils.fireEvent.click(getByText('Edit'));

    await testLibJestUtils.waitFor(() => {
      expect(getByText('Update Product')).toBeTruthy();
    });

    await testLibJestUtils.waitFor(() => {
      testLibJestUtils.fireEvent.click(getByTestId('close-product-form'));
    });

    await testLibJestUtils.waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });
});
