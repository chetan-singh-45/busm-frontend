import { Settings, TrendingUp } from "lucide-react";

export default function HeadingSection({
  title,
  description,
}) {
  return (
    <section className="-mt-4  w-full relative bg-[#1a1a3a] text-white  md:py-20 px-6 md:px-8 rounded-t-[2.5rem] md:rounded-t-[3rem] overflow-hidden min-h-[50px]">
      <div className="relative z-10 w-full">
        <div className="flex items-start justify-between gap-8 md:gap-12 min-h-[180px]">
          {/* Left Icon */}
          <div className="flex-shrink-0 pt-2">
            <Settings className="w-8 h-8 md:w-10 md:h-10 text-cyan-400 stroke-[1.5]" />
          </div>

          {/* Content Container */}
          <div className="flex-1 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-16">
            {/* Title */}
            <div className="lg:flex-shrink-0">
              <h2 className="text-4xl md:text-5xl lg:text-4xl font-bold text-white leading-tight">
                {title}
              </h2>
            </div>

            {/* Description */}
            <div className="lg:flex-1 lg:max-w-2xl">
              <p className="text-white text-base md:text-base leading-normal font-light">
                {description}
              </p>
            </div>
          </div>

          {/* Right Icon */}
          <div className="flex-shrink-0 pt-2">
            <TrendingUp className="w-8 h-8 md:w-10 md:h-10 text-cyan-400 stroke-[1.5]" />
          </div>
        </div>
      </div>

      {/* Curved Bottom */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[100px] z-0"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path d="M0,100 C480,0 960,0 1440,110 L1440,120 L0,120" fill="#ffffff" />
      </svg>
    </section>
  );
}
