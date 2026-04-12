import { useEffect, useState, type CSSProperties } from 'react'

import styles from './ScoreRing.module.css'

interface ScoreRingProps {
  score: number
  color: string
}

export default function ScoreRing({ score, color }: ScoreRingProps) {
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    const target = Math.round(score)
    const duration = 900
    const start = performance.now()
    let frame = 0

    const animate = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1)
      setDisplayScore(Math.round(target * progress))

      if (progress < 1) {
        frame = window.requestAnimationFrame(animate)
      }
    }

    frame = window.requestAnimationFrame(animate)

    return () => window.cancelAnimationFrame(frame)
  }, [score])

  return (
    <div className={styles.ring} style={{ '--score-color': color } as CSSProperties}>
      <div className={styles.value}>{displayScore}</div>
    </div>
  )
}
