import type { CSSProperties } from 'react'

import ScoreRing from '../ScoreRing'
import { CTA_LINKS, type CalculatedDiagnostic } from '../../data/diagnostic'
import styles from './ResultsSection.module.css'

interface ResultsSectionProps {
  diagnostic: CalculatedDiagnostic
}

function getRingColor(state: CalculatedDiagnostic['state']) {
  if (state === 'green') return '#22C55E'
  if (state === 'yellow') return '#FACC15'
  return '#EF4444'
}

function getStateClass(state: CalculatedDiagnostic['state']) {
  if (state === 'green') return styles.stateGreen
  if (state === 'yellow') return styles.stateYellow
  return styles.stateRed
}

export default function ResultsSection({ diagnostic }: ResultsSectionProps) {
  const stateClass = getStateClass(diagnostic.state)
  const bulletColor =
    diagnostic.state === 'green' ? '#22C55E' : diagnostic.state === 'yellow' ? '#FACC15' : '#EF4444'

  return (
    <section className={styles.screen} id="results">
      <div className={styles.container}>
        <div className={styles.left}>
          <ScoreRing color={getRingColor(diagnostic.state)} score={diagnostic.roundedScore} />

          <h2 className={`${styles.headline} ${stateClass}`}>{diagnostic.content.headline}</h2>

          <div className={styles.snapshot}>
            <div className={styles.snapshotItem}>DEAL STATUS: {diagnostic.content.dealStatus}</div>
            <div className={styles.snapshotItem}>CONFIDENCE: {diagnostic.roundedScore}%</div>
            <div className={styles.snapshotItem}>FORECAST IMPACT: {diagnostic.content.forecastImpact}</div>
            <div className={styles.snapshotItem}>RECOMMENDATION: {diagnostic.content.recommendation}</div>
          </div>

          <section className={styles.section}>
            <p className={styles.label}>EXECUTIVE SUMMARY</p>
            <p className={styles.body}>{diagnostic.content.executiveSummary}</p>
          </section>

          <section className={styles.section}>
            <p className={styles.label}>FORECAST STATEMENT</p>
            <p className={styles.body}>{diagnostic.content.forecastStatement}</p>
          </section>
        </div>

        <div className={styles.right}>
          <section className={styles.card}>
            <p className={styles.label}>CATEGORY SCORES</p>
            <div className={styles.categoryScores}>
              <div className={styles.scorePill}>
                <span>ICP</span>
                <strong>{diagnostic.icpScore}%</strong>
              </div>
              <div className={styles.scorePill}>
                <span>MEDDIC</span>
                <strong>{diagnostic.meddicScore}%</strong>
              </div>
              <div className={styles.scorePill}>
                <span>INTERNAL ALIGNMENT</span>
                <strong>{diagnostic.internalScore}%</strong>
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <p className={styles.label}>EXECUTIVE RECOMMENDATIONS</p>
            <ul className={styles.list} style={{ '--bullet-color': bulletColor } as CSSProperties}>
              {diagnostic.content.executiveActions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className={styles.card}>
            <p className={styles.label}>TOP RISKS</p>
            <ul className={styles.list} style={{ '--bullet-color': bulletColor } as CSSProperties}>
              {diagnostic.content.topRisks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className={styles.shock}>{diagnostic.content.shockLine}</div>
          </section>
        </div>

        {diagnostic.content.whatToDoNext && (
          <section className={styles.redNext}>
            <p className={styles.label}>WHAT TO DO NEXT</p>
            {diagnostic.content.whatToDoNext.map((item) => (
              <p className={styles.body} key={item}>
                {item}
              </p>
            ))}
          </section>
        )}

        <section className={styles.cta}>
          <h3 className={styles.ctaHeading}>{diagnostic.content.ctaHeading}</h3>
          <p className={styles.ctaBody}>{diagnostic.content.ctaBody}</p>

          <ul className={styles.valueStack}>
            {diagnostic.content.valueStack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className={styles.price}>$1,800</div>

          <div className={styles.ctaStack}>
            <a className={styles.primaryLink} href={CTA_LINKS.primary}>
              {diagnostic.content.primaryCtaLabel}
            </a>
            <a className={styles.secondaryLink} href={CTA_LINKS.secondary}>
              {diagnostic.content.secondaryCtaLabel}
            </a>
          </div>
        </section>
      </div>
    </section>
  )
}
