// Libs
import { ReactNode } from 'react';

// Constants
import { IMAGES } from '@/constants';

// Layouts
import { AuthLayout } from '@/layouts';

// Components
import { Heading, ImageFallback, Logo } from '@/components';

interface SignUpLayoutProps {
  children: ReactNode;
}

const SignUpLayout = ({ children }: SignUpLayoutProps): JSX.Element => (
  <AuthLayout
    image={
      <div className="relative lg:w-[550px] h-[380px] lg:h-[427px]">
        <ImageFallback
          fill
          src={IMAGES.SIGN_UP_IMAGE}
          alt="sign-up"
          sizes="100vw"
          className="object-contain"
        />
      </div>
    }
  >
    <div className="flex flex-col items-center pt-[47px] pb-[90px] mx-auto base:w-full xs:max-w-[348px]">
      <Logo />
      <Heading as="h1" className="mt-[38px] mb-[41px]" title="Sign up" />
      {children}
    </div>
  </AuthLayout>
);

export default SignUpLayout;
