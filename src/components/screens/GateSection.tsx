import { type FormEvent, type RefObject } from 'react'

import {
  ARR_RANGE_OPTIONS,
  GATE_COPY,
  LEAD_ROLE_OPTIONS,
  PIPELINE_STATUS_OPTIONS,
  type LeadFormValues,
} from '../../data/diagnostic'
import styles from './GateSection.module.css'

interface GateSectionProps {
  lead: LeadFormValues
  sendingResults: boolean
  formRef: RefObject<HTMLFormElement | null>
  onLeadChange: <K extends keyof LeadFormValues>(field: K, value: LeadFormValues[K]) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>
}

export default function GateSection({
  lead,
  sendingResults,
  formRef,
  onLeadChange,
  onSubmit,
}: GateSectionProps) {
  return (
    <section className={styles.screen}>
      <article className={styles.card} id="leadGate">
        <header className={styles.header}>
          <h2 className={styles.title}>{GATE_COPY.heading}</h2>
          <p className={styles.subtext}>{GATE_COPY.subtext}</p>
        </header>

        <form className={styles.form} id="lead-gate" onSubmit={onSubmit} ref={formRef}>
          <input
            className={styles.input}
            name="firstName"
            onChange={(event) => onLeadChange('firstName', event.target.value)}
            placeholder="First Name *"
            required
            value={lead.firstName}
          />

          <input
            autoComplete="email"
            className={styles.input}
            name="email"
            onChange={(event) => onLeadChange('workEmail', event.target.value)}
            placeholder="Work Email *"
            required
            type="email"
            value={lead.workEmail}
          />

          <input
            className={styles.input}
            name="company"
            onChange={(event) => onLeadChange('companyName', event.target.value)}
            placeholder="Company Name *"
            required
            value={lead.companyName}
          />

          <select
            className={styles.select}
            name="role"
            onChange={(event) => onLeadChange('role', event.target.value as LeadFormValues['role'])}
            required
            value={lead.role}
          >
            {LEAD_ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          <select
            className={styles.select}
            name="pipelineStatus"
            onChange={(event) =>
              onLeadChange('pipelineStatus', event.target.value as LeadFormValues['pipelineStatus'])
            }
            required
            value={lead.pipelineStatus}
          >
            {PIPELINE_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            className={styles.select}
            name="arr"
            onChange={(event) => onLeadChange('arrRange', event.target.value as LeadFormValues['arrRange'])}
            value={lead.arrRange}
          >
            <option value="">ARR (optional)</option>
            {ARR_RANGE_OPTIONS.filter(Boolean).map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>

          <button className={styles.button} disabled={sendingResults} type="submit">
            {GATE_COPY.buttonLabel}
          </button>
        </form>
      </article>
    </section>
  )
}
