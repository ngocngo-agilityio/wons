// Components
import Pagination, { PaginationProps } from '../index';

jest.mock('next/navigation', () => ({
  __esModule: true,
  useRouter() {
    return {
      prefetch: () => null,
    };
  },
  useSearchParams: () => ({
    get: (key: string) => {
      if (key === 'page') {
        return undefined;
      }
      return null;
    },
  }),
  usePathname: () => '/mock-path',
}));

describe('Pagination test cases', () => {
  const renderComponent = (props: PaginationProps) =>
    testLibJestUtils.render(<Pagination {...props} />);

  it('should render correctly', () => {
    const { container } = renderComponent({
      total: 5,
      handlePageChange: jest.fn(),
    });

    expect(container).toMatchSnapshot();
  });
});