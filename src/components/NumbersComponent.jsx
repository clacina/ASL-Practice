import {useEffect, useRef, useState} from "react";
import toast from "react-hot-toast";
import Tippy from "@tippyjs/react";
import {FlashcardPlayer} from "./FlashcardPlayer.jsx";
import {
    NumbersComponentContainer,
    NumbersComponentHeader,
    NumbersComponentBody,
    NumbersComponentNav,
    NumbersComponentTermsList,
    NumbersComponentHint,
    ButtonNav,
    NumbersComponentCheck,
} from "./NumbersComponent.styles.js";

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
        if (wordEntry === word) {
            toast.success("Correct!");
            nextWord();
            inputRef.current.focus();
        } else {
            console.log(wordEntry, word);
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

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function nextWord() {
        const randNumber = getRandomInt(34, 100000);
          // {"term": "1", "code": "https://signstock.blob.core.windows.net/signschool/videos/db_uploads/SignSchool%201-roPWtHm3Udw.mp4"},
        // build playlist
        const numberString = randNumber.toString();
        const newWordList = []
        for (let i = 0; i < numberString.length; i++) {
            const term = number_terms.find((t) => t.term === numberString[i]);
            console.log(term);
            newWordList.push(term);
        }
        setWordList(newWordList);
        const firstWord = newWordList[0]
        setPlaybackUrl(firstWord.code);
        setWord(firstWord.term);
        setWordIndex(0);
        setIsActive(true);
        setAutoPlay(true);
        setPlaying(true);
    }

    function getPlaybackUrl() {
        console.log("Get url");
        if (wordList.length > 0 && wordIndex > -1) {
            const current = wordList[wordIndex];
            console.log(current.code);
            return current.code;
        }
    }

    function onPlay() {
        console.log("onPlay: ", isActive);
        console.log("--wl: ", wordList.length);
        console.log("--curr: ", wordIndex);
        console.log("--word: ", word);
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

    useEffect(() => {
        setPlaybackUrl(getPlaybackUrl());
    }, [playbackUrl, wordIndex]);


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
            <NumbersComponentBody>
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
            </NumbersComponentBody>
        </NumbersComponentContainer>
    );
};
