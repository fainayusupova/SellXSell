import type { CSSProperties } from 'react'

import ScoreRing from '../ScoreRing'
import { CTA_LINKS, type CalculatedDiagnostic } from '../../data/diagnostic'
import styles from './ResultsSection.module.css'

interface ResultsSectionProps {
  diagnostic: CalculatedDiagnostic
}

function getRingColor(state: CalculatedDiagnostic['state']) {
  if (state === 'green') {
    return '#00FF85'
  }

  if (state === 'yellow') {
    return '#FFD400'
  }

  return '#FF3B3B'
}

function getBulletColor(state: CalculatedDiagnostic['state']) {
  if (state === 'green') {
    return '#22C55E'
  }

  if (state === 'yellow') {
    return '#F59E0B'
  }

  return '#EF4444'
}

export default function ResultsSection({ diagnostic }: ResultsSectionProps) {
  const stateClass =
    diagnostic.state === 'green'
      ? styles.stateGreen
      : diagnostic.state === 'yellow'
        ? styles.stateYellow
        : styles.stateRed

  return (
    <section className={styles.screen} id="results">
      <div className={styles.container}>
        <ScoreRing color={getRingColor(diagnostic.state)} score={diagnostic.roundedScore} />

        <h2 className={`${styles.headline} ${stateClass}`}>{diagnostic.content.headline}</h2>

        <section className={styles.section}>
          <p className={styles.label}>EXECUTIVE SUMMARY</p>
          <p className={styles.body}>{diagnostic.content.executiveSummary}</p>
        </section>

        <section className={styles.section}>
          <p className={styles.label}>WHERE FORECASTS BREAK</p>
          <p className={styles.body}>{diagnostic.content.whereForecastsBreak}</p>
        </section>

        <section className={styles.section}>
          <p className={styles.label}>FORECAST IMPLICATION</p>
          <p className={styles.body}>{diagnostic.content.forecastImplication}</p>
        </section>

        <section className={styles.section}>
          <p className={styles.label}>EXECUTIVE ACTION</p>
          <ul
            className={styles.list}
            style={{ '--bullet-color': getBulletColor(diagnostic.state) } as CSSProperties}
          >
            {diagnostic.content.executiveAction.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <p className={styles.label}>TOP RISKS</p>
          <ul
            className={styles.list}
            style={{ '--bullet-color': getBulletColor(diagnostic.state) } as CSSProperties}
          >
            {diagnostic.content.topRisks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <div className={styles.urgencyBlock}>{diagnostic.content.urgency}</div>

        <section className={styles.ctaStack}>
          <a className={styles.primaryLink} href={CTA_LINKS.primary}>
            {diagnostic.content.primaryCtaLabel}
          </a>
          <a className={styles.secondaryLink} href={CTA_LINKS.secondary}>
            {diagnostic.content.secondaryCtaLabel}
          </a>
        </section>
      </div>
    </section>
  )
}
