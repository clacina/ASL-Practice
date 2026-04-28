export function Footer() {
  return (
    <footer className="site-footer">
      <p className="site-footer__icon">
        <span aria-label="ASL hand sign">🤟</span> ASL Flashcards
      </p>
      <details className="site-footer__disclaimer">
        <summary>Disclaimer</summary>
        <ul>
          <li>This site is not for professional use and is only for helping study ASL.</li>
          <li>Uses public domain videos that are not owned by this creator.</li>
          <li>Does not promise that the signs provided are the most recent versions of ASL.</li>
          <li>Attempts to restrict signs to ASL vs other sign languages (BSL, etc.).</li>
        </ul>
      </details>
    </footer>
  )
}
