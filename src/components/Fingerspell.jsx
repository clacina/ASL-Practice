import styled from "styled-components";
import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Tippy from "@tippyjs/react";

// Structure ─────────────────────────────────────────────────────────────
/*
        <FingerspellContainer>
            <FingerspellHeader>
                <button className="btn-back" onClick={onBack}>← Back</button>
                <div className="text-header">
                    <h1>Fingerspell</h1>
                    <FingerspellTitle style={{fontFamily: "Gallaudet", fontSize: "3rem", color: "white"}}>
                        Learn how to fingerspell
                    </FingerspellTitle>
                </div>
            </FingerspellHeader>
            <Fingerspell>
                <div>
                    <FingerCharacter>
                        {word[step]}
                    </FingerCharacter>
                    {showHint && <FingerspellHint>
                        {word[step]}
                    </FingerspellHint>}
                </div>
                <FingerspellNav>
                    <FingerspellCheck>
                        <input onChange={updateEntry} value={wordEntry}/>
                        <button onClick={checkEntry}>Check</button>
                    </FingerspellCheck>
                </FingerspellNav>
                <FingerspellTermsList>
                    <ul>
                    </ul>
                </FingerspellTermsList>
            </Fingerspell>
        </FingerspellContainer>
 */


// Styling ─────────────────────────────────────────────────────────────

const FingerspellContainer = styled.div`
    width: 100%;
`;

const FingerspellHeader = styled.div`
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

const FingerspellTitle = styled.h2`
    margin-top: -20px;
`;

const Fingerspell = styled.div`
    //border: 1px solid blue;
    display: flex;
    justify-content: space-between;
`;

const FingerspellNav = styled.nav`
    //border: 1px solid yellow;
    flex: 1;
    width: 300px;
    display: flex;
    flex-direction: column;

    button {
        width: 150px;
    }
`;

const FingerspellTermsList = styled.div`
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

const FingerspellHint = styled.p`
    width: 300px;
    border: 1px solid orange;
    height: 2rem;
`;

const ButtonNav = styled.div`
    border: 1px solid green;
`;

const FingerspellCheck = styled.div`
    border: 1px solid orange;
    width: 100%;
    margin-top: auto;
`;

