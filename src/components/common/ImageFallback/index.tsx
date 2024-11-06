'use client';

import { memo, useCallback, useEffect, useState } from 'react';
import Image, { ImageProps } from 'next/image';

// Constants
import { BLUR_SRC, FALLBACK_SRC } from '@/constants';
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';

interface ImageFallbackProps extends Omit<ImageProps, 'placeholder'> {
  src: string;
  alt: string;
  blurDataURL?: string;
  fallbackSrc?: string;
  placeholder?: PlaceholderValue | null;
}

const ImageFallback = ({
  src,
  alt,
  blurDataURL = BLUR_SRC.DEFAULT,
  fallbackSrc = FALLBACK_SRC.DEFAULT,
  placeholder = 'blur',
  ...rest
}: ImageFallbackProps) => {
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const handleFallbackImage = useCallback(
    () => setImgSrc(fallbackSrc),
    [fallbackSrc],
  );

  const handleLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      const img = event.currentTarget;
      if (img.naturalWidth === 0) setImgSrc(fallbackSrc);
    },
    [fallbackSrc],
  );

  return (
    <Image
      priority
      src={imgSrc}
      alt={alt}
      placeholder={placeholder ?? undefined}
      blurDataURL={blurDataURL}
      onLoad={handleLoad}
      onError={handleFallbackImage}
      {...rest}
    />
  );
};

export default memo(ImageFallback);
