import { ReactNode } from 'react';

// Layouts
import { AuthLayout } from '@/layouts';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <AuthLayout>{children}</AuthLayout>
);

export default Layout;
