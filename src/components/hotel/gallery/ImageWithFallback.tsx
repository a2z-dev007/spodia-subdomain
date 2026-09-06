"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { IMAGES } from "@/assets/images";

interface ImageWithFallbackProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

export default function ImageWithFallback({
  src,
  alt,
  fallbackSrc = IMAGES.placeholder.src,
  className = "",
  ...rest
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-100">
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
      )}
      <Image
        {...rest}
        src={hasError ? fallbackSrc : (imgSrc || fallbackSrc)}
        alt={alt || "Hotel Photo"}
        className={`transition-opacity duration-500 ease-out ${
          isLoading ? "opacity-0 scale-98" : "opacity-100 scale-100"
        } ${className}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}
