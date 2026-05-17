"use client"

import { useEffect, useState, useMemo, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface SplashProps {
  duration?: number
  onComplete?: () => void
}

const Letter = memo(function Letter({ 
  char, 
  letterDuration,
  index
}: { 
  char: string
  letterDuration: number
  index: number
}) {
  return (
    <motion.span
      style={{ transformStyle: "preserve-3d" }}
      variants={{
        initial: {
          rotateX: 90,
          y: 20,
          opacity: 0,
          filter: "blur(8px)",
        },
        animate: {
          rotateX: 0,
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          transition: {
            duration: letterDuration,
            ease: [0.2, 0.65, 0.3, 0.9],
            delay: index * 0.05,
          },
        },
      }}
      initial="initial"
      animate="animate"
      className="inline-block text-8xl md:text-9xl font-bold bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent"
    >
      {char}
    </motion.span>
  )
})

export function Splash({ duration = 3000, onComplete }: SplashProps) {
  const [isDone, setIsDone] = useState(false)
  const word = "GrowthOS"
  const letters = useMemo(() => word.split(""), [word])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDone(true)
      onComplete?.()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onComplete])

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <div className="relative" style={{ perspective: "1000px" }}>
            <motion.div
              className="flex gap-[0.1em]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {letters.map((char, i) => (
                <Letter 
                  key={`${char}-${i}`} 
                  char={char} 
                  letterDuration={0.6}
                  index={i}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Splash
