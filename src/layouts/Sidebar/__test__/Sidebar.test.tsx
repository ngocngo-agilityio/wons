// Components
import Sidebar from '../index';

import { useSession } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

describe('Sidebar', () => {
  const renderComponent = () => testLibJestUtils.render(<Sidebar />);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with valid session', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          role: {
            id: 3,
          },
        },
      },
      status: 'authenticated',
    });

    const { container } = renderComponent();

    expect(container).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('renders correctly when session is undefined', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });

    const { container } = renderComponent();

    expect(container).toBeInTheDocument();
  });
});
