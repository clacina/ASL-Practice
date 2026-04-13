const DARK = '#08060d'
const LIGHT = '#ffffff'

function toLinear(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

export function contrastColor(hex) {
  const clean = hex.replace('#', '')
  const r = toLinear(parseInt(clean.slice(0, 2), 16) / 255)
  const g = toLinear(parseInt(clean.slice(2, 4), 16) / 255)
  const b = toLinear(parseInt(clean.slice(4, 6), 16) / 255)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance > 0.179 ? DARK : LIGHT
}
