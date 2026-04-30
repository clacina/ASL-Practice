import {useState, useEffect, useCallback, useMemo, useRef} from "react";
import {contrastColor} from "../utils/contrastColor";
import {shuffle} from "../utils/shuffle";
import ReactPlayer from 'react-player'
import toast from "react-hot-toast";

export function FlashcardSession({terms, cardColors, onBack, title, description}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [localTerms, setLocalTerms] = useState(terms);
    const [localColors, setLocalColors] = useState(cardColors);
    const [termDrawerOpen, setTermDrawerOpen] = useState(false);
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
            const base_url = "https://media.signbsl.com/videos/asl/startasl/mp4/";
            const term_url = (base_url + current.term + ".mp4").toLowerCase()
            console.log("Looking for term url: ", term_url);
            return term_url;
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
        () => localTerms.map((t, i) => ({term: t.term, i, fix: t.fix, code: t.code})).sort((a, b) => a.term.localeCompare(b.term)),
        [localTerms]
    );

    function playbackError(error) {
        console.error(error);
        console.log("Playback error", error.nativeEvent.target.error);
        console.log("Source: ", error.nativeEvent.target.src)
        toast.error("Playback error");
    }

    const bg = localColors[currentIndex];
    const fg = contrastColor(bg);
    const playbackUrl = getPlaybackUrl();

    return (
        <div className="flashcard-session">
            <button className="btn-back" onClick={onBack}>← Back</button>
            <div className="flashcard-session-body">
                <div className="flashcard-session-content">
                    <div className="flashcard-session-header">
                        <h1 className="flashcard-session-title">{title}</h1>
                        <p className="flashcard-session-desc">{description}</p>
                    </div>
                    <div className="flashcard-card" style={{backgroundColor: bg, color: fg}}>
                        <span className="flashcard-term">{localTerms[currentIndex].term}</span>
                    </div>
                    <div className="flashcard-video">
                        {playbackUrl ? (
                            <ReactPlayer
                                className="flashcard-video-iframe"
                                title="ASL sign video"
                                src={playbackUrl}
                                autoPlay={true}
                                controls={true}
                                muted={true}
                                width="100%"
                                height="100%"
                                onError={playbackError}
                            ></ReactPlayer>
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
                        <button className="btn-nav btn-nav--terms" onClick={() => setTermDrawerOpen(true)}>📋 Terms</button>
                    </div>
                </div>
                <div className={`term-drawer${termDrawerOpen ? ' term-drawer--open' : ''}`}>
                    <div className="term-drawer__backdrop" onClick={() => setTermDrawerOpen(false)} />
                    <div className="term-drawer__panel">
                        <div className="term-drawer__header">
                            <span>Select a Term</span>
                            <button className="term-drawer__close" onClick={() => setTermDrawerOpen(false)}>✕</button>
                        </div>
                        <select
                            ref={selectRef}
                            size={20}
                            className="term-select"
                            onChange={e => { setCurrentIndex(Number(e.target.value)); setTermDrawerOpen(false); }}
                            value={currentIndex}
                        >
                            {sortedTerms.map(({term, i, fix}) => (
                                <option key={i} value={i} className={fix ? 'term-option--needs-fix' : undefined}>
                                    {fix ? `[fix] ${term}` : term}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
