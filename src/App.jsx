import { useState } from 'react'
import { CardColors } from './data/card-colors'
import { shuffle } from './utils/shuffle'
import { TermInput } from './components/TermInput'
import { FlashcardSession } from './components/FlashcardSession'
import './App.css'

function App() {
  const [view, setView] = useState('input')
  const [terms, setTerms] = useState([])
  const [cardColors, setCardColors] = useState([])

  function handleStart(parsedTerms) {
    // const shuffled = shuffle(parsedTerms)
    const shuffled = parsedTerms
    const palette = CardColors.length > 0 ? CardColors : ['#D8D4BC']
    const colors = shuffled.map(() => palette[Math.floor(Math.random() * palette.length)])
    setTerms(shuffled)
    setCardColors(colors)
    setView('session')
  }

  function handleBack() {
    setView('input')
  }

  return (
    <div className="flashcard-app">
      {view === 'input' ? (
        <TermInput
          onStart={handleStart}
        />
      ) : (
        <FlashcardSession terms={terms} cardColors={cardColors} onBack={handleBack} />
      )}
    </div>
  )
}

export default App
