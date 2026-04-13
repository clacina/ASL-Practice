import {useState, useEffect} from "react";

import terms from "../data/terms.json" with {type: "json"};
import other_terms from "../data/terms2.json" with {type: "json"};
import axios from "axios";


const CAROUSEL_ITEMS = [
    {term: "grandfather", url: "https://media.signasl.com/videos/asl/startasl/img/grandfather.jpg"},
    {term: "father", url: "https://media.signbsl.com/videos/asl/startasl/mp4/brother.jpg"},
    {term: "mother", url: "https://media.signasl.com/videos/asl/startasl/img/mother.jpg"},
    {term: "friend", url: "https://media.signasl.com/videos/asl/startasl/img/friend.jpg"},
    {term: "family", url: "https://media.signasl.com/videos/asl/startasl/img/family.jpg"},
];

const CATEGORIES = [
    {title: "Spelling", terms: terms},
    {title: "Numbers", terms: terms},
    {title: "Class Terms", terms: terms},
    {title: "Other Terms", terms: other_terms},
    {title: "Faire Terms", terms: terms}
];

export function TermInput({onStart}) {
    const [error, setError] = useState("");
    const [carouselIndex, setCarouselIndex] = useState(0);
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

        const id = setInterval(() => {
            setCarouselIndex(i => (i + 1) % CAROUSEL_ITEMS.length);
        }, 3000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        console.log(wordlist);
        console.log(numberList);
        CATEGORIES.find((category) => category.title === "Numbers").terms = numberList;
        CATEGORIES.find((category) => category.title === "Spelling").terms = wordlist;
    }, [wordlist, numberList]);

    function handleStart(category) {
        // const terms = parseTerms(inputValue);
        console.log(category);
        const terms = category.terms;
        if (terms.length === 0) {
            setError("Please enter at least one term before starting.");
            return;
        }
        setError("");
        onStart(terms);
    }

    function prevSlide() {
        setCarouselIndex(i => (i - 1 + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length);
    }

    function nextSlide() {
        setCarouselIndex(i => (i + 1) % CAROUSEL_ITEMS.length);
    }

    const {url, term} = CAROUSEL_ITEMS[carouselIndex];

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

                <div className="term-input__carousel">
                    <div className="carousel-stage">
                        <button className="carousel-arrow carousel-arrow--prev" onClick={prevSlide}
                                aria-label="Previous">‹
                        </button>
                        <img
                            key={url}
                            src={url}
                            alt={`ASL sign for ${term}`}
                            className="carousel-img"
                        />
                        <button className="carousel-arrow carousel-arrow--next" onClick={nextSlide}
                                aria-label="Next">›
                        </button>
                    </div>
                    <div className="carousel-dots">
                        {CAROUSEL_ITEMS.map((_, i) => (
                            <button
                                key={i}
                                className={`carousel-dot${i === carouselIndex ? " carousel-dot--active" : ""}`}
                                onClick={() => setCarouselIndex(i)}
                                aria-label={`Slide ${i + 1}`}
                            />
                        ))}
                    </div>
                    <p className="carousel-caption">{term}</p>
                </div>
            </div>
        </div>
    );
}
