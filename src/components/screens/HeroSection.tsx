import { HERO_COPY } from '../../data/diagnostic'
import styles from './HeroSection.module.css'

interface HeroSectionProps {
  onStart: () => void
}

export default function HeroSection({ onStart }: HeroSectionProps) {
  return (
    <section className={styles.screen}>
      <div className={styles.content}>
        <header className={styles.copy}>
          <h1 className={styles.title}>{HERO_COPY.heading}</h1>
          <p className={styles.subhead}>{HERO_COPY.subhead}</p>
          <p className={styles.frame}>{HERO_COPY.frame}</p>

          <div className={styles.bodyGroup}>
            {HERO_COPY.body.map((line) => (
              <p className={styles.body} key={line}>
                {line}
              </p>
            ))}
          </div>

          <button className={styles.cta} onClick={onStart} type="button">
            {HERO_COPY.ctaLabel}
          </button>

          <p className={styles.proof}>{HERO_COPY.proof}</p>
          <p className={styles.footer}>{HERO_COPY.footer}</p>
        </header>
      </div>
    </section>
  )
}
