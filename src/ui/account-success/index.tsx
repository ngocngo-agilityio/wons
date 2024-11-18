'use client';

// Libs
import { Card, CardBody } from '@nextui-org/react';
import { useTheme } from 'next-themes';
import Link from 'next/link';

// Constants
import { IMAGES, ROUTES, THEME_MODES } from '@/constants';

// Components
import { Button, ImageFallback, Text } from '@/components';

const AccountSuccess = (): JSX.Element => {
  const { theme } = useTheme();

  const imgSrc =
    theme === THEME_MODES.LIGHT
      ? IMAGES.ACCOUNT_SUCCESS_LIGHT
      : IMAGES.ACCOUNT_SUCCESS_DARK;

  return (
    <div className="bg-50 dark:bg-gray-600 flex justify-center items-center h-screen">
      <Card className="shadow-none rounded-10 mx-auto bg-white dark:bg-gray-400 base:w-full base:h-[500px] sm:w-[550px] sm:h-[550px] md:w-[600px] md:h-[600px] xl:w-[726px] xl:h-[726px] ">
        <CardBody className="flex flex-col items-center">
          <ImageFallback
            src={imgSrc}
            alt="Account Success"
            width={184}
            height={184}
            className="base:mt-[80px] sm:mt-[100px] md:mt-[150px] xl:mt-[186px]"
          />
          <Text
            as="h2"
            text="Your account successfully created."
            className="mt-[53px] font-bold base:text-xl md:text-3xl"
          />
          <Button
            as={Link}
            href={ROUTES.DASHBOARD}
            color="primary"
            className="mt-9 font-medium md:text-xl md:w-[169px] md:h-[50px]"
            aria-label="Go to Home"
          >
            Go to Home
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default AccountSuccess;
