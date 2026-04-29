import { useState } from 'react'
import { AppBanner } from './AppBanner'
import { Footer } from './Footer'

export function PassphrasePage({ onUnlock }) {
    const [value, setValue] = useState('')
    const [error, setError] = useState('')

    function handleSubmit(e) {
        e.preventDefault()
        if (!value.trim()) {
            setError('Please enter the passphrase.')
            return
        }
        if (value === import.meta.env.VITE_PASSPHRASE) {
            setError('')
            onUnlock()
        } else {
            setError('Incorrect passphrase.')
            setValue('')
        }
    }

    return (
        <div className="passphrase-page">
            <div className="passphrase-page__body">
                <AppBanner />
                <form className="passphrase-page__form" onSubmit={handleSubmit}>
                    <label className="passphrase-page__label" htmlFor="passphrase-input">
                        Enter passphrase to continue
                    </label>
                    <input
                        id="passphrase-input"
                        type="password"
                        className="passphrase-page__input"
                        value={value}
                        onChange={e => { setValue(e.target.value); setError('') }}
                        autoComplete="off"
                        autoFocus
                    />
                    {error && <p className="passphrase-page__error">{error}</p>}
                    <button type="submit" className="btn-primary passphrase-page__submit">
                        Enter
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    )
}
