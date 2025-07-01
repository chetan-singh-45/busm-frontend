import Image from 'next/image';

export default function CommanCurvedSection({ title, subtitle }) {
  return (
    <section className="relative rounded-t-[3rem] bg-[#0a0a35] text-white pb-38 sm:mx-6 px-4 pt-20">
      
      {/* Title + Subtitle in One Row */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
        {/* Title */}
        <h2 className="text-3xl sm:text-5xl font-bold leading-tight md:w-1/2">
          {title || (
            <>
              Welcome to <span className="text-white">TrendNotifier</span>, <br />
              Your Dedicated Partner in <br />
              <span className="text-white">Market Awareness.</span>
            </>
          )}
        </h2>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-white/80 md:w-1/2">
          {subtitle || `We are not a trading platform and don’t offer investment advice. 
          We are an intelligent, high-speed alert system built to support traders 
          and investors who rely on technical analysis.`}
        </p>
      </div>

      {/* Image Section */}
      <div className="relative z-10 max-w-5xl mx-auto mb-20 px-2">
        <div className="relative w-full h-[450px] rounded-3xl border border-[#3d3d72] bg-black/10 overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105">
          <Image
            src="/team.jpg"
            alt="Team"
            fill
            className="object-cover rounded-2xl"
          />
        </div>
      </div>

      {/* Curved Bottom SVG */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[200px] z-0"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path d="M0,50 C480,0 960,0 1440,50 L1440,120 L0,120" fill="#ffffff" />
      </svg>
    </section>
  );
}
