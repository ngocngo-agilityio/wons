// Constants
import { IMAGES } from '@/constants';

// UI
import { SignUpForm } from '@/ui';

export const metadata = {
  title: 'Wons Sign Up',
  description: 'Create an account to access exclusive features on Wons.',
  openGraph: {
    title: 'Wons Sign Up',
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

const SignUpPage = () => <SignUpForm />;

export default SignUpPage;
