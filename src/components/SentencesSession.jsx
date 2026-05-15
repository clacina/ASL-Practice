import styled from "styled-components";
import {useEffect, useState} from "react";
import Tippy from "@tippyjs/react";
import ReactPlayer from "react-player";
import toast from "react-hot-toast";


// Styling ─────────────────────────────────────────────────────────────


const SentencesContainer = styled.div`
    width: 100%;
`;

const SentencesHeader = styled.div`
    display: flex;
    flex-direction: row;

    .btn-back {
        width: 100px;

        flex-shrink: 0;
        align-self: flex-start;
        background: none;
        border: none;
        padding: 0;
        color: var(--text);
        font-size: 15px;
        cursor: pointer;
        transition: color 0.2s;
        z-index: 100;

        &:hover {
            color: var(--text-h);
        }
    }

    h1 {
        //border: 1px solid pink;
        width: 100%;

        margin-top: 10px;
        justify-content: center;
        align-items: center;
    }

    .text-header {
        width: 100%;
        margin-left: -100px;
    }
`;

const SentencesTitle = styled.h2`
    margin-top: -20px;
`;

const Sentences = styled.div`
    border: 1px solid blue;
    display: flex;
    justify-content: space-between;
`;

const SentencesNav = styled.nav`
    //border: 1px solid yellow;
    flex: 1;
    width: 300px;
    display: flex;
    flex-direction: column;

    button {
        width: 150px;
    }
`;

const SentencesTermsList = styled.div`
    flex: none;
    width: 200px;
    border: 1px solid pink;
    max-height: 330px;
    overflow-y: auto;

    ul {
        list-style: none;
        text-align: left;
    }
`;

/*
    CSS calc()
    Spaces around operators: You must include a space on both sides of the subtraction (-) operator. If you write calc(100px-2rem), it will be
        treated as an invalid expression or a negative number.
    Mixed Units: calc() is the only native CSS way to do this because rem is relative (based on the root font size, usually 16px)
        and px is absolute. The browser calculates the final pixel value at runtime

 */

const FingerCharacter = styled.p`
    flex: 1;
    width: 300px;
    height: ${props => props.showHint ? `calc(200px - 2rem)` : "200px"};
    background-color: beige;
    font-family: "Gallaudet", cursive;
    font-size: 20rem;
    color: black;
    //margin-top: 40px;
    align-items: center;
    padding-top: 130px;
    border: 1px solid red;
`;

const PlayerContainer = styled.div`
    flex: 1;
    width: 300px;
    border: 1px solid white;
`;

const SentencesHint = styled.p`
    width: 300px;
    border: 1px solid orange;
    height: 2rem;
`;

const ButtonNav = styled.div`
    border: 1px solid green;
`;

const SentencesCheck = styled.div`
    border: 1px solid orange;
    width: 100%;
    margin-top: auto;
`;

