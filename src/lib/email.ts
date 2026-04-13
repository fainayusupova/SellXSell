import emailjs from '@emailjs/browser'

import { CTA_LINKS, OWNER_EMAIL, type DiagnosticState, type LeadFormValues } from '../data/diagnostic'

export interface DiagnosticEmailPayload {
  lead: LeadFormValues
  score: number
  state: DiagnosticState
  icpScore: number
  meddicScore: number
  internalScore: number
  headline: string
  dealStatus: string
  forecastImpact: string
  recommendation: string
  executiveSummary: string
  forecastStatement: string
  executiveActions: string[]
  topRisks: string[]
  shockLine: string
  whatToDoNext: string[] | null
  ctaHeading: string
  ctaBody: string
  valueStack: string[]
  primaryCtaLabel: string
  secondaryCtaLabel: string
}

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
const userTemplateId = import.meta.env.VITE_EMAILJS_USER_TEMPLATE_ID
const ownerTemplateId = import.meta.env.VITE_EMAILJS_OWNER_TEMPLATE_ID

export const emailConfigurationReady = Boolean(
  serviceId && publicKey && userTemplateId && ownerTemplateId,
)

function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function formatList(values: string[]) {
  return values.map((value) => `• ${value}`).join('\n')
}

function buildBaseTemplateParams(payload: DiagnosticEmailPayload) {
  const formattedTopRisks = formatList(payload.topRisks)

  return {
    first_name: payload.lead.firstName,
    company_name: payload.lead.companyName,
    role: payload.lead.role,
    pipeline_status: payload.lead.pipelineStatus,
    arr_range: payload.lead.arrRange,
    score: payload.score,
    status: payload.state.toUpperCase(),
    headline: payload.headline,
    deal_status: payload.dealStatus,
    forecast_impact: payload.forecastImpact,
    recommendation: payload.recommendation,
    executive_summary: payload.executiveSummary,
    forecast_statement: payload.forecastStatement,
    executive_actions: formatList(payload.executiveActions),
    top_risks: formattedTopRisks,
    risks: formattedTopRisks,
    shock_line: payload.shockLine,
    what_to_do_next: payload.whatToDoNext ? formatList(payload.whatToDoNext) : '',
    icp_score: payload.icpScore,
    meddic_score: payload.meddicScore,
    internal_score: payload.internalScore,
    cta_heading: payload.ctaHeading,
    cta_body: payload.ctaBody,
    value_stack: formatList(payload.valueStack),
    primary_cta_label: payload.primaryCtaLabel,
    primary_cta_url: CTA_LINKS.primary,
    secondary_cta_label: payload.secondaryCtaLabel,
    secondary_cta_url: CTA_LINKS.secondary,
  }
}

function buildTemplateParams(payload: DiagnosticEmailPayload, recipientEmail: string) {
  const normalizedUserEmail = normalizeEmail(payload.lead.workEmail)
  const normalizedRecipient = normalizeEmail(recipientEmail)

  return {
    ...buildBaseTemplateParams(payload),
    email: normalizedRecipient,
    to_email: normalizedRecipient,
    recipient_email: normalizedRecipient,
    user_email: normalizedUserEmail,
    work_email: normalizedUserEmail,
    owner_email: OWNER_EMAIL,
    reply_to: normalizedUserEmail,
  }
}

export async function sendDiagnosticEmails(payload: DiagnosticEmailPayload) {
  const normalizedUserEmail = normalizeEmail(payload.lead.workEmail)

  if (
    !emailConfigurationReady ||
    !serviceId ||
    !publicKey ||
    !userTemplateId ||
    !ownerTemplateId ||
    !isValidEmail(normalizedUserEmail)
  ) {
    return
  }

  const userTemplateParams = buildTemplateParams(payload, normalizedUserEmail)
  const ownerTemplateParams = buildTemplateParams(payload, OWNER_EMAIL)

  const results = await Promise.allSettled([
    emailjs.send(serviceId, userTemplateId, userTemplateParams, { publicKey }),
    emailjs.send(serviceId, ownerTemplateId, ownerTemplateParams, { publicKey }),
  ])

  const [userResult, ownerResult] = results

  if (userResult.status === 'rejected') {
    console.warn('User diagnostic email failed to send.', userResult.reason)
  }

  if (ownerResult.status === 'rejected') {
    console.warn('Owner diagnostic email failed to send.', ownerResult.reason)
  }
}
