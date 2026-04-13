import { ANSWER_OPTIONS, type AnswerValue, type Question } from '../../data/diagnostic'
import styles from './QuizSection.module.css'

interface QuizSectionProps {
  currentQuestion: Question
  currentIndex: number
  selectedAnswer: AnswerValue | null
  onAnswer: (value: AnswerValue) => void
}

function getProgressLabel(question: Question, currentIndex: number) {
  return `${question.category} — Question ${currentIndex + 1} of 13`
}

export default function QuizSection({ currentQuestion, currentIndex, selectedAnswer, onAnswer }: QuizSectionProps) {
  return (
    <section className={styles.screen}>
      <div className={styles.card}>
        <p className={styles.progress}>{getProgressLabel(currentQuestion, currentIndex)}</p>
        <p className={styles.transition}>Answer each question as if you were defending this deal in a Board forecast call.</p>
        <h2 className={styles.question}>{currentQuestion.prompt}</h2>

        <div className={styles.answers}>
          {ANSWER_OPTIONS.map((option) => {
            const isSelected = selectedAnswer === option.value
            const isMuted = selectedAnswer !== null && !isSelected

            const className = [
              styles.answerButton,
              styles[`answerButton${option.type[0].toUpperCase()}${option.type.slice(1)}`],
              isSelected && styles.answerButtonActive,
              isMuted && styles.answerButtonMuted,
            ]
              .filter(Boolean)
              .join(' ')

            return (
              <button className={className} key={option.label} onClick={() => onAnswer(option.value)} type="button">
                {option.label}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
