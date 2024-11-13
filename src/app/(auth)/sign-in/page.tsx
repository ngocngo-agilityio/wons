import { Metadata } from 'next';

// Actions
import { authenticate } from '@/actions';

// UI
import { SignInForm } from '@/ui';

// Constants
import { IMAGES } from '@/constants';

export const metadata: Metadata = {
  title: 'Wons Sign In',
  description: 'login to access exclusive features on Wons.',
  openGraph: {
    title: 'Wons Sign In',
    description: 'Create an account to access exclusive features on Wons.',
    siteName: 'Wons',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: IMAGES.PREVIEW_IMAGE,
        alt: 'preview image',
      },
    ],
  },
};

const SignInPage = () => <SignInForm signIn={authenticate} />;

export default SignInPage;
