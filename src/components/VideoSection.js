'use client'
import Link from 'next/link';

export default function VideoSection({ title, subtitle }) {
  return (
    <section className="relative rounded-t-[2rem] bg-[#0a0a35] text-white pb-38 sm:mx-6">
      {/* Text Content */}
      <div className="max-w-6xl mx-auto px-4 pt-20 text-center">
        <h2 className="text-3xl sm:text-5xl mb-6 leading-tight">
          {title || (
            <>
              Get notified on <br className="hidden sm:block" />
              <span className="text-white">technical analysis events</span> on <br className="hidden sm:block" />
              <span className="text-white">European stock indices</span>
            </>
          )}
        </h2>

        <p className="text-lg sm:text-xl mb-12 text-white/80">
          {subtitle || 'Instantly rank every technical trade idea based on your optimal options strategy.'}
        </p>
      </div>

      {/* Video Section */}
      <div className="relative z-10 max-w-5xl mx-auto mb-20 px-2">
        <div className="relative w-full h-[450px] rounded-3xl border border-[#3d3d72] bg-black/10 overflow-hidden shadow-xl transition-transform duration-300 hover:scale-105">

          {/* Video */}
          <video
            src="/video.mp4" // Replace with your actual path
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover rounded-2xl"
          />

          {/* Overlay Text */}
          <div className="absolute inset-0 flex flex-col justify-end p-8 bg-black/30 backdrop-blur-sm text-left text-white z-10">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 max-w-lg">
              Over 1.9 million investors trust TrendNotifier.com to deliver the tools and resources they need to invest with confidence.
            </h3>
            <Link href="/plans">
            <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-full w-fit">
              View Our Plans
            </button>
          </Link>
          </div>

        </div>
      </div>

      {/* Curved Bottom SVG */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[150px] z-0"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path d="M0,50 C480,0 960,0 1440,50 L1440,120 L0,120" fill="#ffffff" />
      </svg>
    </section>
  )
}
