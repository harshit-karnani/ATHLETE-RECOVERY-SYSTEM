"use client";

export function GallerySection() {
  const images = [
    { src: "/images/athlete-1.png", alt: "Athlete running and training" },
    { src: "/images/athlete-3.png", alt: "Professional athlete recovery" },
    { src: "/images/athlete-4.png", alt: "Sports performance and fitness" },
    { src: "/images/athlete-5.png", alt: "Athletic training and wellness" },
  ];

  return (
    <section id="gallery" className="bg-black py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-medium tracking-tight text-white md:text-5xl uppercase">
            Recovery in Action
          </h2>
          <p className="text-neutral-400 max-w-xl">
            Witness our recovery protocols being utilized by professional athletes to unlock peak physical potential.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {images.map((image, index) => (
            <div 
              key={index}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800"
            >
              <img 
                src={image.src} 
                alt={image.alt}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white font-mono-label text-xs uppercase tracking-wider">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
