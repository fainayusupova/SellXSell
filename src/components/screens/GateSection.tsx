import { type FormEvent, type RefObject } from 'react'

import {
  ARR_RANGE_OPTIONS,
  GATE_COPY,
  LEAD_ROLE_OPTIONS,
  PIPELINE_STATUS_OPTIONS,
  type CalculatedDiagnostic,
  type LeadFormValues,
} from '../../data/diagnostic'
import styles from './GateSection.module.css'

interface GateSectionProps {
  diagnostic: CalculatedDiagnostic
  lead: LeadFormValues
  sendingResults: boolean
  formRef: RefObject<HTMLFormElement | null>
  onLeadChange: <K extends keyof LeadFormValues>(field: K, value: LeadFormValues[K]) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>
}

export default function GateSection({
  diagnostic,
  lead,
  sendingResults,
  formRef,
  onLeadChange,
  onSubmit,
}: GateSectionProps) {
  return (
    <section className={styles.screen}>
      <div className={styles.container}>
        <div className={styles.left}>
          <p className={styles.label}>RESULTS LOCKED</p>
          <h2 className={styles.heading}>{GATE_COPY.heading}</h2>
          <p className={styles.subtext}>{GATE_COPY.subtext}</p>

          <div className={styles.previewCard} aria-hidden="true">
            <div className={styles.previewScore}>{diagnostic.roundedScore}%</div>
            <div className={styles.previewHeadline}>{diagnostic.content.headline}</div>
          </div>
        </div>

        <form className={styles.form} noValidate onSubmit={onSubmit} ref={formRef}>
          <input
            className={styles.input}
            onChange={(event) => onLeadChange('firstName', event.target.value)}
            placeholder="First Name *"
            required
            value={lead.firstName}
          />

          <input
            className={styles.input}
            onChange={(event) => {
              event.currentTarget.setCustomValidity('')
              onLeadChange('workEmail', event.target.value)
            }}
            placeholder="Work Email *"
            required
            type="email"
            value={lead.workEmail}
          />

          <p className={styles.helperText}>
            Use your company email so SellXSell can identify the account correctly and route follow-up to the right
            leadership team.
          </p>

          <input
            className={styles.input}
            onChange={(event) => onLeadChange('companyName', event.target.value)}
            placeholder="Company Name *"
            required
            value={lead.companyName}
          />

          <select
            className={styles.select}
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
            {sendingResults ? 'Sending Results…' : GATE_COPY.buttonLabel}
          </button>
        </form>
      </div>
    </section>
  )
}
