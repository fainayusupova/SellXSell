export type DiagnosticStage = 'hero' | 'quiz' | 'gate' | 'results'
export type DiagnosticState = 'green' | 'yellow' | 'red'
export type DiagnosticCategory = 'ICP' | 'MEDDIC' | 'INTERNAL ALIGNMENT'
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
  category: DiagnosticCategory
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
  dealStatus: 'REAL' | 'AT RISK' | 'WILL NOT CLOSE'
  forecastImpact: 'COMMITTABLE' | 'OVERSTATED' | 'DISTORTING'
  recommendation: 'COMMIT' | 'DO NOT COMMIT' | 'REMOVE'
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

export interface CalculatedDiagnostic {
  roundedScore: number
  state: DiagnosticState
  icpScore: number
  meddicScore: number
  internalScore: number
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
  { id: 1, category: 'ICP', prompt: 'Is this opportunity a true fit with your Ideal Customer Profile?' },
  { id: 2, category: 'ICP', prompt: 'Is this consistent with deals your team has actually closed — not deals that felt close?' },
  { id: 3, category: 'ICP', prompt: 'Did this opportunity originate from a repeatable, qualified demand source?' },
  { id: 4, category: 'ICP', prompt: 'Is there a quantified business case that justifies this purchase?' },
  { id: 5, category: 'ICP', prompt: 'Does your team have direct access to the economic buyer?' },
  { id: 6, category: 'MEDDIC', prompt: 'Are the decision criteria explicitly defined and confirmed?' },
  { id: 7, category: 'MEDDIC', prompt: 'Is the decision process fully mapped — with no unknown steps?' },
  { id: 8, category: 'MEDDIC', prompt: 'Is there a clear and urgent business problem driving this deal?' },
  { id: 9, category: 'MEDDIC', prompt: 'Does your team have a real champion actively driving this forward?' },
  { id: 10, category: 'MEDDIC', prompt: 'Does your team fully understand the competitive landscape and its position in it?' },
  { id: 11, category: 'MEDDIC', prompt: 'Does your leadership team have a clear, evidence-based reason this deal will close?' },
  { id: 12, category: 'INTERNAL ALIGNMENT', prompt: 'Is this deal in your forecast because of evidence — not rep belief?' },
  { id: 13, category: 'INTERNAL ALIGNMENT', prompt: 'Could your leadership team defend this deal in a board-level forecast review today?' },
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
  heading: 'Unlock Your Deal Reality',
  subtext: 'See what is real, what is at risk, and what will actually close.',
  buttonLabel: 'Reveal My Result',
}

const SHARED_CTA_HEADING = 'Validate your next two quarters of forecast'
const SHARED_CTA_BODY =
  'Bring your forecasted deals across the next two quarters. We will show you what is real, what is at risk, and what should be removed from your forecast.'

const SHARED_VALUE_STACK = [
  'Full pipeline diagnostic across your forecast for the next two quarters',
  'Deep analysis across ICP, MEDDIC, and internal alignment',
  'Identification of what is real, what is at risk, and what should be removed from your forecast',
  'Clear executive recommendation on what to commit, remove, and rebuild',
  'Up to 3 team members included in the session',
]

