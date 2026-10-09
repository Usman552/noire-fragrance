import Image from "next/image";
import type { CSSProperties } from "react";
import type { Photo as PhotoAsset } from "@/lib/assets";
import styles from "./Photo.module.css";

interface Props {
  photo: PhotoAsset;
  /** Responsive `sizes` hint — keep it honest so the right file is fetched. */
  sizes: string;
  className?: string;
  /** Above-the-fold image: preload it and skip lazy loading. */
  preload?: boolean;
  /** Override the alt text (e.g. "" when the image is decorative in context). */
  alt?: string;
  /** Adds an inner layer that scroll animations may move (parallax / scale). */
  motionLayer?: boolean;
  style?: CSSProperties;
  /** Data attributes for the frame (motion hooks). */
  frameProps?: Record<`data-${string}`, string>;
}

/**
 * A photograph that fills its frame. The frame's size comes from the parent
 * (aspect-ratio or explicit height), so the page never shifts as images load.
 */
export function Photo({ photo, sizes, className, preload, alt, motionLayer, style, frameProps }: Props) {
  const img = (
    <Image
      src={photo.src}
      alt={alt ?? photo.alt}
      fill
      sizes={sizes}
      preload={preload}
      loading={preload ? "eager" : "lazy"}
      placeholder="blur"
      className={styles.img}
    />
  );
  return (
    <div
      className={`${styles.frame} ${className ?? ""}`}
      style={
        {
          "--focus": photo.focus ?? "50% 50%",
          "--focus-m": photo.focusMobile ?? photo.focus ?? "50% 50%",
          ...style,
        } as CSSProperties
      }
      {...frameProps}
    >
      {motionLayer ? (
        <div className={styles.layer} data-photo-layer>
          {img}
        </div>
      ) : (
        img
      )}
    </div>
  );
}