function getSmallWordLength() {
    const max = 5;
    const min = 3;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getMediumWordLength() {
    const max = 7;
    const min = 4;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getLargeWordLength() {
    const max = 10;
    const min = 6;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const DisplayScene = Object.freeze(
    {
        NORMAL: "NORMAL",
        WORDS: "WORDS",
        LETTERS: "LETTERS"
    }
);

export default function FingerspellComponent({onBack}) {
    const [isActive, setIsActive] = useState(false);
    const [stepCount, setStepCount] = useState(0);
    const [step, setStep] = useState(0);
    const [word, setWord] = useState("");
    const [wordList, setWordList] = useState([]);

    // Configuration
    const [showHint, setShowHint] = useState(false);
    const [showWord, setShowWord] = useState(false);

    // For sample words - what length do we want? Small, medium or large
    const [sampleWordLength, setSampleWordLength] = useState(getSmallWordLength());
    const [sampleWordLengthSetting, setSampleWordLengthSetting] = useState(0);  // 0 == small, 1 == medium, 2 == large
    const [sceneMode, setSceneMode] = useState(DisplayScene.NORMAL);

    // Playback rate - slow, normal, fast
    const [playbackRate, setPlaybackRate] = useState(1);
    const [stepInterval, setStepInterval] = useState(1000);

    const [repeat, setRepeat] = useState(false);

    // Word list index
    const [wordIndex, setWordIndex] = useState(0);

    // Test entry
    const [wordEntry, setWordEntry] = useState("");


    function updateSampleWordLength() {
        if (sampleWordLengthSetting < 2) {
            setSampleWordLengthSetting(sampleWordLengthSetting + 1);
        } else {
            setSampleWordLengthSetting(0);
        }
    }

    function updatePlaybackSpeed() {
        let newPlaybackRate = 0;
        if (playbackRate < 2) {
            newPlaybackRate = playbackRate + 1;
        }
        setPlaybackRate(newPlaybackRate);
        switch (newPlaybackRate) {
            case 0:
                setStepInterval(2000);
                break;
            case 1:
                setStepInterval(1000);
                break;
            default:
                setStepInterval(500);
                break;
        }
    }

    function loadWords() {
        // load random words
        // https://random-words-api.kushcreates.com/
        const words_to_fetch = 20;
        const word_length = sampleWordLength;
        const word_language = "language=en";
        const starts_with = "firstletter=a";

        const randomWordsUrl = `https://random-words-api.kushcreates.com/api?words=${words_to_fetch}&${word_language}&length=${word_length}`;
        axios.get(randomWordsUrl).then((response) => {
            const wordData = [];
            response.data.forEach(element => {
                const entry = {
                    "term": element.word,
                    "code": "",
                    "type": "spell"
                };
                wordData.push(entry);
            });
            setWordList(wordData);
        });

    }

    // Data Effect Logic ─────────────────────────────────────────────────────────────

    useEffect(() => {
        let interval = null;
        if (isActive) {
            if (step < stepCount) {
                interval = setInterval(() => {
                    setStep((step) => step + 1);
                }, stepInterval);
            } else {
                if (!repeat) {
                    clearInterval(interval);
                    setIsActive(false);
                }
                setStep(0);
            }
        }

        // Cleanup the interval on unmount or when isActive/seconds change
        return () => clearInterval(interval);
    }, [isActive, repeat, step, stepCount, stepInterval]);

    useEffect(() => {
        setStepCount(word.length);
    }, [word]);

    useEffect(() => {
        loadWords();
    }, []);

    useEffect(() => {
        if (wordList.length > 0) {
            setWordIndex(0);
            setWord(" " + wordList[0].term);
        }
    }, [wordList]);

    // Term Test Logic ─────────────────────────────────────────────────────────────
    function checkEntry() {
        console.log(wordEntry);

        if (wordEntry.toLowerCase() === word.slice(1).toLowerCase()) {
            toast.success("Correct!");
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

    function nextWord() {
        if (sceneMode === DisplayScene.NORMAL) {
            const newIndex = wordIndex < wordList.length ? wordIndex + 1 : 0;
            setWordIndex(newIndex);
            setWord(" " + wordList[newIndex].term);
            setWordEntry("");
            setIsActive(true);
        }
    }

    function onWordSize() {
        // For sample words - what length do we want? Small, medium or large
        let newLengthSetting = 0;
        if (sampleWordLengthSetting < 2) {
            newLengthSetting = sampleWordLengthSetting + 1;
        }
        setSampleWordLengthSetting(newLengthSetting);
        switch(newLengthSetting) {
            case 1:
                setSampleWordLength(getMediumWordLength());
                break;
            case 2:
                setSampleWordLength(getLargeWordLength());
                break;
            default:
                setSampleWordLength(getSmallWordLength());
        }
        loadWords();
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
            case 0:
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


    return (
        <FingerspellContainer>
            <FingerspellHeader>
                <button className="btn-back" onClick={onBack}>← Back</button>
                <div className="text-header">
                    <h1>Fingerspell</h1>
                    <FingerspellTitle style={{fontFamily: "Gallaudet", fontSize: "3rem", color: "white"}}>
                        Learn how to fingerspell
                    </FingerspellTitle>
                </div>
            </FingerspellHeader>
            <Fingerspell>
                <div>
                    <FingerCharacter showHint={showHint}>
                        {word[step]}
                    </FingerCharacter>
                    {showHint && <FingerspellHint>
                        {word[step]}
                    </FingerspellHint>}
                </div>
                <FingerspellNav>
                    <ButtonNav>
                        <button onClick={() => setIsActive(!isActive)}>{isActive ? "Pause" : "Start"}</button>
                        <button onClick={() => {
                            setIsActive(false);
                        }}>Reset
                        </button>
                        <Tippy content={showHint ? "Click to hide hint" : "Click to show letter hint"}>
                            <button
                                onClick={() => setShowHint(!showHint)}>{!showHint ? "Show Hint" : "Hide Hint"}</button>
                        </Tippy>
                        <Tippy content={showWord ? "Click to show word" : "Click to hide word"}>
                            <button
                                onClick={() => setShowWord(!showWord)}>{!showWord ? "Show Word" : "Hide Word"}</button>
                        </Tippy>
                        <Tippy content={">"}>
                            <button onClick={nextWord}>Next Word
                            </button>
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
                        <Tippy content="Display Type">
                            <button>✨ Display</button>
                        </Tippy>
                        <Tippy content="Word Size">
                            <button onClick={onWordSize}>📏 Word Size</button>
                        </Tippy>
                    </ButtonNav>
                    <FingerspellCheck>
                        <div>
                            <input
                                onChange={updateEntry}
                                onKeyDown={handleKeyDown}
                                placeholder="Enter the term..."
                                value={wordEntry}/>
                            <button onClick={checkEntry}>Check</button>
                        </div>
                        {showWord && word}
                    </FingerspellCheck>

                </FingerspellNav>
                <FingerspellTermsList>
                    <ul>
                        {wordList.map((word, index) => (
                            <li key={index}>{word.term}</li>
                        ))}
                    </ul>
                </FingerspellTermsList>
            </Fingerspell>
        </FingerspellContainer>
    );
};
