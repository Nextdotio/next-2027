// Brand names keep their own casing inside uppercase labels: NEXT.io and
// NEXTPredict, never NEXT.IO or NEXTPREDICT. Used by the page and the deck.
const BRANDS = /(NEXT\.io|NEXTPredict)/

export function brandCase(text) {
  if (typeof text !== 'string') return text
  return text.split(BRANDS).map((part, i) => (BRANDS.test(part) ? <span key={i} className="normal-case">{part}</span> : part))
}
