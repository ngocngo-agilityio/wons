import { render, waitFor } from '@testing-library/react';

// Pages
import SignUpPage from '@/app/(auth)/sign-up/page';

jest.mock('react-scan', () => ({
  scan: jest.fn(() => {}),
}));

describe('SignUp Page render', () => {
  it('should render and match with snapshot', async () => {
    const { container } = render(<SignUpPage />);

    await waitFor(() => {
      expect(container).toBeInTheDocument();
    });

    expect(container).toMatchSnapshot();
  });
});
