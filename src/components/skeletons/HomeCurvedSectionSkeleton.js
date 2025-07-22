export default function HomeCurvedSectionSkeleton() {
  return (
    <section className="relative rounded-t-[3rem] bg-[#0a0a35] text-white pb-40 mx-2 sm:mx-6">
      <div className="max-w-6xl mx-auto px-4 py-20 text-center animate-pulse">

        {/* Title Skeleton */}
        <div className="mx-auto h-8 sm:h-12 bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="mx-auto h-8 sm:h-12 bg-gray-700 rounded w-2/3 mb-6"></div>

        {/* Subtitle Skeleton */}
        <div className="mx-auto h-5 sm:h-6 bg-gray-600 rounded w-3/4 mb-8"></div>

        {/* Buttons Skeleton */}
        <div className="flex justify-center gap-4 flex-wrap">
          <div className="h-10 w-28 bg-gray-600 rounded-full"></div>
          <div className="h-10 w-28 bg-gray-500 rounded-full"></div>
        </div>
      </div>

      {/* Image Skeleton */}
      <div className="relative z-10 max-w-5xl mx-auto mt-4">
        <div className="relative w-full h-[500px] rounded-3xl border border-[#3d3d72] bg-gray-800 shadow-xl" />
      </div>

      {/* Bottom Curve (kept for consistency) */}
      <svg
        className="absolute bottom-0 left-0 w-full h-[250px] z-0"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
      >
        <path d="M0,50 C480,0 960,0 1440,50 L1440,120 L0,120" fill="#ffffff" />
      </svg>
    </section>
  );
}
