'use client'

// import { useEffect, useState } from 'react'

// export default function ChaseLoader() {
//   const [progress, setProgress] = useState(0)

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 100) {
//           clearInterval(interval)
//           return 100
//         }
//         return prev + 1 
//       })
//     }, 20)

//     return () => clearInterval(interval)
//   }, [])

//   return (
//     <div className="w-full bg-gray-200 rounded-full h-1 dark:bg-gray-700 fixed top-0 left-0 z-50">
//       <div
//         className="bg-green-500 h-1 rounded-full transition-all duration-75"
//         style={{ width: `${progress}%` }}
//       />
//     </div>
//   )
// }

const ChaseLoader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      {/* Spinner container with spin animation */}
      <div className="relative w-10 h-10" style={{ animation: 'spin 2s linear infinite' }}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 left-0 w-full h-full"
            style={{
              transform: `rotate(${i * 60}deg)`,
            }}
          >
            <div
              className="w-[25%] h-[25%] rounded-full bg-[#22c55e] mx-auto"
              style={{
                animation: `chase-dot 2s infinite ease-in-out both`,
                animationDelay: `-${1.1 - i * 0.1}s`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Loading text */}
      <p className="mt-4 text-sm text-[#22c55e]">{message}</p>
    </div>
  );
};

export default ChaseLoader;
