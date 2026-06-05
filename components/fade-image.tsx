"use client";

import { useEffect, useRef, useState } from "react";
import type { ImgHTMLAttributes } from "react";

interface FadeImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "onLoad"> {
  fadeDelay?: number;
}

export function FadeImage({ className, fadeDelay = 0, ...props }: FadeImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, fadeDelay);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [fadeDelay]);

  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) {
      setIsLoaded(true);
    }
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full">
      <img
        ref={imgRef}
        {...props}
        className={`h-full w-full ${className || ""} transition-all duration-700 ease-out ${
          isVisible && isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-[1.02]"
        }`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}
