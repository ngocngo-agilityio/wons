import { useRouter } from 'next/navigation';

// Pages
import SignInPage from '../page';

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useRouter: jest.fn(),
}));

const mockedUseRouter = useRouter as jest.Mock;

jest.mock('react-scan', () => ({
  scan: jest.fn(() => {}),
}));

describe('SignUpPage', () => {
  mockedUseRouter.mockReturnValue({
    pathname: '/',
    push: jest.fn(),
    replace: jest.fn(),
  });

  const renderComponent = () => testLibJestUtils.render(<SignInPage />);

  it('should match with snapshot', () => {
    const component = renderComponent();

    expect(component).toMatchSnapshot();
  });
});
