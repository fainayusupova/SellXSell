import { ANSWER_OPTIONS, QUESTIONS, type AnswerValue, type Question } from '../../data/diagnostic'
import styles from './QuizSection.module.css'

interface QuizSectionProps {
  currentQuestion: Question
  currentIndex: number
  selectedAnswer: AnswerValue | null
  onAnswer: (value: AnswerValue) => void
}

function getProgressLabel(question: Question, currentIndex: number) {
  return `${question.category} \u2014 Question ${currentIndex + 1} of ${QUESTIONS.length}`
}

function getProgressPercent(currentIndex: number, selectedAnswer: AnswerValue | null) {
  const completedQuestions = currentIndex + (selectedAnswer !== null ? 1 : 0)
  return (completedQuestions / QUESTIONS.length) * 100
}

export default function QuizSection({
  currentQuestion,
  currentIndex,
  selectedAnswer,
  onAnswer,
}: QuizSectionProps) {
  const progressPercent = getProgressPercent(currentIndex, selectedAnswer)

  return (
    <section className={styles.screen}>
      <div className={styles.card}>
        <div className={styles.progressWrap}>
          <p className={styles.progressLabel}>{getProgressLabel(currentQuestion, currentIndex)}</p>
          <div className={styles.progressTrack} aria-hidden="true">
            <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <p className={styles.transition}>Answer each question as if you were defending this deal in a Board forecast call.</p>

        <h2 className={styles.question}>{currentQuestion.prompt}</h2>

        <div className={styles.answers}>
          {ANSWER_OPTIONS.map((option) => {
            const variantKey = `${option.type[0].toUpperCase()}${option.type.slice(1)}`
            const isSelected = selectedAnswer === option.value
            const isMuted = selectedAnswer !== null && !isSelected

            const className = [
              styles.answerButton,
              styles[`answerButton${variantKey}`],
              isSelected && styles[`answerButton${variantKey}Active`],
              isMuted && styles.answerButtonMuted,
            ]
              .filter(Boolean)
              .join(' ')

            return (
              <button
                key={option.value}
                className={className}
                onClick={() => onAnswer(option.value)}
                type="button"
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
