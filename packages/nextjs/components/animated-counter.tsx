"use client"

import { useState, useEffect } from "react"

interface AnimatedCounterProps {
  end: number
  duration?: number
  label: string
  prefix?: string
  suffix?: string
  startFrom?: number
}

export function AnimatedCounter({
  end,
  duration = 2000,
  label,
  prefix = "",
  suffix = "",
  startFrom = 0,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(startFrom)

  useEffect(() => {
    let startTimestamp: number | null = null
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)
      setCount(Math.floor(startFrom + progress * (end - startFrom)))
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)

    return () => {
      startTimestamp = null
    }
  }, [end, duration, startFrom])

  return (
    <div className="text-center">
      <p className="text-4xl font-bold bg-clip-text text-white bg-gradient-to-r from-purple-400 to-pink-600">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="text-white mt-2">{label}</p>
    </div>
  )
}

