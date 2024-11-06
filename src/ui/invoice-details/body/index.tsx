'use client';

import { memo, useMemo } from 'react';
import isEqual from 'react-fast-compare';

// Utils
import {
  formatPrice,
  formatAmountWithDiscount,
  formatSubtotal,
  formatTotalAmount,
} from '@/utils';

// Types
import { StrapiModel } from '@/types';

// Models
import { TInvoiceProduct, IProduct } from '@/models';

// Components
import { Table, Text } from '@/components';

interface IInvoiceDetailsBody {
  data: StrapiModel<TInvoiceProduct<StrapiModel<IProduct>>>[];
}

const InvoiceDetailsBody = ({ data }: IInvoiceDetailsBody) => {
  const mappingContent = useMemo(
    () => [
      {
        accessor: (
          data: StrapiModel<TInvoiceProduct<StrapiModel<IProduct>>>,
        ) => (
          <Text
            size="2xs"
            text={data.attributes.product?.data?.attributes.title}
          />
        ),

        header: 'PRODUCT DESCRIPTION',
      },
      {
        accessor: (
          data: StrapiModel<TInvoiceProduct<StrapiModel<IProduct>>>,
        ) => <Text size="2xs" text={String(data?.attributes.quantity)} />,
        header: 'QUANTITY',
      },
      {
        accessor: (
          data: StrapiModel<TInvoiceProduct<StrapiModel<IProduct>>>,
        ) => (
          <Text
            size="2xs"
            text={`${formatPrice(data.attributes.price, true)} USD`}
          />
        ),
        header: 'RATE',
      },
      {
        accessor: (
          data: StrapiModel<TInvoiceProduct<StrapiModel<IProduct>>>,
        ) => (
          <Text
            size="2xs"
            className="text-right w-full"
            text={`${formatTotalAmount(data.attributes.price, data.attributes.quantity)} USD`}
          />
        ),
        header: 'AMOUNT',
        isCustomStyle: true,
      },
    ],
    [],
  );

  return (
    <div className="px-4 md:px-6 pb-6 pt-6">
      <Table
        isStripedRow
        variant="tertiary"
        columns={mappingContent}
        data={data}
      />
      <div className="flex flex-col justify-between items-end">
        <div className="flex justify-between w-full sm:w-[56%] py-[17px] border-b-1 border-gray-50 dark:border-gray-50/50">
          <Text
            text="Subtotal"
            className="uppercase text-gray-200"
            size="2xs"
          />
          <Text text={formatSubtotal({ data })} size="2xs" />
        </div>
        <div className="flex justify-between w-full sm:w-[56%] py-[17px] border-b-1 border-gray-50 dark:border-gray-50/50">
          <Text
            text="Discount 5%"
            className="uppercase text-gray-200"
            size="2xs"
          />
          <Text text={formatSubtotal({ data }, 5)} size="2xs" />
        </div>
        <div className="flex justify-between w-full sm:w-[56%] py-[17px]">
          <Text text="Total" className="uppercase" size="2xs" />
          <Text
            text={formatAmountWithDiscount({ data }, 5)}
            size="sm"
            textColor="text-blue-500 dark:text-purple-600"
          />
        </div>
        <div className="flex flex-col py-4">
          <Text
            text="Transfer the amount to the business account below. Please include invoice number on your check."
            className="uppercase text-gray-200 mb-1.5"
            size="2xs"
          />
          <div className="flex justify-center gap-5">
            <div className="flex gap-1">
              <Text
                text="Bank:"
                className="uppercase text-gray-200"
                size="2xs"
              />
              <Text text="FTSBUS33" size="2xs" />
            </div>
            <div className="flex gap-1">
              <Text
                text="Iban:"
                className="uppercase text-gray-200"
                size="2xs"
              />
              <Text text="GB82-1111-2222-3333" size="2xs" />
            </div>
          </div>
        </div>
      </div>
      <div className="py-8 border-b-1 border-gray-50">
        <Text text="Notes" className="uppercase mb-4" size="2xs" />
        <Text
          text="All amounts are in dollars.
            Please make the payment within 15 days from the issue of date of this invoice.
            Tax is not charged on the basis of paragraph 1 of Article 94 of the Value Added
            Tax Act (I am not liable for VAT)."
          size="2xs"
          className="text-gray-200 mb-8"
        />
        <Text
          text="Thank you for you confidence in my work."
          size="2xs"
          className="text-gray-200"
        />
        <Text text="Signiture" size="2xs" className="text-gray-200" />
      </div>
    </div>
  );
};

export default memo(InvoiceDetailsBody, isEqual);
