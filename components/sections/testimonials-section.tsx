"use client";



export function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-background">
      {/* Testimonial Image with Text Overlay */}
      <div className="relative aspect-[16/9] w-full">
        <img src="/images/athlete-1.png" className="absolute inset-0 w-full h-full object-cover object-cover" alt="Professional athletes in training recovery session" />
        {/* Fade gradient overlay - dark at bottom fading to transparent at top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Text Overlay */}
        <div className="absolute inset-0 flex items-end justify-center px-6 pb-16 md:px-12 md:pb-24 lg:px-20 lg:pb-32">
          <p className="mx-auto max-w-5xl text-2xl leading-relaxed text-white md:text-3xl lg:text-[2.5rem] lg:leading-snug text-center">
            PUNARVA athletes experience 40% faster recovery, 60% fewer injuries, and peak performance when they need it most — backed by science, delivered by experts.
          </p>
        </div>
      </div>
    </section>
  );
}
