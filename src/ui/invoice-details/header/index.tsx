import { memo } from 'react';
import Link from 'next/link';

// Utils
import { formatDate, formatPhoneNumber } from '@/utils';

// Constants
import { DAYJS_PATTERN, DEFAULT_VALUE_INVOICE, IMAGES } from '@/constants';

// Components
import { ImageFallback, Text } from '@/components';

interface IInvoiceDetailsHeaderProps {
  fullName: string;
  email: string;
  address: string;
  phone: string;
  date: string;
}

const InvoiceDetailsHeader = ({
  fullName,
  email,
  address,
  phone,
  date,
}: IInvoiceDetailsHeaderProps) => {
  const { EMAIL, PHONE } = DEFAULT_VALUE_INVOICE;

  return (
    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-600 px-4 md:px-6 py-6">
      <div className="flex flex-col gap-[37px]">
        <ImageFallback
          src={IMAGES.LOGO_COMPANY}
          alt="logo-detail"
          placeholder={null}
          width={30}
          height={44}
        />
        <div className="flex flex-col gap-[15px]">
          <Text text="Recipient" size="3xs" className="uppercase font-bold" />
          <div className="flex flex-col">
            <Text
              text={fullName}
              size="2xs"
              className="uppercase text-gray-200"
            />
            <Text
              text={address}
              size="2xs"
              className="text-gray-200 base:w-[100px] lg:w-full"
            />
            <Text
              text="VAT no.: 12345678"
              size="2xs"
              className="text-gray-200"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2.5">
              <Text
                text="@"
                size="3xs"
                textColor="text-blue-500 dark:text-purple-600"
              />
              <Link href={`mailto:${email}`}>
                <Text text={email} size="2xs" className="text-gray-200" />
              </Link>
            </div>
            <div className="flex items-center gap-2.5">
              <Text
                text="m"
                size="3xs"
                textColor="text-blue-500 dark:text-purple-600"
              />
              <Link
                as={`tel:${formatPhoneNumber}`}
                href={`tel:${formatPhoneNumber}`}
              >
                <Text
                  text={formatPhoneNumber(phone)}
                  size="2xs"
                  className="text-gray-200"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-[26px]">
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5">
            <Text
              text="@"
              size="3xs"
              textColor="text-blue-500 dark:text-purple-600"
            />
            <Link href={`mailto:${EMAIL}`}>
              <Text text={EMAIL} size="2xs" />
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <Text
              text="m"
              size="3xs"
              textColor="text-blue-500 dark:text-purple-600"
            />
            <Link href={`tel:${PHONE}`}>
              <Text text={PHONE} size="2xs" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-[15px]">
          <Text text="Invoice" size="3xl" className="font-bold" />
          <div className="flex flex-col">
            <Text text="invoice no." size="2xs" />
            <Text text="001/2021" size="3xs" className="text-gray-200" />
          </div>

          <div className="flex flex-col">
            <Text text="Invoice date" size="2xs" />
            <Text
              text={formatDate(date, DAYJS_PATTERN['MMMM D, YYYY'])}
              size="2xs"
              className="text-gray-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(InvoiceDetailsHeader);
