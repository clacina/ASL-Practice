import {useState, useEffect} from "react";

import terms from "../data/terms.json" with {type: "json"};
import other_terms from "../data/terms2.json" with {type: "json"};
import questions from "../data/questions.json" with {type: "json"};
import verbs from "../data/verbs.json" with {type: "json"};
import axios from "axios";

const CATEGORIES = [
    {title: "Spelling", terms: terms},
    {title: "Numbers", terms: terms},
    {title: "Class Terms", terms: terms},
    {title: "Other Terms", terms: other_terms},
    {title: "Faire Terms", terms: terms},
    {title: "Questions", terms: questions},
    {title: "Verbs", terms: verbs}
];

const webResources = [
    {url: "https://www.signasl.org/", description: "Sign ASL - American Sign Language Dictionary", type: ""},
    {url: "https://www.handspeak.com/", description: "Hand Speak", type: ""},
    {url: "https://www.lifeprint.com/", description: "ASL University", type: ""},
    {url: "https://www.startasl.com/asl-dictionary/", description: "Free dictionary on Paid site with Phrases.", type: ""},
    {url: "https://asl.ms/", description: "ASL Finger Spell Comprehension Test", type: ""},
];

export function TermInput({onStart}) {
    const [error, setError] = useState("");
    const [wordlist, setWordlist] = useState([]);
    const [numberList, setNumberList] = useState([]);

    useEffect(() => {
        // load random words
        const randomWordsUrl = "https://random-word-api.herokuapp.com/word?number=45";
        axios.get(randomWordsUrl).then((response) => {
            const wordData = [];
            response.data.forEach(element => {
                const entry = {
                    "term": element,
                    "code": "",
                    "type": "spell"
                };
                wordData.push(entry);
            });
            setWordlist(wordData);
        });

        const randomNumbersUrl = "https://api.codetabs.com/v1/random/integer?min=1&max=9999&times=45";
        axios.get(randomNumbersUrl).then((response) => {
            const numberData = [];
            response.data.data.forEach(element => {
                const entry = {
                    "term": element.toString(),
                    "code": ""
                };
                numberData.push(entry);
            });
            setNumberList(numberData);
        });
    }, []);

    useEffect(() => {
        CATEGORIES.find((category) => category.title === "Numbers").terms = numberList;
        CATEGORIES.find((category) => category.title === "Spelling").terms = wordlist;
    }, [wordlist, numberList]);

    function handleStart(category) {
        const terms = category.terms;
        if (terms.length === 0) {
            setError("Please enter at least one term before starting.");
            return;
        }
        setError("");
        onStart(terms);
    }
    return (
        <div className="term-input">
            <h1 className="term-input__title">ASL Flashcards</h1>

            <div className="term-input__body">
                <div className="term-input__categories">
                    {CATEGORIES.map(category => (
                        <button key={category.title} className="btn-category" onClick={() => handleStart(category)}>
                            {category.title}
                        </button>
                    ))}
                    {error && <p className="error-message">{error}</p>}
                </div>
            </div>
        </div>
    );
}
