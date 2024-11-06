import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Components
import CalendarModal from '../index';

// Models
import { TUser } from '@/models';

describe('CalendarModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockSetIsTask = jest.fn();

  const defaultProps = {
    title: 'Calendar Modal',
    eventTitle: 'Sample Event',
    date: new Date('2024-11-06T10:30:00Z'),
    timeRange: { start: '10:00', end: '11:00' },
    time: undefined,
    isOpen: true,
    user: {} as TUser,
    previewData: null,
    isTask: false,
    isEdit: false,
    setIsTask: mockSetIsTask,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
  };

  const setup = (props = defaultProps) => render(<CalendarModal {...props} />);
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with correct title and close button', () => {
    setup();
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByTestId('close-button')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    setup();
    const closeButton = screen.getByTestId('close-button');
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('renders CalendarTaskForm when "Task" tab is selected', () => {
    setup({ ...defaultProps, isEdit: false, isTask: true });
    const taskTab = screen.getByText('Task');
    fireEvent.click(taskTab);
    expect(screen.getByText('Task')).toBeInTheDocument();
  });

  it('disables the "Task" tab when isEdit is true and isTask is false', () => {
    setup({ ...defaultProps, isEdit: true, isTask: false });
    const taskTab = screen.getByText('Task');
    expect(taskTab).toHaveClass(
      'relative z-10 whitespace-nowrap transition-colors text-gray-700 dark:text-pink-700 group-data-[selected=true]:text-white',
    );
  });

  it('calls setIsTask when "Task" tab is selected', () => {
    setup();
    const taskTab = screen.getByText('Task');
    fireEvent.click(taskTab);
    expect(mockSetIsTask).toHaveBeenCalledWith(true);
  });

  it('matches snapshot', () => {
    const { container } = setup();

    expect(container).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
