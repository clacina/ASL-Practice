import { describe, it, expect } from 'vitest'
import { parseTerms } from '../src/utils/parseTerms'

describe('parseTerms', () => {
  it('splits a standard comma-separated list', () => {
    expect(parseTerms('apple, banana, cherry')).toEqual(['apple', 'banana', 'cherry'])
  })

  it('filters out blank entries between commas', () => {
    expect(parseTerms('apple, , cherry')).toEqual(['apple', 'cherry'])
  })

  it('returns an empty array when all entries are whitespace', () => {
    expect(parseTerms('  ,  ,  ')).toEqual([])
  })

  it('trims leading and trailing whitespace from each term', () => {
    expect(parseTerms('  hello  ')).toEqual(['hello'])
  })
})

describe('navigation wrap-around logic', () => {
  const next = (index, total) => (index + 1) % total
  const prev = (index, total) => (index - 1 + total) % total

  it('wraps from the last card to the first on next', () => {
    expect(next(4, 5)).toBe(0)
  })

  it('wraps from the first card to the last on prev', () => {
    expect(prev(0, 5)).toBe(4)
  })

  it('shows the correct 1-based position label', () => {
    const currentIndex = 2
    const total = 5
    expect(`${currentIndex + 1} / ${total}`).toBe('3 / 5')
  })
})
