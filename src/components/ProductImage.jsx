import React, { useState, useEffect } from 'react';
import { FALLBACK_PRODUCT_IMAGE } from '../data/productCatalog';

const ProductImage = ({ src, alt, className, style }) => {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_PRODUCT_IMAGE);

  useEffect(() => {
    setImgSrc(src || FALLBACK_PRODUCT_IMAGE);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (imgSrc !== FALLBACK_PRODUCT_IMAGE) {
          setImgSrc(FALLBACK_PRODUCT_IMAGE);
        }
      }}
    />
  );
};

export default ProductImage;
