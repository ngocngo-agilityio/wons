import { memo } from 'react';
import Link from 'next/link';

// Components
import { Text } from '@/components';

// Constants
import { DEFAULT_VALUE_INVOICE } from '@/constants';

const InvoiceDetailsFooter = () => {
  const { EMAIL, PHONE } = DEFAULT_VALUE_INVOICE;

  return (
    <footer className="flex base:flex-col lg:flex-row base:gap-5 lg:justify-between base:px-2 md:pl-7.5 md:pr-5">
      <div className="flex flex-col">
        <Text
          text="Your company"
          size="2xs"
          className="text-gray-200 uppercase"
        />
        <Text
          text="1331 Hart Ridge Road, 48436 Gaines, MI"
          size="2xs"
          className="text-gray-200"
        />
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2.5">
          <Text
            text="@"
            size="2xs"
            textColor="text-blue-500 dark:text-purple-600"
          />
          <Link href={`mailto:${EMAIL}`}>
            <Text text={EMAIL} size="2xs" className="text-gray-200" />
          </Link>
        </div>
        <div className="flex items-center gap-2.5">
          <Text
            text="m"
            size="2xs"
            textColor="text-blue-500 dark:text-purple-600"
          />
          <Link as={`tel:${PHONE}`} href={`tel:${PHONE}`}>
            <Text text={PHONE} size="2xs" className="text-gray-200" />
          </Link>
        </div>
      </div>

      <div className="flex lg:flex-col lg:items-end text-gray-200 text-[6px] leading-[10px]">
        <Text
          text="The company is registered in the"
          size="2xs"
          className="text-gray-200"
        />
        <Text
          text="&nbsp;business register under no. 87650000"
          size="2xs"
          className="text-gray-200"
        />
      </div>
    </footer>
  );
};

export default memo(InvoiceDetailsFooter);
