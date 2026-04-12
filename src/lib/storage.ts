import {
  DEFAULT_LEAD_VALUES,
  type AnswerValue,
  type DiagnosticStage,
  type LeadFormValues,
} from '../data/diagnostic'

export interface DiagnosticSession {
  stage: DiagnosticStage
  answers: AnswerValue[]
  activeQuestion: number
  lead: LeadFormValues
  adminBypass: boolean
}

const SESSION_STORAGE_KEY = 'sellxsell-diagnostic-session'
const LEAD_STORAGE_KEY = 'lead'

export const defaultSession: DiagnosticSession = {
  stage: 'hero',
  answers: [],
  activeQuestion: 0,
  lead: DEFAULT_LEAD_VALUES,
  adminBypass: false,
}

function sanitizeLeadValue(value: unknown): LeadFormValues {
  if (!value || typeof value !== 'object') {
    return DEFAULT_LEAD_VALUES
  }

  const lead = value as Partial<LeadFormValues>

  return {
    firstName: typeof lead.firstName === 'string' ? lead.firstName : DEFAULT_LEAD_VALUES.firstName,
    workEmail: typeof lead.workEmail === 'string' ? lead.workEmail : DEFAULT_LEAD_VALUES.workEmail,
    companyName:
      typeof lead.companyName === 'string' ? lead.companyName : DEFAULT_LEAD_VALUES.companyName,
    role:
      lead.role === 'CRO' ||
      lead.role === 'CFO' ||
      lead.role === 'CEO' ||
      lead.role === 'VP Sales' ||
      lead.role === 'Other'
        ? lead.role
        : DEFAULT_LEAD_VALUES.role,
    pipelineStatus:
      lead.pipelineStatus === 'Feels strong but inconsistent' ||
      lead.pipelineStatus === 'Not confident in forecast' ||
      lead.pipelineStatus === 'Deals slipping late' ||
      lead.pipelineStatus === 'No clear inspection process'
        ? lead.pipelineStatus
        : DEFAULT_LEAD_VALUES.pipelineStatus,
    arrRange:
      lead.arrRange === '' ||
      lead.arrRange === '<$10M' ||
      lead.arrRange === '$10–50M' ||
      lead.arrRange === '$50–100M' ||
      lead.arrRange === '$100M+'
        ? lead.arrRange
        : DEFAULT_LEAD_VALUES.arrRange,
  }
}

export function loadSession(): DiagnosticSession {
  if (typeof window === 'undefined') {
    return defaultSession
  }

  const raw = window.localStorage.getItem(SESSION_STORAGE_KEY)

  if (!raw) {
    return defaultSession
  }

  try {
    const parsed = JSON.parse(raw) as Partial<DiagnosticSession>
    const answers = Array.isArray(parsed.answers)
      ? parsed.answers.filter((value): value is AnswerValue => value === 0 || value === 1 || value === 2)
      : []
    const stage =
      parsed.stage === 'quiz' || parsed.stage === 'gate' || parsed.stage === 'results'
        ? parsed.stage
        : 'hero'
    const activeQuestion =
      typeof parsed.activeQuestion === 'number' && parsed.activeQuestion >= 0
        ? Math.min(parsed.activeQuestion, answers.length)
        : answers.length

    return {
      stage,
      answers,
      activeQuestion,
      lead: sanitizeLeadValue(parsed.lead),
      adminBypass: parsed.adminBypass === true,
    }
  } catch {
    return defaultSession
  }
}

export function saveSession(session: DiagnosticSession) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
}

export function saveLead(lead: LeadFormValues) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(lead))
}

export function clearSession() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(SESSION_STORAGE_KEY)
  window.localStorage.removeItem(LEAD_STORAGE_KEY)
}
