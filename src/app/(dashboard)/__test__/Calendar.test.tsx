// Mocks
import { EVENT_TABS } from '@/mocks';

// Page
import CalendarPage from '../calendar/page';

jest.mock('@/api', () => ({
  ...jest.requireActual('@/api'),
  getCalendarEvents: jest.fn(() => ({
    data: EVENT_TABS,
  })),
}));

describe('Calendar page', () => {
  it('should match snapshot', async () => {
    const { container } = testLibJestUtils.render(<CalendarPage />);

    await testLibJestUtils.waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });
});
