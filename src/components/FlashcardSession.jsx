import {useState, useEffect, useCallback, useMemo} from "react";
import {contrastColor} from "../utils/contrastColor";
import {shuffle} from "../utils/shuffle";

export function FlashcardSession({terms, cardColors, onBack}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [localTerms, setLocalTerms] = useState(terms);
    const [localColors, setLocalColors] = useState(cardColors);
    const [showSelect, setShowSelect] = useState(false);

    const goNext = useCallback(() => {
        const newIndex = (currentIndex + 1) % localTerms.length;
        console.log("New Index: ", newIndex);
        setCurrentIndex(newIndex);
    }, [currentIndex, localTerms.length]);

    const goPrev = useCallback(() => {
        const newIndex = (currentIndex - 1 + localTerms.length) % localTerms.length;
        console.log("New Index: ", newIndex);
        setCurrentIndex(newIndex);
    }, [currentIndex, localTerms.length]);

    function handleShuffle() {
        const indices = shuffle([...localTerms.keys()]);
        setLocalTerms(indices.map(i => localTerms[i]));
        setLocalColors(indices.map(i => localColors[i]));
        setCurrentIndex(0);
    }

    function showVideo() {
        const url = `https://www.signasl.org/sign/${localTerms[currentIndex]}`;
        console.log("Grabbing: ", url);
    }

    function getPlaybackUrl() {
        console.log("Entry: ", localTerms[currentIndex]);
        const term = localTerms[currentIndex].term;
        const code = localTerms[currentIndex].code;
        if (Object.prototype.hasOwnProperty.call(localTerms[currentIndex], "type")) {
            switch (localTerms[currentIndex].type) {
                case "spell":
                    console.log("returning url: ", '/fingerspell/aslg.gif');
                    return ('/fingerspell/aslg.gif');
                default:
                    console.error("Unknown term type: ", localTerms[currentIndex].type);
            }
        }
        if(localTerms[currentIndex].code.length === 0) {
            return `https://media.signbsl.com/videos/asl/startasl/mp4/${term.toLowerCase()}.mp4`;
        }
        console.log("returning url: ", code);
        return localTerms[currentIndex].code;
    }

    useEffect(() => {
        function handleKey(e) {
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

    return (
        <div className="flashcard-session">
            <button className="btn-back" onClick={onBack}>
                ← Back
            </button>
            <div className="flashcard-session-body">
                <div className="flashcard-session-content">
                    <div className="flashcard-card" style={{backgroundColor: bg, color: fg}}>
                        <span className="flashcard-term">{localTerms[currentIndex].term}</span>
                    </div>
                    <div className="flashcard-video">
                        <iframe
                            width="560"
                            height="315"
                            title="ASL sign video"
                            src={getPlaybackUrl()}
                        ></iframe>
                    </div>
                    <p className="flashcard-position">{currentIndex + 1} / {localTerms.length}</p>
                    <div className="flashcard-nav">
                        <button className="btn-nav" onClick={goPrev}>← Prev</button>
                        <button className="btn-nav" onClick={goNext}>Next →</button>
                        <button className="btn-nav" onClick={handleShuffle}>⇄ Shuffle</button>
                        <button onClick={showVideo}>Show Video</button>
                        <button className="btn-nav" onClick={() => setShowSelect(s => !s)}>Select</button>
                    </div>
                </div>
                {showSelect && (
                    <select
                        size={20}
                        className="term-select"
                        onChange={e => setCurrentIndex(Number(e.target.value))}
                        value={currentIndex}
                    >
                        {sortedTerms.map(({term, i}) => (
                            <option key={i} value={i}>{term}</option>
                        ))}
                    </select>
                )}
            </div>
        </div>
    );
}
