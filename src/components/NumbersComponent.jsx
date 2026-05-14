import styled from "styled-components";
import {useEffect, useRef, useState} from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Tippy from "@tippyjs/react";
import {FlashcardPlayer} from "./FlashcardPlayer.jsx";

// Structure ─────────────────────────────────────────────────────────────
/*
        <NumbersComponentContainer>
            <NumbersComponentHeader>
                <button className="btn-back" onClick={onBack}>← Back</button>
                <div className="text-header">
                    <h1>NumbersComponent</h1>
                    <NumbersComponentTitle style={{fontFamily: "Gallaudet", fontSize: "3rem", color: "white"}}>
                        Learn how to fingerspell
                    </NumbersComponentTitle>
                </div>
            </NumbersComponentHeader>
            <NumbersComponent>
                <div>
                    <FingerCharacter>
                        {word[step]}
                    </FingerCharacter>
                    {showHint && <NumbersComponentHint>
                        {word[step]}
                    </NumbersComponentHint>}
                </div>
                <NumbersComponentNav>
                    <NumbersComponentCheck>
                        <input onChange={updateEntry} value={wordEntry}/>
                        <button onClick={checkEntry}>Check</button>
                    </NumbersComponentCheck>
                </NumbersComponentNav>
                <NumbersComponentTermsList>
                    <ul>
                    </ul>
                </NumbersComponentTermsList>
            </NumbersComponent>
        </NumbersComponentContainer>
 */


// Styling ─────────────────────────────────────────────────────────────

const NumbersComponentContainer = styled.div`
    width: 100%;
`;

const NumbersComponentHeader = styled.div`
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
    
    ul {
        display: flex;
        list-style: none;
        gap: 15px;
        padding: 0;
        text-align: left;
    }

    li {
        border-right: 1px solid grey;
        font-size: small;
        line-height: 15px;
    }

    li:last-child {
        border-right: none;
    }
`;

const NumbersComponentTitle = styled.h2`
    margin-top: -20px;
`;

const NumbersComponent = styled.div`
    //border: 1px solid blue;
    display: flex;
    justify-content: space-between;
    
    .flashcard-video {
        max-width: 400px;
    }
`;

const NumbersComponentNav = styled.nav`
    //border: 1px solid yellow;
    flex: 1;
    width: 300px;
    display: flex;
    flex-direction: column;

    button {
        width: 150px;
    }
`;

const NumbersComponentTermsList = styled.div`
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


const NumbersComponentHint = styled.p`
    width: 400px;
    border: 1px solid orange;
    height: 2rem;
`;

const ButtonNav = styled.div`
    border: 1px solid green;
`;

const NumbersComponentCheck = styled.div`
    border: 1px solid orange;
    width: 100%;
    margin-top: auto;
