'use client'

import { cn } from '@/lib/utils'
import { useInView, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useRef } from 'react'

export default function NumberTicker({
  value,
  direction = 'up',
  delay = 0,
  className,
}: {
  value: number
  direction?: 'up' | 'down'
  className?: string
  delay?: number // delay in s
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === 'down' ? value : 0)
  const springValue = useSpring(motionValue, {
    damping: 40,
    stiffness: 400,
  })
  const isInView = useInView(ref, { once: true, margin: '0px' })

  useEffect(() => {
    isInView &&
      setTimeout(() => {
        motionValue.set(direction === 'down' ? 0 : value)
      }, delay * 1000)
  }, [motionValue, isInView, delay, value, direction])

  useEffect(
    () =>
      springValue.on('change', (latest: number) => {
        if (ref.current) {
          ref.current.textContent = latest.toLocaleString('en-US', { maximumFractionDigits: 0 })
        }
      }),
    [springValue],
  )

  return <span className={cn('inline-block tabular-nums text-black dark:text-white', className)} ref={ref} />
}
