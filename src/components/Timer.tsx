'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface TimerProps {
  duration?: number
}

export function Timer({ duration = 180 }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning || timeLeft === null) return

    if (timeLeft === 0) {
      setIsRunning(false)
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [isRunning, timeLeft])

  const handleStart = () => {
    if (timeLeft === null) {
      setTimeLeft(duration)
      setIsRunning(true)
    } else {
      setIsRunning(!isRunning)
    }
  }

  const handleReset = () => {
    setTimeLeft(null)
    setIsRunning(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center gap-6 py-8"
    >
      <div className="text-center">
        <p className="text-sm text-amber-700 mb-2 font-serif">요리 타이머</p>
        <div className="timer-display">
          {timeLeft !== null ? formatTime(timeLeft) : '3:00'}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleStart}
          className="timer-button"
        >
          {timeLeft === null ? '시작' : isRunning ? '일시중지' : '재개'}
        </button>
        {timeLeft !== null && (
          <button
            onClick={handleReset}
            className="timer-button opacity-75"
          >
            초기화
          </button>
        )}
      </div>
    </motion.div>
  )
}
