import {useState, useEffect, useCallback} from "react";
import {contrastColor} from "../utils/contrastColor";

export function FlashcardSession({terms, cardColors, onBack}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goNext = useCallback(() => {
        const newIndex = (currentIndex + 1) % terms.length;
        console.log("New Index: ", newIndex);
        setCurrentIndex(newIndex);
    }, [currentIndex, terms]);

    const goPrev = useCallback(() => {
        const newIndex = (currentIndex - 1 + terms.length) % terms.length;
        // setCurrentIndex(i => (i - 1 + terms.length) % terms.length);
        console.log("New Index: ", newIndex);
        setCurrentIndex(newIndex);
    }, [currentIndex, terms.length]);

    function showVideo() {
        const url = `https://www.signasl.org/sign/${terms[currentIndex]}`;
        console.log("Grabbing: ", url);
    }

    function getPlaybackUrl() {
        console.log("Entry: ", terms[currentIndex]);
        const term = terms[currentIndex].term;
        const code = terms[currentIndex].code;
        if (Object.prototype.hasOwnProperty.call(terms[currentIndex], "type")) {
            switch (terms[currentIndex].type) {
                case "spell":
                    console.log("returning url: ", '/fingerspell/aslg.gif');
                    return ('/fingerspell/aslg.gif');
                default:
                    console.error("Unknown term type: ", terms[currentIndex].type);
            }
        }
        if(terms[currentIndex].code.length === 0) {
            return `https://media.signbsl.com/videos/asl/startasl/mp4/${term.toLowerCase()}.mp4`;
        }
        console.log("returning url: ", code);
        return terms[currentIndex].code;
    }

    useEffect(() => {
        function handleKey(e) {
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
        }

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [goNext, goPrev]);


    const bg = cardColors[currentIndex];
    const fg = contrastColor(bg);

    return (
        <div className="flashcard-session">
            <button className="btn-back" onClick={onBack}>
                ← Back
            </button>
            <div className="flashcard-card" style={{backgroundColor: bg, color: fg}}>
                <span className="flashcard-term">{terms[currentIndex].term}</span>
            </div>
            <div className="flashcard-video">
                <img
                    // width="560"
                    // height="315"
                    alt="ASL Letter"
                    src={getPlaybackUrl()}
                ></img>
            </div>
            <p className="flashcard-position">{currentIndex + 1} / {terms.length}</p>
            <div className="flashcard-nav">
                <button className="btn-nav" onClick={goPrev}>← Prev</button>
                <button className="btn-nav" onClick={goNext}>Next →</button>
                <button onClick={showVideo}>Show Video</button>
            </div>
        </div>
    );
}
