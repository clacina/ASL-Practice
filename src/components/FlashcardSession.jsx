import {useState, useEffect, useCallback, useMemo, useRef} from "react";
import {contrastColor} from "../utils/contrastColor";
import {shuffle} from "../utils/shuffle";

export function FlashcardSession({terms, cardColors, onBack, title, description}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [localTerms, setLocalTerms] = useState(terms);
    const [localColors, setLocalColors] = useState(cardColors);
    const selectRef = useRef(null);

    const goNext = useCallback(() => {
        setCurrentIndex(i => (i + 1) % localTerms.length);
    }, [localTerms.length]);

    const goPrev = useCallback(() => {
        setCurrentIndex(i => (i - 1 + localTerms.length) % localTerms.length);
    }, [localTerms.length]);

    function handleShuffle() {
        const indices = shuffle([...localTerms.keys()]);
        setLocalTerms(indices.map(i => localTerms[i]));
        setLocalColors(indices.map(i => localColors[i]));
        setCurrentIndex(0);
    }

    function getPlaybackUrl() {
        const current = localTerms[currentIndex];
        if (Object.prototype.hasOwnProperty.call(current, "type")) {
            switch (current.type) {
                case "spell":
                    return '/fingerspell/aslg.gif';
                default:
                    console.error("Unknown term type: ", current.type);
            }
        }
        if (current.code.length === 0) {
            return null;
        }
        return current.code;
    }

    useEffect(() => {
        function handleKey(e) {
            if (document.activeElement === selectRef.current) return;
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
        }

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [goNext, goPrev]);

    const sortedTerms = useMemo(
        () => localTerms.map((t, i) => ({term: t.term, i})).sort((a, b) => a.term.localeCompare(b.term)),
        [localTerms]
    );

    const bg = localColors[currentIndex];
    const fg = contrastColor(bg);
    const playbackUrl = getPlaybackUrl();

    return (
        <div className="flashcard-session">
            <div className="flashcard-session-header">
                <button className="btn-back" onClick={onBack}>
                    ← Back
                </button>
                <div>
                    <h1 className="flashcard-session-title">{title}</h1>
                    <p className="flashcard-session-desc">{description}</p>
                </div>
            </div>
            <div className="flashcard-session-body">
                <div className="flashcard-session-content">
                    <div className="flashcard-card" style={{backgroundColor: bg, color: fg}}>
                        <span className="flashcard-term">{localTerms[currentIndex].term}</span>
                    </div>
                    <div className="flashcard-video">
                        {playbackUrl ? (
                            <iframe
                                className="flashcard-video-iframe"
                                title="ASL sign video"
                                src={playbackUrl}
                            ></iframe>
                        ) : (
                            <div className="flashcard-video-placeholder">
                                No video available
                            </div>
                        )}
                    </div>
                    <p className="flashcard-position">{currentIndex + 1} / {localTerms.length}</p>
                    <div className="flashcard-nav">
                        <button className="btn-nav" onClick={goPrev}>← Prev</button>
                        <button className="btn-nav" onClick={goNext}>Next →</button>
                        <button className="btn-nav" onClick={handleShuffle}>⇄ Shuffle</button>
                    </div>
                </div>
                <select
                    ref={selectRef}
                    size={20}
                    className="term-select"
                    onChange={e => setCurrentIndex(Number(e.target.value))}
                    value={currentIndex}
                >
                    {sortedTerms.map(({term, i}) => (
                        <option key={i} value={i}>{term}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
