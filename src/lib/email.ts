import emailjs from '@emailjs/browser'

import { OWNER_EMAIL, type DiagnosticState, type LeadFormValues } from '../data/diagnostic'

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

const env = import.meta.env as unknown as Record<string, string | undefined>

const publicKey = env.VITE_EMAILJS_PUBLIC_KEY
const serviceId = env.VITE_EMAILJS_SERVICE_ID
const templateUserId = env.VITE_EMAILJS_TEMPLATE_USER_ID
const templateOwnerId = env.VITE_EMAILJS_TEMPLATE_OWNER_ID
const calendlyLink = 'https://calendly.com/sellxsellrev'

export const emailConfigurationReady = Boolean(
  publicKey && serviceId && templateUserId && templateOwnerId,
)

function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function formatList(values: string[]) {
  return values.map((value) => `- ${value}`).join('\n')
}

function buildBaseTemplateParams(payload: DiagnosticEmailPayload) {
  const sharedTemplateParams = {
    reply_cta: 'Pressure Test My Pipeline Live',
    calendly_link: calendlyLink,
    primary_cta_label: 'Pressure Test My Pipeline Live',
    primary_cta_url: calendlyLink,
  }

  return {
    first_name: payload.lead.firstName,
    company_name: payload.lead.companyName,
    role: payload.lead.role,
    pipeline_status: payload.lead.pipelineStatus,
    arr_range: payload.lead.arrRange,
    score: payload.score,
    status: payload.state.toUpperCase(),
    headline: payload.headline,
    assessment: payload.headline,
    deal_status: payload.dealStatus,
    forecast_impact: payload.forecastImpact,
    recommendation: payload.recommendation,
    executive_summary: payload.executiveSummary,
    forecast_statement: payload.forecastStatement,
    executive_actions: formatList(payload.executiveActions),
    actions: formatList(payload.executiveActions),
    top_risks: formatList(payload.topRisks),
    risks: formatList(payload.topRisks),
    shock_line: payload.shockLine,
    what_to_do_next: payload.whatToDoNext ? formatList(payload.whatToDoNext) : '',
    icp_score: payload.icpScore,
    meddic_score: payload.meddicScore,
    internal_score: payload.internalScore,
    cta_heading: payload.ctaHeading,
    cta_body: payload.ctaBody,
    value_stack: formatList(payload.valueStack),
    subject: 'Your Revenue Diagnostic Results',
    preview:
      'Here is your score, your forecast assessment, and the next actions required before you commit this number.',
    ...sharedTemplateParams,
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

  if (!publicKey || !serviceId || !templateUserId || !templateOwnerId) {
    console.warn('EmailJS is not fully configured. Results email skipped.')
    return
  }

  if (!isValidEmail(normalizedUserEmail)) {
    return
  }

  const userTemplateParams = buildTemplateParams(payload, normalizedUserEmail)
  const ownerTemplateParams = buildTemplateParams(payload, OWNER_EMAIL)

  const results = await Promise.allSettled([
    emailjs.send(serviceId, templateUserId, userTemplateParams, { publicKey }),
    emailjs.send(serviceId, templateOwnerId, ownerTemplateParams, { publicKey }),
  ])

  const [userResult, ownerResult] = results

  if (userResult.status === 'rejected') {
    console.warn('User diagnostic email failed to send.', userResult.reason)
  }

  if (ownerResult.status === 'rejected') {
    console.warn('Owner diagnostic email failed to send.', ownerResult.reason)
  }
}
