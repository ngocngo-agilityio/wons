import { Metadata } from 'next';

// Constants
import { IMAGES } from '@/constants';

// UI
import { AccountSuccess } from '@/ui';

export const metadata: Metadata = {
  title: 'Wons Account Success',
  description: 'Confirm account registration is successful',
  openGraph: {
    title: 'Wons Account Success',
    description: 'Confirm account registration is successful',
    images: [
      {
        url: IMAGES.PREVIEW_IMAGE,
        alt: 'preview image',
      },
    ],
  },
};

const AccountSuccessPage = () => <AccountSuccess />;

export default AccountSuccessPage;
