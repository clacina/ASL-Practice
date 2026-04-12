export function parseTerms(input) {
  return input.split(',').map(s => s.trim()).filter(Boolean);
}
