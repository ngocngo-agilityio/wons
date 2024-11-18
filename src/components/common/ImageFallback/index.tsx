'use client';

import { memo, SyntheticEvent, useEffect, useState } from 'react';
import Image, { ImageProps } from 'next/image';

// Constants
import { BLUR_SRC, FALLBACK_SRC } from '@/constants';
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';
import clsx from 'clsx';
import { Skeleton } from '@nextui-org/react';

interface ImageFallbackProps extends Omit<ImageProps, 'placeholder'> {
  src: string;
  alt: string;
  blurDataURL?: string;
  fallbackSrc?: string;
  placeholder?: PlaceholderValue | null;
  className?: string;
  width?: number;
  height?: number;
}

const ImageFallback = ({
  blurDataURL = BLUR_SRC.DEFAULT,
  fallbackSrc = FALLBACK_SRC.DEFAULT,
  placeholder = 'blur',
  className = '',
  src,
  alt,
  width,
  height,
  ...rest
}: ImageFallbackProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const handleFallbackImage = () => setImgSrc(fallbackSrc);

  const handleLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    if (img.naturalWidth === 0) setImgSrc(fallbackSrc);
  };

  const handleLoadingComplete = () => setLoaded(true);

  return (
    <>
      <Image
        priority
        src={imgSrc}
        alt={alt}
        placeholder={placeholder ?? undefined}
        blurDataURL={blurDataURL}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleFallbackImage}
        className={clsx(loaded ? 'opacity-100' : 'opacity-0 hidden', className)}
        onLoadingComplete={handleLoadingComplete}
        {...rest}
      />
      {!loaded && (
        <Skeleton
          className={clsx(
            className.includes('rounded-full') && 'rounded-full',
            width && height
              ? `w-[${width}px] h-[${height}px]`
              : 'w-full h-full',
            rest.sizes === '40px' && 'size-10',
          )}
        />
      )}
    </>
  );
};

export default memo(ImageFallback);
