import { memo } from 'react';
import isEqual from 'react-fast-compare';

// Types
import { TProductInvoiceResponse } from '@/types';

// Utils
import { formatPrice, formatTotalAmount } from '@/utils';

// Components
import { ImageFallback, Text } from '@/components';

interface IProductDetailsProps {
  product: TProductInvoiceResponse;
}

const ProductDetails = ({ product }: IProductDetailsProps) => {
  const {
    quantity = 0,
    price = 0,
    product: {
      data: {
        attributes: {
          imageUrl = '',
          title = '',
          negotiable = false,
          brand = '',
          description = '',
        } = {},
      } = {},
    } = {},
  } = product?.attributes ?? {};

  return (
    <div className="min-h-full base:w-[302px] lg:w-[369px] max-w-[369px] bg-white dark:bg-gray-400 py-[62px] px-6">
      <div className="flex flex-col items-center gap-4 border-b-1 border-blue-800/10 dark:border-white/10 pb-7.5">
        <div className="relative w-28 h-28">
          <ImageFallback
            fill
            src={imageUrl}
            alt={`${brand}+${imageUrl}`}
            sizes="112px"
            className="object-cover rounded-full h-full"
          />
        </div>
        <div className="flex flex-col items-center">
          <Text text={title} size="3xl" className="font-bold" />
          <Text text={brand} size="md" />
        </div>
      </div>
      <div className="flex flex-col gap-2.5 mt-10">
        <Text
          text="Information"
          className="capitalize font-medium"
          size="xxl"
        />

        <div className="flex items-center justify-between border-b-1 border-blue-800/10 dark:border-white/10 py-4">
          <Text
            text={`Price: $${formatPrice(price) || 0}`}
            size="xl"
            className="opacity-70 font-medium"
          />
          {negotiable && (
            <Text
              text="Negotiable"
              size="xl"
              className="opacity-70 font-medium"
            />
          )}
        </div>
        <Text
          text={`Total Order: ${quantity} ${quantity > 1 ? 'Pieces' : 'Piece'}`}
          size="xl"
          className="opacity-70 font-medium border-b-1 border-blue-800/10 dark:border-white/10 py-4"
        />
        <Text
          text={`Total Sales: $${formatTotalAmount(price, quantity) || 0}`}
          size="xl"
          className="opacity-70 font-medium border-b-1 border-blue-800/10 dark:border-white/10 py-4"
        />
        <Text
          text={description}
          size="xl"
          className="opacity-70 font-medium py-4"
        />
      </div>
    </div>
  );
};

export default memo(ProductDetails, isEqual);
