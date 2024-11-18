import { memo } from 'react';

import { Card } from '@nextui-org/react';

// icons
import { FaStar } from 'react-icons/fa';

// components
import { ImageFallback } from '@/components/common';

// utils
import { formatPrice } from '@/utils';

interface ProductCardProps {
  url: string;
  title: string;
  price?: number;
  rating?: number;
  alt?: string;
  className?: string;
}

const ProductCard = ({
  url,
  title,
  price = 0,
  rating = 0,
  alt = 'image alt',
  className = '',
}: ProductCardProps) => {
  const formattedPrice = formatPrice(price);

  return (
    <Card
      className={`bg-white dark:bg-gray-400 rounded-lg shadow-lg ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-center">
        <div className="w-24 h-24 sm:w-24 sm:h-24 mb-4 sm:mb-0">
          <ImageFallback
            width={96}
            height={96}
            src={url}
            alt={alt}
            sizes="96px"
            className="rounded-lg h-full object-cover"
          />
        </div>

        <section className="sm:ml-4 flex-1 text-center sm:text-left">
          <h3 className="text-black dark:text-white font-semibold text-lg sm:text-xl">
            {title}
          </h3>
          <div className="flex justify-center sm:justify-start py-2">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={`${
                  index < rating ? 'text-pink-500' : 'text-pink-300'
                }`}
              />
            ))}
          </div>
          <p className="text-black dark:text-white text-2xl font-semibold">
            ${formattedPrice}
          </p>
        </section>
      </div>
    </Card>
  );
};

export default memo(ProductCard);
