'use client';

import { memo, useCallback, useEffect, useState } from 'react';
import Image, { ImageProps } from 'next/image';

// Constants
import { BLUR_SRC, FALLBACK_SRC } from '@/constants';

interface ImageFallbackProps extends ImageProps {
  src: string;
  alt: string;
  blurDataURL?: string;
  fallbackSrc?: string;
}

const ImageFallback = ({
  src,
  alt,
  blurDataURL = BLUR_SRC.DEFAULT,
  fallbackSrc = FALLBACK_SRC.DEFAULT,
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
      placeholder="blur"
      blurDataURL={blurDataURL}
      onLoad={handleLoad}
      onError={handleFallbackImage}
      {...rest}
    />
  );
};

export default memo(ImageFallback);
