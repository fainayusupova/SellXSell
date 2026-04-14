import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'

import styles from './App.module.css'
import GateSection from './components/screens/GateSection'
import HeroSection from './components/screens/HeroSection'
import QuizSection from './components/screens/QuizSection'
import ResultsSection from './components/screens/ResultsSection'
import {
  DEFAULT_LEAD_VALUES,
  OWNER_EMAIL,
  QUESTIONS,
  calculateDiagnostic,
  type AnswerValue,
  type DiagnosticStage,
  type LeadFormValues,
} from './data/diagnostic'
import { sendDiagnosticEmails } from './lib/email'
import { clearSession, loadSession, saveLead, saveSession } from './lib/storage'

const BLOCKED_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'icloud.com',
  'aol.com',
  'live.com',
  'msn.com',
  'me.com',
  'protonmail.com',
  'proton.me',
])

const PERSONAL_EMAIL_BLOCK_MESSAGE =
  'Please use your company email so we can properly assess your pipeline and identify the right stakeholders inside the account.'

function hasAdminQueryParam() {
  if (typeof window === 'undefined') {
    return false
  }

  return new URLSearchParams(window.location.search).get('admin') === 'true'
}

function ensureAdminLead(lead: LeadFormValues): LeadFormValues {
  if (lead.workEmail.trim()) {
    return lead
  }

  return {
    ...lead,
    workEmail: OWNER_EMAIL,
  }
}

function isBlockedPersonalEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase()
  const domain = normalizedEmail.split('@')[1]

  return Boolean(domain && BLOCKED_EMAIL_DOMAINS.has(domain))
}

function App() {
  const [initialSession] = useState(() => loadSession())
  const [stage, setStage] = useState<DiagnosticStage>(initialSession.stage)
  const [answers, setAnswers] = useState<AnswerValue[]>(initialSession.answers)
  const [activeQuestion, setActiveQuestion] = useState<number>(initialSession.activeQuestion)
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerValue | null>(null)
  const [lead, setLead] = useState<LeadFormValues>(initialSession.lead)
  const [sendingResults, setSendingResults] = useState(false)
  const [adminBypass, setAdminBypass] = useState(initialSession.adminBypass || hasAdminQueryParam())

  const answerTimeoutRef = useRef<number | null>(null)
  const gateFormRef = useRef<HTMLFormElement | null>(null)

  const currentQuestion = QUESTIONS[activeQuestion]
  const diagnostic = answers.length === QUESTIONS.length ? calculateDiagnostic(answers) : null

  useEffect(() => {
    saveSession({
      stage,
      answers,
      activeQuestion,
      lead,
      adminBypass,
    })
  }, [stage, answers, activeQuestion, lead, adminBypass])

  useEffect(() => {
    document.body.dataset.stage = stage
    window.scrollTo({ top: 0 })

    return () => {
      delete document.body.dataset.stage
    }
  }, [stage])

  useEffect(() => {
    return () => {
      if (answerTimeoutRef.current !== null) {
        window.clearTimeout(answerTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if ((stage === 'gate' || stage === 'results') && !diagnostic) {
      setStage('hero')
      setAnswers([])
      setActiveQuestion(0)
      setLead(DEFAULT_LEAD_VALUES)
    }
  }, [diagnostic, stage])

  const handleStart = () => {
    if (answerTimeoutRef.current !== null) {
      window.clearTimeout(answerTimeoutRef.current)
      answerTimeoutRef.current = null
    }

    clearSession()
    setAnswers([])
    setActiveQuestion(0)
    setSelectedAnswer(null)
    setLead(DEFAULT_LEAD_VALUES)
    setSendingResults(false)
    setAdminBypass(hasAdminQueryParam())
    setStage('quiz')
  }

  const unlockResults = useCallback(
    async (nextLead: LeadFormValues, nextAdminBypass: boolean) => {
      if (!diagnostic) {
        return
      }

      const finalLead = nextAdminBypass ? ensureAdminLead(nextLead) : nextLead

      setLead(finalLead)
      setAdminBypass(nextAdminBypass)
      saveLead(finalLead)
      setStage('results')
      setSendingResults(true)

      try {
        await sendDiagnosticEmails({
          lead: finalLead,
          score: diagnostic.roundedScore,
          state: diagnostic.state,
          icpScore: diagnostic.icpScore,
          meddicScore: diagnostic.meddicScore,
          internalScore: diagnostic.internalScore,
          headline: diagnostic.content.headline,
          dealStatus: diagnostic.content.dealStatus,
          forecastImpact: diagnostic.content.forecastImpact,
          recommendation: diagnostic.content.recommendation,
          executiveSummary: diagnostic.content.executiveSummary,
          forecastStatement: diagnostic.content.forecastStatement,
          executiveActions: diagnostic.content.executiveActions,
          topRisks: diagnostic.content.topRisks,
          shockLine: diagnostic.content.shockLine,
          whatToDoNext: diagnostic.content.whatToDoNext,
          ctaHeading: diagnostic.content.ctaHeading,
          ctaBody: diagnostic.content.ctaBody,
          valueStack: diagnostic.content.valueStack,
          primaryCtaLabel: diagnostic.content.primaryCtaLabel,
          secondaryCtaLabel: diagnostic.content.secondaryCtaLabel,
        })
      } catch (error) {
        console.error('Failed to send diagnostic emails.', error)
      } finally {
        setSendingResults(false)
      }
    },
    [diagnostic],
  )

  const handleAnswer = (value: AnswerValue) => {
    if (selectedAnswer !== null) {
      return
    }

    setSelectedAnswer(value)

    answerTimeoutRef.current = window.setTimeout(() => {
      const nextQuestion = activeQuestion + 1
      const canBypass = hasAdminQueryParam() || adminBypass

      setAnswers((previousAnswers) => [...previousAnswers, value])
      setSelectedAnswer(null)

      if (nextQuestion < QUESTIONS.length) {
        setActiveQuestion(nextQuestion)
        return
      }

      if (canBypass) {
        setAdminBypass(true)
      }

      setStage('gate')
    }, 420)
  }

  const handleLeadChange = <K extends keyof LeadFormValues>(field: K, value: LeadFormValues[K]) => {
    setLead((previousLead) => ({
      ...previousLead,
      [field]: value,
    }))
  }

  const handleUnlockResults = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const form = gateFormRef.current

    if (!form?.reportValidity()) {
      return
    }

    const emailInput = form.querySelector<HTMLInputElement>('input[type="email"]')
    emailInput?.setCustomValidity('')

    if (isBlockedPersonalEmail(lead.workEmail)) {
      emailInput?.setCustomValidity(PERSONAL_EMAIL_BLOCK_MESSAGE)
      emailInput?.reportValidity()
      return
    }

    await unlockResults(lead, false)
  }

  return (
    <main className={styles.shell}>
      {stage === 'hero' && <HeroSection onStart={handleStart} />}

      {stage === 'quiz' && currentQuestion && (
        <QuizSection
          currentQuestion={currentQuestion}
          currentIndex={activeQuestion}
          onAnswer={handleAnswer}
          selectedAnswer={selectedAnswer}
        />
      )}

      {stage === 'gate' && diagnostic && (
        <GateSection
          diagnostic={diagnostic}
          formRef={gateFormRef}
          lead={lead}
          onLeadChange={handleLeadChange}
          onSubmit={handleUnlockResults}
          sendingResults={sendingResults}
        />
      )}

      {stage === 'results' && diagnostic && <ResultsSection diagnostic={diagnostic} />}
    </main>
  )
}

export default App
