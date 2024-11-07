import { useState } from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';

// Utils
import { formatToCalendarDate, formatDateString } from '@/utils';

// Constants
import { MESSAGES } from '@/constants';

// Components
import DateTimeRangePickerModal from '../index';

const DateTimeRangePickerModalWrapper = () => {
  const date = new Date('2024-11-07T15:30:00');
  const [isOpen, setIsOpen] = useState(true);
  const [startTime, setStartTime] = useState('12:00am');
  const [endTime, setEndTime] = useState('12:30am');
  const [calendarDate, setCalendarDate] = useState(formatToCalendarDate(date));

  return (
    <DateTimeRangePickerModal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      selectedDate={formatDateString(calendarDate)}
      selectedStartTime={startTime}
      selectedEndTime={endTime}
      onDateChange={(dateString) =>
        setCalendarDate(formatToCalendarDate(new Date(dateString)))
      }
      onStartTimeChange={setStartTime}
      onEndTimeChange={setEndTime}
    />
  );
};

describe('DateTimeRangePickerModal', () => {
  const renderComponent = () =>
    testLibJestUtils.render(<DateTimeRangePickerModalWrapper />);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot', () => {
    const { container } = renderComponent();

    expect(container).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('should update start time and end time', async () => {
    renderComponent();

    const startTimeInput = screen.getByLabelText(/00:00 start time/i);
    const endTimeInput = screen.getByLabelText(/00:30 end time/i);
    fireEvent.input(startTimeInput, { target: { value: '01:00' } });
    fireEvent.input(endTimeInput, { target: { value: '01:30' } });

    const startTimeInputValue = startTimeInput.getAttribute('value');
    const endTimeInputValue = endTimeInput.getAttribute('value');

    await waitFor(() => expect(startTimeInputValue).toBe('01:00'));
    await waitFor(() => expect(endTimeInputValue).toBe('01:30'));
  });

  it('should show error message', async () => {
    renderComponent();

    const startTimeInput = screen.getByLabelText(/00:00 start time/i);
    const endTimeInput = screen.getByLabelText(/00:30 end time/i);
    fireEvent.input(startTimeInput, { target: { value: '00:40' } });
    fireEvent.input(endTimeInput, { target: { value: '00:30' } });

    const errorMessage = await screen.findByText(
      /start time cannot be later than the selected end time/i,
    );
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(MESSAGES.ERROR.START_TIME);

    fireEvent.input(endTimeInput, { target: { value: '00:35' } });
    expect(errorMessage).toHaveTextContent(MESSAGES.ERROR.END_TIME);
  });

  it('should update date', async () => {
    renderComponent();

    const dateInput = screen.getByLabelText(/2024-11-07 date/i);
    expect(dateInput).toBeInTheDocument();
    fireEvent.change(dateInput, { target: { value: '2024-11-08' } });

    const dateInputValue = dateInput.getAttribute('value');
    expect(dateInputValue).toBe('2024-11-08');
  });
});
