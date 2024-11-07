import { render, screen, fireEvent } from '@testing-library/react';

// Components
import ToastList from '../index';

// Mocks
import { TOAST_MOCK } from '@/mocks';

describe('ToastList Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the correct number of toasts', () => {
    const { container } = render(
      <ToastList toasts={TOAST_MOCK} onClose={mockOnClose} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('displays the correct title and description for each toast', () => {
    render(<ToastList toasts={TOAST_MOCK} onClose={mockOnClose} />);

    TOAST_MOCK.forEach((toast) => {
      expect(screen.getByText(toast.title)).toBeInTheDocument();
      expect(screen.getByText(toast.description)).toBeInTheDocument();
    });
  });

  it('calls onClose with the correct id when a toast is closed', () => {
    render(<ToastList toasts={TOAST_MOCK} onClose={mockOnClose} />);

    const closeButtons = screen.getAllByTestId('toast-close-button');

    // Simulate closing the first toast
    fireEvent.click(closeButtons[0]);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnClose).toHaveBeenCalledWith(TOAST_MOCK[0].id);
  });
});
