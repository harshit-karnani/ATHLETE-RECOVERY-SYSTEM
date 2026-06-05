"use client";

import { FadeImage } from "../fade-image";

const textCycles = [
  {
    title: "Advanced Recovery Protocols",
    description: "Integrating sports science and cryotherapy/thermotherapy routines tailored to your daily stress metrics."
  },
  {
    title: "Personalized Coaching",
    description: "Daily feedback loop with expert recovery coaches matching biometric trends to target outputs."
  },
  {
    title: "Evidence-Based Results",
    description: "Trackable performance indicators displaying systemic recovery indices and injury probability reduction."
  }
];

const collageImages = [
  "/images/athlete-8.png",
  "/images/athlete-9.png",
  "/images/athlete-10.png",
  "/images/athlete-1.png"
];

export function TechnologySection() {
  const descriptionText = "Our holistic recovery system integrates sports science, nutrition optimization, and mental wellness. We use cutting-edge biometric tracking, personalized recovery protocols, and expert coaching to accelerate healing, prevent injury, and unlock peak athletic performance. Every athlete deserves a recovery program tailored to their unique goals.";

  return (
    <section id="technology" className="bg-[#0A0A0A] py-24 px-6 md:px-12 lg:px-20 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Info & Features */}
        <div className="lg:col-span-5 space-y-10">
          <div className="space-y-4">
            <span className="text-xs font-mono-label tracking-widest text-neutral-500 uppercase">TECHNOLOGY & PROTOCOLS</span>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white uppercase">
              The Science of Healing
            </h2>
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
              {descriptionText}
            </p>
          </div>

          <div className="space-y-6 pt-4 border-t border-neutral-800">
            {textCycles.map((cycle, index) => (
              <div key={index} className="space-y-2">
                <h3 className="text-lg font-medium text-white flex items-center gap-3">
                  <span className="text-xs font-mono-label bg-neutral-900 border border-neutral-800 text-neutral-400 px-2 py-1">0{index + 1}</span>
                  {cycle.title}
                </h3>
                <p className="text-neutral-400 text-xs pl-12 leading-relaxed">
                  {cycle.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Collage Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 group relative">
              <FadeImage 
                src={collageImages[0]} 
                alt="Athlete recovery cryo" 
                className="object-cover group-hover:scale-105"
              />
            </div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 group relative">
              <FadeImage 
                src={collageImages[1]} 
                alt="Athlete recovery check" 
                className="object-cover group-hover:scale-105"
              />
            </div>
          </div>
          
          <div className="space-y-4 pt-8">
            <div className="aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 group relative">
              <FadeImage 
                src={collageImages[2]} 
                alt="Athlete physical therapy" 
                className="object-cover group-hover:scale-105"
              />
            </div>
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 group relative">
              <FadeImage 
                src={collageImages[3]} 
                alt="Athlete stretching yoga" 
                className="object-cover group-hover:scale-105"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
