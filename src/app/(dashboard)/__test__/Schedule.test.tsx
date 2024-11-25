// Page
import SchedulePage from '../schedule/page';

jest.mock('@/layouts', () => ({
  DashBoardLayout: () => <div>DashBoardLayout</div>,
}));

jest.mock('react-scan', () => ({
  scan: jest.fn(() => {}),
}));

describe('Schedule page', () => {
  it('should match snapshot', async () => {
    const { container } = testLibJestUtils.render(
      await SchedulePage({ searchParams: {} }),
    );

    expect(container).toMatchSnapshot();
  });
});