export default function SentencesComponent({onBack, terms}) {
    // terms: list[term: "", codes: []]
    const [isActive, setIsActive] = useState(false);

    // number of 'words' in current phrase
    const [stepCount, setStepCount] = useState(0);

    // current 'workd' in current phrase
    const [step, setStep] = useState(0);

    // terms index
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [phrase, setPhrase] = useState({});   // current phrase

    // Configuration
    const [showHint, setShowHint] = useState(false);
    const [showWord, setShowWord] = useState(false);

    // Playback rate - slow, normal, fast
    const [playbackRate, setPlaybackRate] = useState(1.0);

    const [repeat, setRepeat] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [url, setUrl] = useState("");
    const [autoPlay, setAutoPlay] = useState(true);
    const [showPlayerControls, setShowPlayerControls] = useState(true);

    const PLAYBACK_STATE_START = 1
    const PLAYBACK_STATE_END = 2
    const PLAYBACK_STATE_PAUSE = 3

    function playingStateChanged(stateChange) {
        switch(stateChange) {
            case PLAYBACK_STATE_START:
                console.log("Playback start");
                setPlaying(true);
                break;
            case PLAYBACK_STATE_END:
                console.log("Playback end: ", repeat);
                if (step < stepCount) {
                    setStep(step+1);
                    setUrl(phrase.codes[step+1])
                } else {
                    setPlaying(false);
                }
                break;
            case PLAYBACK_STATE_PAUSE:
                console.log("Playback paused");
                setPlaying(false);
                setIsActive(false);
                break;
            default:
                console.error("Unknown Playback state change: ", stateChange);
        }
    }

    function setCurrentTerm(index) {
        setPhraseIndex(index);
        setPhrase(terms[index]);
        console.log(terms[index]);
        setStepCount(terms[index].codes.length);
    }

    function playbackError(error) {
        console.error(error);
        console.log("Playback error", error.nativeEvent.target.error);
        console.log("Source: ", error.nativeEvent.target.src)
        toast.error("Playback error");
    }

    function updatePlaybackSpeed() {
        switch (playbackRate) {
            case .5:
                setPlaybackRate(1.0);
                break;
            case 1:
                setPlaybackRate(2.0);
                break;
            default:
                setPlaybackRate(.5);
                break;
        }
    }

    // Data Effect Logic ─────────────────────────────────────────────────────────────

    // useEffect(() => {
    //     console.log("Phrase: ", phrase);
    //     if (phrase.hasOwnProperty('codes')) {
    //         setStepCount(phrase.codes.length);
    //         setPlaying(true);
    //         setUrl(phrase.codes[0]);
    //     }
    // }, [phrase]);
    //
    // useEffect(() => {
    //     if (terms.length > 0) {
    //         console.log(terms);
    //         setPhraseIndex(0);
    //         setPhrase(terms[0]);
    //     }
    // }, [terms]);


    const onToggleRepeat = () => {
        setRepeat(r => !r);
    };

    function nextWord() {
        console.log("PhraseIndex: ", phraseIndex);
        const newIndex = phraseIndex + 1 < terms.length ? phraseIndex + 1 : 0;
        setCurrentTerm(newIndex);
        // setIsActive(true);
    }

    function playbackLabel() {
        const returnValue = {
            text: "",
            tip: "",
            icon: ""
        };
        switch (playbackRate) {
            case 1:
                returnValue.tip = "Normal - 1×";
                returnValue.text = "1×";
                returnValue.icon = "🚶🏻‍♀️‍➡️️";
                break;
            case 0.5:
                returnValue.tip = "Slow - ½×";
                returnValue.text = "½×";
                returnValue.icon = "🐢️";
                break;
            default:
                returnValue.tip = "Fast - 2×";
                returnValue.text = "2×";
                returnValue.icon = "🏃‍➡️";
                break;
        }
        return returnValue;
    }

    function onSetActive() {
        if (!isActive) {  // Transition from not active to active
            setStep(0);
            setUrl(phrase.codes[0])
            setPlaying(true);
        } else {
            setPlaying(false);
        }
        setIsActive(!isActive);
    }
    
    useEffect(() => {
        console.log("Playback start: ", terms);
        if(terms.length > 0) {
            console.log(terms.length);
            setCurrentTerm(0);
        }
    }, [terms])

    // Render ─────────────────────────────────────────────────────────────

    return (
        <SentencesContainer>
            <SentencesHeader>
                <button className="btn-back" onClick={onBack}>← Back</button>
                <div className="text-header">
                    <h1>Sentences</h1>
                </div>
            </SentencesHeader>
            <Sentences>
                <PlayerContainer>
                    <ReactPlayer
                        className="flashcard-video-iframe"
                        title="ASL sign video"
                        src={url}
                        playing={playing}
                        // loop={loop}
                        autoPlay={autoPlay}
                        controls={showPlayerControls}
                        playsInline={true}
                        muted={true}
                        width="100%"
                        height="100%"
                        // playbackRate={playbackRate}
                        onPlay={() => playingStateChanged(PLAYBACK_STATE_START)}
                        onPause={() => playingStateChanged(PLAYBACK_STATE_PAUSE)}
                        onEnded={() => playingStateChanged(PLAYBACK_STATE_END)}
                        onError={playbackError}
                        config={{
                            file: {
                                attributes: {
                                    playsInline: true,
                                },
                            },
                        }}
                    />
                </PlayerContainer>
                <SentencesNav>
                    <ButtonNav>
                        <button onClick={onSetActive}>{isActive ? "Pause" : "Start"}</button>
                        <Tippy content={showHint ? "Click to hide hint" : "Click to show letter hint"}>
                            <button
                                onClick={() => setShowHint(!showHint)}>{!showHint ? "Show Hint" : "Hide Hint"}</button>
                        </Tippy>
                        <Tippy content={showWord ? "Click to show word" : "Click to hide word"}>
                            <button
                                onClick={() => setShowWord(!showWord)}>{!showWord ? "Show Word" : "Hide Word"}</button>
                        </Tippy>
                        <Tippy content={">"}>
                            <button onClick={nextWord}>Next Phrase</button>
                        </Tippy>
                        <Tippy content={playbackLabel().tip} placement="top">
                            <button
                                onClick={updatePlaybackSpeed}
                            >{playbackLabel().icon} {playbackLabel().text}</button>
                        </Tippy>
                        <Tippy content={repeat ? "Click to Stop Looping" : "Click to Loop Video"} placement="top">
                            <button
                                onClick={onToggleRepeat}
                            >🔁 {!repeat ? "Play once" : "Playback Looped"}</button>
                        </Tippy>
                    </ButtonNav>
                    <SentencesCheck>
                        {showWord && phrase.term}
                    </SentencesCheck>

                </SentencesNav>
                <SentencesTermsList>
                    <ul>
                        {terms.map((word, index) => (
                            <li key={index}>{word.term}</li>
                        ))}
                    </ul>
                </SentencesTermsList>
            </Sentences>
        </SentencesContainer>
    );
};
