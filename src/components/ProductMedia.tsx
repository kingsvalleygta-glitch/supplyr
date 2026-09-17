"use client";

import Image from "next/image";
import { useState } from "react";
import { CategoryVisual } from "@/components/CategoryVisual";
import { categoryImageUrl, productImageUrl } from "@/lib/images";

type Props = {
  categoryId: string;
  productId?: string;
  imageUrl?: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function ProductMedia({
  categoryId,
  productId,
  imageUrl,
  alt,
  className = "",
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: Props) {
  const mapped = productId
    ? productImageUrl(productId, categoryId)
    : categoryImageUrl(categoryId);
  const primary = imageUrl || mapped;
  const fallback = categoryImageUrl(categoryId);
  const [src, setSrc] = useState(primary);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <CategoryVisual categoryId={categoryId} className={className} label={alt} />
    );
  }

  return (
    <div className={`relative overflow-hidden bg-surface-muted ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-contain p-2 sm:p-3"
        onError={() => {
          if (src !== fallback && src === imageUrl) {
            setSrc(mapped !== imageUrl ? mapped : fallback);
          } else if (src !== fallback) {
            setSrc(fallback);
          } else {
            setFailed(true);
          }
        }}
      />
    </div>
  );
}
