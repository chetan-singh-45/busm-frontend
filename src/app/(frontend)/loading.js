'use client'

import { useEffect, useState } from 'react'

export default function FrontendLoading() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 1 
      })
    }, 20)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full bg-gray-200 rounded-full h-1 dark:bg-gray-700 fixed top-0 left-0 z-50">
      <div
        className="bg-green-500 h-1 rounded-full transition-all duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
