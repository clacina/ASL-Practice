import {useState, useEffect} from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

import terms from "../data/terms.json" with {type: "json"};
import other_terms from "../data/terms2.json" with {type: "json"};
import questions from "../data/questions.json" with {type: "json"};
import verbs from "../data/verbs.json" with {type: "json"};
import date_time_terms from "../data/calendar-terms.json";
import color_terms from "../data/colors.json";
import faire_terms from "../data/faire.json";
import axios from "axios";
import toast from "react-hot-toast";

const DEVELOPMENT = false;

const CATEGORIES = [
    {icon: "📚", title: "ASL Level I & II Class Terms", description: "Core vocabulary from ASL Level I and II coursework.", terms: terms},
    {icon: "❓", title: "Questions", description: "Essential question words and phrases used in ASL conversation.", terms: questions},
    {icon: "⚡", title: "Verbs", description: "Common action words and verbs in American Sign Language.", terms: verbs},
    {icon: "🗂️", title: "Other Terms", description: "Additional vocabulary terms for expanding your ASL knowledge.", terms: other_terms},
    {icon: "⚔️", title: "Renaissance Faire Terms", description: "Specialized vocabulary for Renaissance Faire settings.", terms: faire_terms},
    {icon: "📆", title: "Calendar / Date & Time", description: "Months, Days, Time, etc.", terms: date_time_terms},
    {icon: "🎨", title: "Colors", description: "Various Colors", terms: color_terms},
];

if (DEVELOPMENT) {
    CATEGORIES.splice(0, 0, {
        icon: "🖐️",
        title: "Finger Spelling",
        description: "Practice spelling words letter by letter using ASL handshapes.",
        terms: terms
    });
    CATEGORIES.splice(0, 0, {
        icon: "🔢",
        title: "Numbers",
        description: "Learn to sign numbers in American Sign Language.",
        terms: terms
    });
}

const webResources = [
    {url: "https://www.signasl.org/", description: "Sign ASL - American Sign Language Dictionary", type: ""},
    {url: "https://www.handspeak.com/", description: "Hand Speak", type: ""},
    {url: "https://www.lifeprint.com/", description: "ASL University", type: ""},
    {url: "https://www.startasl.com/asl-dictionary/", description: "Free dictionary on Paid site with Phrases.", type: ""},
    {url: "https://asl.ms/", description: "ASL Finger Spell Comprehension Test", type: ""},
    {url: "https://www.signingsavvy.com/", description: "Sign Savvy", type: ""},
    {url: "https://en.wikipedia.org/wiki/American_Sign_Language", description: "Wikipedia", type: ""},
];


function useWindowDimensions() {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
}


export function TermInput({onStart}) {
    const [error, setError] = useState("");
    const [wordlist, setWordlist] = useState([]);
    const [numberList, setNumberList] = useState([]);
    const { height, width } = useWindowDimensions();

    useEffect(() => {
        if (DEVELOPMENT) {
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
        }
        const displayString = `${width} x ${height}`;
        console.log(displayString);
        toast(displayString, {
            style: {
                background: 'white',
                color: 'black'
            }
        });
    }, [height, width]);

    useEffect(() => {
        if (DEVELOPMENT) {
            CATEGORIES.find((category) => category.title === "Numbers").terms = numberList;
            CATEGORIES.find((category) => category.title === "Finger Spelling").terms = wordlist;
        }
    }, [wordlist, numberList]);

    function handleStart(category) {
        const terms = category.terms;
        if (terms.length === 0) {
            setError("Please enter at least one term before starting.");
            return;
        }
        setError("");
        onStart(terms, category.title, category.description);
    }
    return (
        <div className="term-input">
            <div className="term-input__body">
                <div className="term-input__categories">
                    {CATEGORIES.map(category => (
                        <Tippy key={category.title} content={category.description} placement="top">
                            <button className="btn-category" onClick={() => handleStart(category)}>
                                <span className="btn-category__icon" aria-hidden="true">{category.icon}</span>
                                {category.title}
                            </button>
                        </Tippy>
                    ))}
                    {error && <p className="error-message">{error}</p>}
                </div>
                <div className="term-input__resources">
                    <h3 className="term-input__resources-heading">ASL Resources</h3>
                    <ul className="term-input__resources-list">
                        {webResources.map(resource => (
                            <li key={resource.url}>
                                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                    {resource.description}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
