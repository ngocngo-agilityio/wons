import { SessionProvider } from 'next-auth/react';

// Layouts
import { Sidebar } from '@/layouts';

interface RootLayoutProps {
  children: React.ReactNode;
}

const RootLayout = ({ children }: Readonly<RootLayoutProps>) => (
  <SessionProvider>
    <div className="lg:flex">
      <Sidebar />
      <section className="flex-1 pt-7.5 base:px-6 md:pl-7.5 md:pr-7 mb-8 max-w-[1324px] mx-auto">
        {children}
      </section>
    </div>
  </SessionProvider>
);

export default RootLayout;
