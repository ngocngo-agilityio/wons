import { scan } from 'react-scan';

// Contexts
import { LayoutProvider } from '@/contexts';

// Constants
import { DM_SANS_FONT } from '@/constants';

// Styles
import '@/styles/index.css';

scan({
  enabled: process.env.NODE_ENV === 'development',
  includeChildren: true,
  log: true,
  renderCountThreshold: 3,
});

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <html lang="en" suppressHydrationWarning>
    <body className={`${DM_SANS_FONT.variable} font-dm-sans`}>
      <main>
        <LayoutProvider>{children}</LayoutProvider>
      </main>
    </body>
  </html>
);

export default RootLayout;