`;

import number_terms from "../data/numbers.json" with {type: "json"};

export default function NumbersSession({onBack}) {
    const [isActive, setIsActive] = useState(false);
    const [word, setWord] = useState("");

    // wordList acts as a playlist - a series of tracks to be played sequentially.
    const [wordList, setWordList] = useState([]);
    // Word list index
    const [wordIndex, setWordIndex] = useState(0);
    const [playbackUrl, setPlaybackUrl] = useState("");
    const selectRef = useRef(null);

    // Configuration
    const [showHint, setShowHint] = useState(true);
    const [showWord, setShowWord] = useState(true);

    // Test entry
    const [wordEntry, setWordEntry] = useState("");
    const inputRef = useRef();

    // Playback rate - slow, normal, fast
    const [autoPlay, setAutoPlay] = useState(false);
    const [showPlayerControls, setShowPlayerControls] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [repeat, setRepeat] = useState(false);

    function setupCountFromZero() {
        const terms = number_terms.map((term, i) => {
            return {...term, ndx: i}
        })
        console.log(terms);
        setWordList(terms);
        setWordIndex(0);
        setRepeat(false);
        setPlaybackUrl(number_terms[0].code);
        setWord(number_terms[0].term);
        setAutoPlay(true);
    }


    // Term Test Logic ─────────────────────────────────────────────────────────────
    function checkEntry() {
        if (wordEntry.toLowerCase() === word.slice(1).toLowerCase()) {
            toast.success("Correct!");
            nextWord();
            inputRef.current.focus();
        } else {
            toast.error("Wrong word! Try again.");
        }
    }

    function updateEntry(e) {
        setWordEntry(e.target.value);
    }

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            checkEntry()
        }
    };

    const onToggleRepeat = () => {
        setRepeat(r => !r);
    };

    function onSelectTerm(e) {
        console.log(e.target.value);
        const newTermIndex = Number(e.target.value);
        setPlaying(false);
        setAutoPlay(false);
        setIsActive(false);
        setWord(wordList[newTermIndex].term)
        setWordIndex(newTermIndex);
    }

    function nextWord() {
    }

    function getPlaybackUrl() {
        if (wordList.length > 0 && wordIndex > -1) {
            const current = wordList[wordIndex];
            return current.code;
        }
    }

    useEffect(() => {
        setPlaybackUrl(getPlaybackUrl());
    }, [playbackUrl, wordIndex]);

    function onPlay() {
        if (isActive) {
            setIsActive(false);
            setPlaying(false);
            setAutoPlay(false);
        } else {
            setIsActive(true);
            // setWordIndex(0);
            // setAutoPlay(true);
            setPlaying(true);
        }
    }

    function playbackLabel() {
        const returnValue = {
            text: "",
            tip: "",
            icon: ""
        };
        console.log("Playback", playbackRate);
        switch (playbackRate) {
            case 0.5:
                returnValue.tip = "Slow - ½×";
                returnValue.text = "½×";
                returnValue.icon = "🐢️";
                break;
            default:
                returnValue.tip = "Normal - 1×";
                returnValue.text = "1×";
                returnValue.icon = "🚶🏻‍♀️‍➡️️";
        }
        return returnValue;
    }

    function playbackError(error) {
        console.error(error);
        console.log("Playback error", error.nativeEvent.target.error);
        console.log("Source: ", error.nativeEvent.target.src)
        toast.error("Playback error");
    }

    const PLAYBACK_STATE_START = 1
    const PLAYBACK_STATE_END = 2
    const PLAYBACK_STATE_PAUSE = 3

    function playingStateChanged(stateChange) {
        switch(stateChange) {
            case PLAYBACK_STATE_START:
                console.log("Playback start");
                // setPlaying(true);
                break;
            case PLAYBACK_STATE_END:
                console.log("Playback end: ", repeat);

                if (wordIndex + 1 < wordList.length) {
                    setWordIndex(wordIndex + 1);
                    setWord(wordList[wordIndex+1].term);
                } else {
                    // stop playback
                    setPlaying(false);
                    setIsActive(false);
                }
                break;
            case PLAYBACK_STATE_PAUSE:
                console.log("Playback paused");
                // setPlaying(false);
                break;
            default:
                console.error("Unknown Playback state change: ", stateChange);
        }
    }

    return (
        <NumbersComponentContainer>
            <NumbersComponentHeader>
                <button className="btn-back" onClick={onBack}>← Back</button>
                <div className="text-header">
                    <h1>NumbersComponent</h1>
                        Key Tips for 1-100 ASL Numbers
                    <ul>
                        <li>1-5: Palm faces in towards the signer.</li>
                        <li>6-9: Palm faces out.</li>
                        <li>11-15: Flicking motions.</li>
                        <li>20s: Unique handshapes, generally 20-29 start with a "G" or "L" shape base depending on the number.</li>
                        <li>Multiples (22, 33, etc.): Involve a rocking motion.</li>
                        <li>67-99: Use "rocking numbers" technique</li>
                    </ul>
                </div>
            </NumbersComponentHeader>
            <NumbersComponent>
                <div>
                    <FlashcardPlayer
                        url={playbackUrl}
                        playing={playing}
                        loop={repeat}
                        autoPlay={autoPlay}
                        controls={showPlayerControls}
                        playbackRate={playbackRate}
                        onPlay={() => playingStateChanged(PLAYBACK_STATE_START)}
                        onPause={() => playingStateChanged(PLAYBACK_STATE_PAUSE)}
                        onEnded={() => playingStateChanged(PLAYBACK_STATE_END)}
                        onError={playbackError}
                    />
                    {showHint && <NumbersComponentHint>
                        {word}
                    </NumbersComponentHint>}
                </div>
                <NumbersComponentNav>
                    <ButtonNav>
                        <button onClick={onPlay}>{isActive ? "Pause" : "Start"}</button>
                        <Tippy content={showHint ? "Click to hide hint" : "Click to show number hint"}>
                            <button
                                onClick={() => setShowHint(!showHint)}>{!showHint ? "Show Hint" : "Hide Hint"}</button>
                        </Tippy>
                        <Tippy content={showWord ? "Click to show number" : "Click to hide Number"}>
                            <button
                                onClick={() => setShowWord(!showWord)}>{!showWord ? "Show Word" : "Hide Word"}</button>
                        </Tippy>
                        <Tippy content={"Next"}>
                            <button onClick={nextWord}>Next Number</button>
                        </Tippy>
                        <Tippy content={playbackLabel().tip} placement="top">
                            <button
                                onClick={() => setPlaybackRate(r => r === 1 ? 0.5 : 1)}
                            >{playbackLabel().icon} {playbackLabel().text}</button>
                        </Tippy>
                        <Tippy content={repeat ? "Click to Stop Looping" : "Click to Loop Video"} placement="top">
                            <button
                                onClick={onToggleRepeat}
                            >🔁 {!repeat ? "Play once" : "Playback Looped"}</button>
                        </Tippy>
                        <Tippy content="Display Type">
                            <button>✨ Display</button>
                        </Tippy>
                        <Tippy content="Count from 1">
                            <button onClick={setupCountFromZero}>🔢 Count from 1</button>
                        </Tippy>
                    </ButtonNav>
                    <NumbersComponentCheck>
                        <div>
                            <input
                                ref={inputRef}
                                onChange={updateEntry}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter the term..."
                                value={wordEntry}/>
                            <button onClick={checkEntry}>Check</button>
                        </div>
                        {showWord && word}
                    </NumbersComponentCheck>

                </NumbersComponentNav>
                <NumbersComponentTermsList>
                    <select
                        ref={selectRef}
                        size={10}
                        className="term-select"
                        onChange={onSelectTerm}
                        // value={word}
                        >
                        {wordList.map((w, i) => (
                            <option key={i} value={i} >
                                {w.term}
                            </option>
                        ))}
                    </select>
                </NumbersComponentTermsList>
            </NumbersComponent>
        </NumbersComponentContainer>
    );
};
