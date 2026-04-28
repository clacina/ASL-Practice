import {TermInput} from "./TermInput";

export function LandingPage({onStart}) {
    return (
        <div className="landing">
            <header className="landing-hero">
                <h1 className="landing-hero__title">ASL Flashcards</h1>
                <p className="landing-hero__desc">
                    Practice American Sign Language vocabulary with interactive flashcards
                    and embedded video demonstrations.<br/> Choose a category below to get started.
                </p>
            </header>
            <TermInput onStart={onStart} />
        </div>
    );
}
