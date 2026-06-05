"use client";

import { FadeImage } from "../fade-image";

const features = [
  {
    image: "/images/athlete-10.png",
    span: "col-span-2 row-span-2", // Large - athlete training
  },
  {
    image: "/images/athlete-1.png",
    span: "col-span-1 row-span-1", // Small - sports massage
  },
  {
    image: "/images/athlete-3.png",
    span: "col-span-1 row-span-1", // Small - gym workout
  },
  {
    image: "/images/athlete-4.png",
    span: "col-span-1 row-span-2", // Tall - athlete recovery
  },
  {
    image: "/images/athlete-5.png",
    span: "col-span-1 row-span-1", // Small - athlete training
  },
  {
    image: "/images/athlete-6.png",
    span: "col-span-2 row-span-1", // Wide - performance
  },
  {
    image: "/images/athlete-7.png",
    span: "col-span-1 row-span-1", // Small - stretching
  },
  {
    image: "/images/athlete-8.png",
    span: "col-span-1 row-span-2", // Tall - fitness
  },
  {
    image: "/images/athlete-9.png",
    span: "col-span-2 row-span-1", // Wide - training
  },
  {
    image: "/images/athlete-1.png",
    span: "col-span-1 row-span-1", // Small - athlete
  },
];

export function FeaturedProductsSection() {
  return (
    <section id="programs" className="relative bg-background py-20 md:py-32">
      <div className="px-4 md:px-12 lg:px-20">
        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-7xl mx-auto auto-rows-[180px] md:auto-rows-[220px]">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`relative overflow-hidden rounded-lg border border-gray-200 ${feature.span}`}
            >
              <FadeImage
                src={feature.image || "/placeholder.svg"}
                alt={`Recovery program ${index + 1}`}
                
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
