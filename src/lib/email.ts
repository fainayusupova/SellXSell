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

const serviceId = env.VITE_EMAILJS_SERVICE_ID
const publicKey = env.VITE_EMAILJS_PUBLIC_KEY
const userTemplateId = env.VITE_EMAILJS_TEMPLATE_USER_ID
const ownerTemplateId = env.VITE_EMAILJS_TEMPLATE_OWNER_ID

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
  return values.map((value) => `- ${value}`).join('\n')
}

function buildBaseTemplateParams(payload: DiagnosticEmailPayload) {
  return {
    subject: 'Your Revenue Diagnostic Results',
    preview:
      'Here is your score, your forecast assessment, and the next actions required before you commit this number.',
    score: payload.score,
    assessment: payload.headline,
    executive_summary: payload.executiveSummary,
    top_risks: formatList(payload.topRisks),
    actions: formatList(payload.executiveActions),
    reply_cta: 'RUN MY PIPELINE',
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
