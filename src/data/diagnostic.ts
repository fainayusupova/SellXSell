export type DiagnosticStage = 'hero' | 'quiz' | 'gate' | 'results'
export type DiagnosticState = 'green' | 'yellow' | 'red'
export type AnswerValue = 0 | 1 | 2
export type AnswerType = 'yes' | 'partial' | 'no'
export type LeadRole = 'CRO' | 'CFO' | 'CEO' | 'VP Sales' | 'Other'
export type PipelineStatus =
  | 'Feels strong but inconsistent'
  | 'Not confident in forecast'
  | 'Deals slipping late'
  | 'No clear inspection process'
export type ArrRange = '' | '<$10M' | '$10–50M' | '$50–100M' | '$100M+'

export interface Question {
  id: number
  prompt: string
}

export interface LeadFormValues {
  firstName: string
  workEmail: string
  companyName: string
  role: LeadRole
  pipelineStatus: PipelineStatus
  arrRange: ArrRange
}

export interface ResultStateContent {
  headline: string
  executiveSummary: string
  whereForecastsBreak: string
  forecastImplication: string
  executiveAction: string[]
  topRisks: string[]
  urgency: string
  primaryCtaLabel: string
  secondaryCtaLabel: string
}

export interface CalculatedDiagnostic {
  roundedScore: number
  state: DiagnosticState
  content: ResultStateContent
}

export const OWNER_EMAIL = 'shelley@sellxsell.com'

export const CTA_LINKS = {
  primary: import.meta.env.VITE_PRIMARY_CTA_URL ?? '#',
  secondary: import.meta.env.VITE_SECONDARY_CTA_URL ?? '#',
}

export const LEAD_ROLE_OPTIONS: LeadRole[] = ['CRO', 'CFO', 'CEO', 'VP Sales', 'Other']

export const PIPELINE_STATUS_OPTIONS: PipelineStatus[] = [
  'Feels strong but inconsistent',
  'Not confident in forecast',
  'Deals slipping late',
  'No clear inspection process',
]

export const ARR_RANGE_OPTIONS: ArrRange[] = ['', '<$10M', '$10–50M', '$50–100M', '$100M+']

export const DEFAULT_LEAD_VALUES: LeadFormValues = {
  firstName: '',
  workEmail: '',
  companyName: '',
  role: 'CRO',
  pipelineStatus: 'Feels strong but inconsistent',
  arrRange: '',
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    prompt: 'Do you have direct access to the economic buyer?',
  },
  {
    id: 2,
    prompt: 'Has the customer confirmed measurable business impact?',
  },
  {
    id: 3,
    prompt: 'Is the decision process fully defined and agreed?',
  },
  {
    id: 4,
    prompt: 'Is there a quantified business case that justifies this purchase?',
  },
  {
    id: 5,
    prompt: 'Does your team have direct access to the economic buyer?',
  },
  {
    id: 6,
    prompt: 'Are the decision criteria explicitly defined and confirmed?',
  },
  {
    id: 7,
    prompt: 'Is the decision process fully mapped — with no unknown steps?',
  },
  {
    id: 8,
    prompt: 'Is there a clear and urgent business problem driving this deal?',
  },
  {
    id: 9,
    prompt: 'Does your team have a real champion actively driving this forward?',
  },
  {
    id: 10,
    prompt: 'Does your team fully understand the competitive landscape and its position in it?',
  },
  {
    id: 11,
    prompt: 'Does your leadership team have a clear, evidence-based reason this deal will close?',
  },
  {
    id: 12,
    prompt: 'Is this deal in your forecast because of evidence — not rep belief?',
  },
  {
    id: 13,
    prompt: 'Could your leadership team defend this deal in a board-level forecast review today?',
  },
]

export const ANSWER_OPTIONS: { label: string; value: AnswerValue; type: AnswerType }[] = [
  { label: 'YES', value: 2, type: 'yes' },
  { label: 'PARTIAL', value: 1, type: 'partial' },
  { label: 'NO', value: 0, type: 'no' },
]

export const HERO_COPY = {
  heading: 'YOUR FORECAST LOOKS REAL. IT ISN’T.',
  subhead: 'Most pipelines are filled with deals that will never close.',
  frame: 'Answer as if you’re defending this deal in a board forecast call.',
  body: [
    'This is how you separate real revenue from pipeline fiction.',
    'In less than 3 minutes, you’ll know what will close — and what won’t.',
  ],
  ctaLabel: 'RUN THE DIAGNOSTIC →',
  proof: 'Used by CROs and revenue leaders to pressure-test pipeline before board meetings.',
  footer: '13 questions. No prep required.',
}

export const GATE_COPY = {
  heading: 'Get Your Full Executive Breakdown',
  subtext: 'See what’s real, what’s at risk, and what should be removed from your forecast.',
  buttonLabel: 'See My Results',
}

export const RESULT_CONTENT: Record<DiagnosticState, ResultStateContent> = {
  green: {
    headline: 'THIS DEAL IS REAL',
    executiveSummary: 'Validated across MEDDIC, ICP, and stakeholder alignment.',
    whereForecastsBreak: 'Scope/criteria/priorities shift late.',
    forecastImplication: 'Commit with inspection.',
    executiveAction: ['Maintain access', 'Lock process', 'Prevent risk'],
    topRisks: ['Misalignment', 'Competition', 'Timeline'],
    urgency: 'Protect this deal before it slips.',
    primaryCtaLabel: 'PRESSURE TEST 3–5 DEALS',
    secondaryCtaLabel: 'VALIDATE FULL PIPELINE',
  },
  yellow: {
    headline: 'THIS DEAL IS AT RISK',
    executiveSummary: 'Partial validation. Gaps exist.',
    whereForecastsBreak: 'Activity mistaken for proof.',
    forecastImplication: 'DO NOT COMMIT.',
    executiveAction: ['Re-engage buyer', 'Map process', 'Validate impact'],
    topRisks: ['Missing stakeholders', 'Weak metrics', 'Undefined process'],
    urgency: 'Fix now or it will slip.',
    primaryCtaLabel: 'FIX AT-RISK DEALS NOW',
    secondaryCtaLabel: 'RUN FULL DIAGNOSTIC',
  },
  red: {
    headline: 'THIS DEAL WILL NOT CLOSE',
    executiveSummary: 'False/insufficient signals.',
    whereForecastsBreak: 'Pipeline fiction enters.',
    forecastImplication: 'REMOVE IMMEDIATELY.',
    executiveAction: ['Remove', 'Reallocate', 'Requalify'],
    topRisks: ['No buyer', 'No process', 'No urgency'],
    urgency: 'This deal puts your number at risk.',
    primaryCtaLabel: 'CLEAN PIPELINE NOW',
    secondaryCtaLabel: 'BOOK PRESSURE TEST',
  },
}

export function calculateScore(answers: AnswerValue[]): number {
  const total = answers.reduce<number>((sum, value) => sum + value, 0)
  const max = answers.length * 2

  if (max === 0) {
    return 0
  }

  return Math.round((total / max) * 100)
}

export function getCategory(score: number): DiagnosticState {
  if (score <= 40) {
    return 'red'
  }

  if (score <= 74) {
    return 'yellow'
  }

  return 'green'
}

export function calculateDiagnostic(answers: AnswerValue[]): CalculatedDiagnostic {
  const roundedScore = calculateScore(answers)
  const state = getCategory(roundedScore)

  return {
    roundedScore,
    state,
    content: RESULT_CONTENT[state],
  }
}
