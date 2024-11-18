'use client';

// Libs
import { usePathname } from 'next/navigation';
import { memo, ReactNode } from 'react';

// Components
import { Heading, ImageFallback, Logo, ThemeSwitcher } from '@/components';

// Constants
import { IMAGES, ROUTES } from '@/constants';

interface LayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: LayoutProps) => {
  const path = usePathname();
  const { SIGN_IN_IMAGE, SIGN_UP_IMAGE } = IMAGES;
  const mappingURL: Record<string, Record<string, string>> = {
    '/sign-in': {
      url: SIGN_IN_IMAGE,
      title: 'Sign in',
    },
    '/sign-up': {
      url: SIGN_UP_IMAGE,
      title: 'Sign up',
    },
  };

  return path === ROUTES.ACCOUNT_SUCCESS ? (
    <>{children}</>
  ) : (
    <div className="md:flex md:flex-row min-h-screen">
      <div className=" flex flex-col min-h-screen base:w-full lg:w-[40%] xl:w-[31%] bg-white dark:bg-gray-400 px-[20px] md:px-[50px]">
        <div className="pt-10 self-end">
          <ThemeSwitcher />
        </div>
        <div className="flex flex-col items-center pt-[47px] md:pt-[148px] pb-[90px] mx-auto base:w-full xs:max-w-[348px]">
          <Logo />
          <Heading
            className="mt-[38px] mb-[41px]"
            title={mappingURL[path].title}
          />
          {children}
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-600 flex-1 hidden md:flex items-center justify-center ">
        <div className="relative lg:w-[550px] h-[380px] lg:h-[584px]">
          <ImageFallback
            fill
            src={mappingURL[path].url}
            alt="sign-in"
            sizes="100vw"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default memo(AuthLayout);
