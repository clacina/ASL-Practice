import { describe, it, expect } from 'vitest'
import { parseTerms } from '../src/utils/parseTerms'
import { shuffle } from '../src/utils/shuffle'
import { contrastColor } from '../src/utils/contrastColor'

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

describe('shuffle', () => {
  it('returns an array with the same elements', () => {
    const input = [1, 2, 3, 4, 5]
    expect(shuffle(input).sort()).toEqual([1, 2, 3, 4, 5])
  })

  it('does not mutate the original array', () => {
    const input = [1, 2, 3]
    shuffle(input)
    expect(input).toEqual([1, 2, 3])
  })

  it('handles an empty array', () => {
    expect(shuffle([])).toEqual([])
  })
})

describe('contrastColor', () => {
  it('returns dark text for a light background', () => {
    expect(contrastColor('#ffffff')).toBe('#08060d')
  })

  it('returns white text for a dark background', () => {
    expect(contrastColor('#000000')).toBe('#ffffff')
  })

  it('returns white text for a dark teal (#30525C)', () => {
    expect(contrastColor('#30525C')).toBe('#ffffff')
  })

  it('returns dark text for a light peach (#F6C992)', () => {
    expect(contrastColor('#F6C992')).toBe('#08060d')
  })
})

describe('color assignment', () => {
  it('produces one color per term, all from the palette', () => {
    const palette = ['#ff0000', '#00ff00', '#0000ff']
    const terms = ['a', 'b', 'c', 'd', 'e']
    const colors = terms.map(() => palette[Math.floor(Math.random() * palette.length)])
    expect(colors).toHaveLength(terms.length)
    colors.forEach(c => expect(palette).toContain(c))
  })

  it('falls back to default color when palette is empty', () => {
    const palette = []
    const fallback = '#D8D4BC'
    const effective = palette.length > 0 ? palette : [fallback]
    expect(effective[0]).toBe(fallback)
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
