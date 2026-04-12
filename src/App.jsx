import { useState } from 'react'
import { Words } from './data/terms'
import { TermInput } from './components/TermInput'
import { FlashcardSession } from './components/FlashcardSession'
import './App.css'

function App() {
  const [view, setView] = useState('input')
  const [inputValue, setInputValue] = useState(Words.join(', '))
  const [terms, setTerms] = useState([])

  function handleStart(parsedTerms) {
    setTerms(parsedTerms)
    setView('session')
  }

  function handleBack() {
    setView('input')
  }

  return (
    <div className="flashcard-app">
      {view === 'input' ? (
        <TermInput
          inputValue={inputValue}
          onInputChange={setInputValue}
          onStart={handleStart}
        />
      ) : (
        <FlashcardSession terms={terms} onBack={handleBack} />
      )}
    </div>
  )
}

export default App
