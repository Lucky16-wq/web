'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

const slides = [
  {
    image:
      'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=1200&q=80',
  },
  {
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
  },
  {
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  },
];

function getCarouselOffset(index: number, activeIndex: number, total: number) {
  const rawOffset = index - activeIndex;
  const half = Math.floor(total / 2);

  if (rawOffset > half) {
    return rawOffset - total;
  }
  if (rawOffset < -half) {
    return rawOffset + total;
  }
  return rawOffset;
}

export default function CenteredCoverflowCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative overflow-visible rounded-[2rem] bg-slate-950/95 px-4 py-12 shadow-[0_60px_120px_rgba(15,23,42,0.55)] ring-1 ring-white/5 sm:px-6 lg:px-10">
        <div className="relative mx-auto mb-10 max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-cyan-400/80">Centered Coverflow Carousel</p>
          <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Premium Venue Showcase</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Showcase imagery with a modern, centered coverflow carousel that feels polished, immersive, and premium.
          </p>
        </div>

        <div className="relative overflow-visible px-4 py-8 sm:px-8">
          <div className="relative mx-auto flex h-[360px] w-full min-h-[360px] items-center justify-center overflow-visible">
            {slides.map((slide, index) => {
              const offset = getCarouselOffset(index, activeIndex, slides.length);
              const isActive = offset === 0;
              const translateX = offset * 240;
              const rotateY = offset * -18;
              const scale = isActive ? 1.15 : 0.78;
              const opacity = isActive ? 1 : 0.6;
              const zIndex = isActive ? 30 : 20 - Math.abs(offset);

              return (
                <div
                  key={slide.image}
                  className="absolute top-1/2 left-1/2 h-[320px] w-[86vw] max-w-[520px] overflow-visible rounded-[2rem] transition-all duration-700 ease-out"
                  style={{
                    transform: `translateX(${translateX}px) translateY(-50%) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity,
                    zIndex,
                    transformOrigin: 'center center',
                  }}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
                    <Image src={slide.image} alt="Coverflow slide" fill className="object-cover object-center" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Slide ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'bg-cyan-400 ring-2 ring-cyan-400/30' : 'bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
