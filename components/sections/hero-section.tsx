"use client";

const word = "PUNARVA";

const sideImages = [
  {
    src: "/images/athlete-5.png",
    alt: "Sports massage therapy and muscle recovery",
  },
  {
    src: "/images/athlete-6.png",
    alt: "Athletic training and conditioning",
  },
  {
    src: "/images/athlete-7.png",
    alt: "Professional athlete recovery session",
  },
  {
    src: "/images/athlete-8.png",
    alt: "Athlete stretching and flexibility work",
  },
];

export function HeroSection() {
  return (
    <section className="relative bg-[#F4F4F1] py-20 px-6 md:px-12 lg:px-20 min-h-[90vh] flex flex-col justify-between border-b border-neutral-200">
      {/* Hero Content Grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto">
        {/* Left column: Text */}
        <div className="lg:col-span-6 space-y-6">
          <h1 className="text-[12vw] lg:text-[7rem] font-bold leading-none tracking-tighter text-black select-none uppercase">
            {word}
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl leading-relaxed text-[#47464a] max-w-xl">
            Science-backed athlete recovery, proven performance gains.
          </p>
          <p className="text-neutral-500 max-w-md text-sm leading-relaxed">
            Accelerate your recovery cycle, reduce systemic fatigue, and prevent injuries using personalized biometric analysis.
          </p>
        </div>

        {/* Right column: Bento Collage */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-200 group relative">
              <img 
                src={sideImages[0].src} 
                alt={sideImages[0].alt}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-200 group relative">
              <img 
                src={sideImages[1].src} 
                alt={sideImages[1].alt}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </div>
          <div className="space-y-4 pt-8">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-200 group relative">
              <img 
                src={sideImages[2].src} 
                alt={sideImages[2].alt}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-200 group relative">
              <img 
                src={sideImages[3].src} 
                alt={sideImages[3].alt}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
