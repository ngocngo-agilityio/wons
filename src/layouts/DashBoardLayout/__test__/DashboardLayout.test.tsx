// Constants
import { PAGE_TITLES } from '@/constants';

// Components
import DashBoardLayout from '../index';
import { SearchInput } from '@/components';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: jest.fn().mockImplementation(() => ({
    replace: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: () => () => 'John Deo',
  })),
  usePathname: jest.fn(),
}));

describe('DashboardLayout', () => {
  const renderComponent = () =>
    testLibJestUtils.render(
      <DashBoardLayout
        title={PAGE_TITLES.DASHBOARD}
        rightContent={<SearchInput />}
      >
        <div className="bg-black/50 w-full h-screen" />
      </DashBoardLayout>,
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should match snapshot', () => {
    const { container } = renderComponent();

    expect(container).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
