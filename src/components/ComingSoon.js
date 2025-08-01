'use client';

export default function ComingSoon() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
      <div className="text-center bg-white shadow-xl rounded-xl px-8 py-12 max-w-md animate-fade-in">
        <div className="animate-bounce text-5xl mb-4">🧑‍💻</div>
        <h1 className="animate-pulse text-3xl font-bold text-gray-800 mb-3">Coming Soon...</h1>
        <p className="text-gray-600 mb-6">This feature is under development. Stay tuned for something awesome!</p>
        <p className="text-xs text-gray-400">Thanks for your patience 💜</p>
      </div>

      {/* Tailwind custom animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
