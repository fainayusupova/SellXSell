import emailjs from '@emailjs/browser'

import { CTA_LINKS, OWNER_EMAIL, type DiagnosticState, type LeadFormValues } from '../data/diagnostic'

export interface DiagnosticEmailPayload {
  lead: LeadFormValues
  score: number
  state: DiagnosticState
  headline: string
  executiveSummary: string
  forecastImplication: string
  executiveAction: string[]
  topRisks: string[]
  urgency: string
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

function buildBaseTemplateParams(payload: DiagnosticEmailPayload) {
  const executiveAction = payload.executiveAction.join('\n')
  const topRisks = payload.topRisks.join('\n')

  return {
    first_name: payload.lead.firstName,
    company_name: payload.lead.companyName,
    role: payload.lead.role,
    pipeline_status: payload.lead.pipelineStatus,
    arr_range: payload.lead.arrRange,
    score: payload.score,
    status: payload.state.toUpperCase(),
    headline: payload.headline,
    executive_summary: payload.executiveSummary,
    forecast_implication: payload.forecastImplication,
    executive_action: executiveAction,
    top_risks: topRisks,
    risks: topRisks,
    urgency: payload.urgency,
    primary_cta_label: payload.primaryCtaLabel,
    primary_cta_url: CTA_LINKS.primary,
    secondary_cta_label: payload.secondaryCtaLabel,
    secondary_cta_url: CTA_LINKS.secondary,
    icp: '',
    meddic: '',
    internal: '',
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