export const RESULT_CONTENT: Record<DiagnosticState, ResultStateContent> = {
  green: {
    headline: 'THIS DEAL IS REAL',
    dealStatus: 'REAL',
    forecastImpact: 'COMMITTABLE',
    recommendation: 'COMMIT',
    executiveSummary:
      'This opportunity is qualified, validated, and aligned across stakeholders. It represents a defensible position in your forecast.',
    forecastStatement: 'This is a deal you can confidently commit.',
    executiveActions: [
      'Commit with discipline — maintain inspection cadence weekly',
      'Secure written confirmation of decision criteria and timeline',
      'Preempt competitive disruption with executive alignment call',
    ],
    topRisks: ['Late-stage scope expansion', 'Competitive disruption', 'Internal deprioritization'],
    shockLine: 'If this deal matters to your number, validate it before it turns into a late-quarter surprise.',
    whatToDoNext: null,
    ctaHeading: SHARED_CTA_HEADING,
    ctaBody: SHARED_CTA_BODY,
    valueStack: SHARED_VALUE_STACK,
    primaryCtaLabel: 'RUN FULL PIPELINE DIAGNOSTIC →',
    secondaryCtaLabel: 'BOOK 30-MINUTE PRESSURE TEST →',
  },
  yellow: {
    headline: 'THIS DEAL IS AT RISK',
    dealStatus: 'AT RISK',
    forecastImpact: 'OVERSTATED',
    recommendation: 'DO NOT COMMIT',
    executiveSummary:
      'This deal is being carried as real, but key qualification gaps remain. Without intervention, it will slip or stall.',
    forecastStatement: 'This deal is overstated in the forecast and cannot be relied on.',
    executiveActions: [
      'Do not commit — reclassify as upside until buyer is engaged',
      'Force decision path clarity within 5 business days',
      'Escalate to executive sponsor to anchor timeline to consequence',
    ],
    topRisks: ['Economic buyer not fully engaged', 'Decision process incomplete', 'Timeline not tied to consequence'],
    shockLine: 'If this deal is in your forecast today, your number is already at risk.',
    whatToDoNext: null,
    ctaHeading: SHARED_CTA_HEADING,
    ctaBody: SHARED_CTA_BODY,
    valueStack: SHARED_VALUE_STACK,
    primaryCtaLabel: 'RUN FULL PIPELINE DIAGNOSTIC →',
    secondaryCtaLabel: 'BOOK 30-MINUTE PRESSURE TEST →',
  },
  red: {
    headline: 'THIS DEAL WILL NOT CLOSE',
    dealStatus: 'WILL NOT CLOSE',
    forecastImpact: 'DISTORTING',
    recommendation: 'REMOVE',
    executiveSummary:
      'This opportunity lacks the qualification required to progress. It should not be treated as a viable deal.',
    forecastStatement: 'This deal is distorting your forecast and should be removed immediately.',
    executiveActions: [
      'Remove from forecast immediately',
      'Reallocate resources to ICP-qualified opportunities',
      'Rebuild pipeline using validated demand sources only',
    ],
    topRisks: ['No economic buyer', 'No validated business case', 'No defined decision path'],
    shockLine: 'If multiple deals look like this, your pipeline is not weak — it is misclassified.',
    whatToDoNext: [
      'Bring your forecasted deals across the next two quarters.',
      'We will show you what is real, what is at risk, and what should be removed from your forecast.',
      'This is not an outlier.',
      'This is how your pipeline is behaving.',
    ],
    ctaHeading: SHARED_CTA_HEADING,
    ctaBody: SHARED_CTA_BODY,
    valueStack: SHARED_VALUE_STACK,
    primaryCtaLabel: 'RUN FULL PIPELINE DIAGNOSTIC →',
    secondaryCtaLabel: 'BOOK 30-MINUTE PRESSURE TEST →',
  },
}

function averageScore(values: AnswerValue[]) {
  if (values.length === 0) return 0
  const total = values.reduce<number>((sum, value) => sum + value, 0)
  return total / values.length
}

function toPercent(value: number) {
  return Math.round((value / 2) * 100)
}

export function calculateDiagnostic(answers: AnswerValue[]): CalculatedDiagnostic {
  const icpScore = toPercent(averageScore(answers.slice(0, 5)))
  const meddicScore = toPercent(averageScore(answers.slice(5, 11)))
  const internalScore = toPercent(averageScore(answers.slice(11, 13)))

  const weightedScore = (((icpScore / 100) * 0.2) + ((meddicScore / 100) * 0.6) + ((internalScore / 100) * 0.2)) * 100
  const roundedScore = Math.round(weightedScore)

  let state: DiagnosticState = 'red'
  if (roundedScore >= 75) {
    state = 'green'
  } else if (roundedScore >= 50) {
    state = 'yellow'
  }

  return {
    roundedScore,
    state,
    icpScore,
    meddicScore,
    internalScore,
    content: RESULT_CONTENT[state],
  }
}
