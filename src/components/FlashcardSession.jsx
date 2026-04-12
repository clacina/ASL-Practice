import { useState, useEffect, useCallback } from 'react'

export function FlashcardSession({ terms, onBack }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goNext = useCallback(() => {
    setCurrentIndex(i => (i + 1) % terms.length)
  }, [terms.length])

  const goPrev = useCallback(() => {
    setCurrentIndex(i => (i - 1 + terms.length) % terms.length)
  }, [terms.length])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev])

  return (
    <div className="flashcard-session">
      <button className="btn-back" onClick={onBack}>
        ← Back
      </button>
      <div className="flashcard-card">
        <span className="flashcard-term">{terms[currentIndex]}</span>
      </div>
      <p className="flashcard-position">{currentIndex + 1} / {terms.length}</p>
      <div className="flashcard-nav">
        <button className="btn-nav" onClick={goPrev}>← Prev</button>
        <button className="btn-nav" onClick={goNext}>Next →</button>
      </div>
    </div>
  )
}
