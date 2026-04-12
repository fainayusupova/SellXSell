import { ANSWER_OPTIONS, type AnswerValue, type Question } from '../../data/diagnostic'
import styles from './QuizSection.module.css'

interface QuizSectionProps {
  currentQuestion: Question
  selectedAnswer: AnswerValue | null
  onAnswer: (value: AnswerValue) => void
}

export default function QuizSection({ currentQuestion, selectedAnswer, onAnswer }: QuizSectionProps) {
  return (
    <section className={styles.screen}>
      <article className={styles.card}>
        <h2 className={styles.prompt}>{currentQuestion.prompt}</h2>

        <div aria-label="Diagnostic answers" className={styles.answerGrid} role="group">
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
      </article>
    </section>
  )
}
