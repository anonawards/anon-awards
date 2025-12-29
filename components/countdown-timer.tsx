"use client"

import { useEffect, useState } from "react"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft())

  function calculateTimeLeft(): TimeLeft {
    const difference = targetDate.getTime() - new Date().getTime()

    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex justify-center gap-4 sm:gap-8 mb-10">
      <div className="text-center">
        <div className="text-4xl sm:text-6xl font-bold text-primary tabular-nums">
          {String(timeLeft.days).padStart(2, "0")}
        </div>
        <div className="text-sm text-muted-foreground mt-1">Days</div>
      </div>
      <div className="text-4xl sm:text-6xl font-bold text-primary">:</div>
      <div className="text-center">
        <div className="text-4xl sm:text-6xl font-bold text-primary tabular-nums">
          {String(timeLeft.hours).padStart(2, "0")}
        </div>
        <div className="text-sm text-muted-foreground mt-1">Hours</div>
      </div>
      <div className="text-4xl sm:text-6xl font-bold text-primary">:</div>
      <div className="text-center">
        <div className="text-4xl sm:text-6xl font-bold text-primary tabular-nums">
          {String(timeLeft.minutes).padStart(2, "0")}
        </div>
        <div className="text-sm text-muted-foreground mt-1">Minutes</div>
      </div>
      <div className="text-4xl sm:text-6xl font-bold text-primary">:</div>
      <div className="text-center">
        <div className="text-4xl sm:text-6xl font-bold text-primary tabular-nums">
          {String(timeLeft.seconds).padStart(2, "0")}
        </div>
        <div className="text-sm text-muted-foreground mt-1">Seconds</div>
      </div>
    </div>
  )
}
