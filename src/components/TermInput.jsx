import { useState } from 'react'
import { parseTerms } from '../utils/parseTerms'

export function TermInput({ inputValue, onInputChange, onStart }) {
  const [error, setError] = useState('')

  function handleStart() {
    const terms = parseTerms(inputValue)
    if (terms.length === 0) {
      setError('Please enter at least one term before starting.')
      return
    }
    setError('')
    onStart(terms)
  }

  return (
    <div className="term-input">
      <h1>ASL Flashcards</h1>
      <p className="term-input__hint">
        Enter a comma-separated list of terms to study.
      </p>
      <textarea
        className="term-input__textarea"
        value={inputValue}
        onChange={e => {
          setError('')
          onInputChange(e.target.value)
        }}
        placeholder="e.g. hello, thank you, please"
        rows={8}
      />
      {error && <p className="error-message">{error}</p>}
      <button className="btn-primary" onClick={handleStart}>
        Start Session
      </button>
    </div>
  )
}
