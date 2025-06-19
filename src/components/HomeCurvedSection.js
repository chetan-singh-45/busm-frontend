import Image from 'next/image'

export default function HomeCurvedSection({ title, subtitle }) {
  return (
    <section className="relative rounded-t-[3rem] bg-[#0a0a35] text-white pb-48 mx-2 sm:mx-6">
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        {/* Title */}
        <h2 className="text-3xl sm:text-5xl mb-6 leading-tight">
          {title || (
            <>
              Get notified on <br className="hidden sm:block" />
              <span className="text-white">technical analysis events</span> on <br className="hidden sm:block" />
              <span className="text-white">European stock indices</span>
            </>
          )}
        </h2>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl mb-8 text-white/80">
          {subtitle || 'Instantly rank every technical trade idea based on your optimal options strategy.'}
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          <button className="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 text-sm rounded-full transition">
            Sign Up Free
          </button>
          <button className="bg-white text-[#0a0a35] font-medium px-4 py-2 text-sm rounded-full transition hover:bg-gray-100">
            Try Demo
          </button>
        </div>
      </div>

      {/* Overlapping Image */}
      <div className="relative z-10 max-w-5xl mx-auto transform translate-y-16">
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
        className="absolute bottom-0 left-0 w-full h-[300px] z-0"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path d="M0,50 C480,0 960,0 1440,50 L1440,120 L0,120" fill="#ffffff" />
      </svg>
    </section>
  );
}
