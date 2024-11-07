import { render, screen, fireEvent } from '@testing-library/react';
import { useTheme } from 'next-themes';

// Components
import ThemeSwitcher from '..';

// Mock useTheme hook
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

describe('ThemeSwitcher Component', () => {
  const setThemeMock = jest.fn();

  beforeEach(() => {
    // Reset mock before each test
    jest.clearAllMocks();
  });

  it('renders the sun icon when theme is dark', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: setThemeMock,
    });
    render(<ThemeSwitcher />);

    expect(screen.getByLabelText('theme switcher')).toBeInTheDocument();
    expect(screen.getByRole('button')).toContainElement(
      screen.getByTestId('FiSun'),
    );
  });

  it('renders the moon icon when theme is light', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: setThemeMock,
    });
    render(<ThemeSwitcher />);

    expect(screen.getByLabelText('theme switcher')).toBeInTheDocument();
    expect(screen.getByRole('button')).toContainElement(
      screen.getByTestId('IoMoonOutline'),
    );
  });

  it('toggles theme to light when current theme is dark', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: setThemeMock,
    });
    render(<ThemeSwitcher />);

    fireEvent.click(screen.getByRole('button'));
    expect(setThemeMock).toHaveBeenCalledWith('light');
  });

  it('toggles theme to dark when current theme is light', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: setThemeMock,
    });
    render(<ThemeSwitcher />);

    fireEvent.click(screen.getByRole('button'));
    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });
});
