"use client";

import { motion } from "framer-motion";

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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as any,
        stiffness: 70,
        damping: 15,
      }
    }
  };

  const imageContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: "easeOut" as any
      }
    }
  };

  return (
    <section className="relative bg-[#F4F4F1] py-20 px-6 md:px-12 lg:px-20 min-h-[90vh] flex flex-col justify-between border-b border-neutral-200 overflow-hidden">
      {/* Background ambient animation */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-[#B03030]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-[#047857]/5 rounded-full blur-[100px]" />
      </motion.div>

      {/* Hero Content Grid */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto relative z-10">
        
        {/* Left column: Text */}
        <motion.div 
          className="lg:col-span-6 space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="overflow-hidden">
            <h1 className="text-[12vw] lg:text-[7rem] font-bold leading-none tracking-tighter text-black select-none uppercase inline-flex overflow-hidden">
              {word.split('').map((letter, i) => (
                <motion.span 
                  key={i}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    ease: "easeOut" as any,
                    delay: i * 0.05 
                  }}
                  className="inline-block"
                >
                  {letter}
                </motion.span>
              ))}
            </h1>
          </motion.div>
          
          <motion.p variants={itemVariants} className="text-xl md:text-2xl lg:text-3xl leading-relaxed text-[#47464a] max-w-xl">
            Science-backed athlete recovery, proven performance gains.
          </motion.p>
          
          <motion.p variants={itemVariants} className="text-neutral-500 max-w-md text-sm leading-relaxed">
            Accelerate your recovery cycle, reduce systemic fatigue, and prevent injuries using personalized biometric analysis.
          </motion.p>

          <motion.div variants={itemVariants} className="pt-4 flex gap-4">
            <button className="bg-black hover:bg-[#B03030] text-white px-8 py-3.5 rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-colors shadow-xl shadow-black/10">
              Explore Protocol
            </button>
            <button className="bg-transparent border border-black/20 hover:border-black text-black px-8 py-3.5 rounded-full font-mono text-xs font-bold uppercase tracking-widest transition-colors">
              How it works
            </button>
          </motion.div>
        </motion.div>

        {/* Right column: Bento Collage */}
        <motion.div 
          className="lg:col-span-6 grid grid-cols-2 gap-4"
          variants={imageContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-4">
            <motion.div variants={imageVariants} className="aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-200 group relative">
              <img 
                src={sideImages[0].src} 
                alt={sideImages[0].alt}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </motion.div>
            <motion.div variants={imageVariants} className="aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-200 group relative">
              <img 
                src={sideImages[1].src} 
                alt={sideImages[1].alt}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </motion.div>
          </div>
          <div className="space-y-4 pt-8">
            <motion.div variants={imageVariants} className="aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-200 group relative">
              <img 
                src={sideImages[2].src} 
                alt={sideImages[2].alt}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </motion.div>
            <motion.div variants={imageVariants} className="aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-200 group relative">
              <img 
                src={sideImages[3].src} 
                alt={sideImages[3].alt}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
