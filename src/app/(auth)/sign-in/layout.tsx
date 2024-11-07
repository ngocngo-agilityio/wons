import { ReactNode } from 'react';

// Constants
import { IMAGES } from '@/constants';

// Layouts
import { AuthLayout } from '@/layouts';

// Components
import { Heading, ImageFallback, Logo } from '@/components';

interface SignInLayoutProps {
  children: ReactNode;
}

const SignInLayout = ({ children }: SignInLayoutProps) => (
  <AuthLayout
    image={
      <div className="relative lg:w-[550px] h-[380px] lg:h-[584px]">
        <ImageFallback
          fill
          src={IMAGES.SIGN_IN_IMAGE}
          alt="sign-in"
          sizes="100vw"
          className="object-contain"
        />
      </div>
    }
  >
    <div className="flex flex-col items-center pt-[47px] md:pt-[148px] pb-[90px] mx-auto base:w-full xs:max-w-[348px]">
      <Logo />
      <Heading className="mt-[38px] mb-[41px]" title="Sign in" />
      {children}
    </div>
  </AuthLayout>
);

export default SignInLayout;
