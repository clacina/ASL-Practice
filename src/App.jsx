import {useState} from "react";
import {CardColors} from "./data/card-colors";
import {LandingPage} from "./components/LandingPage";
import {FlashcardSession} from "./components/FlashcardSession";
import {Footer} from "./components/Footer";
import {PassphrasePage} from "./components/PassphrasePage";
import "./App.css";
import {Toaster} from "react-hot-toast";

function App() {
    const [view, setView] = useState(() => sessionStorage.getItem("asl-unlocked") ? "input" : "gate");
    const [terms, setTerms] = useState([]);
    const [cardColors, setCardColors] = useState([]);
    const [categoryTitle, setCategoryTitle] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");

    function handleStart(parsedTerms, title, description) {
        const palette = CardColors.length > 0 ? CardColors : ["#D8D4BC"];
        const colors = parsedTerms.map(() => palette[Math.floor(Math.random() * palette.length)]);
        setTerms(parsedTerms);
        setCardColors(colors);
        setCategoryTitle(title);
        setCategoryDescription(description);
        setView("session");
    }

    function handleBack() {
        setView("input");
    }

    function handleUnlock() {
        sessionStorage.setItem("asl-unlocked", "1");
        setView("input");
    }

    if (view === "gate") {
        return <PassphrasePage onUnlock={handleUnlock}/>;
    }

    return (
        <div className="flashcard-app">
            {view === "input" ? (
                <LandingPage onStart={handleStart}/>
            ) : (
                <FlashcardSession terms={terms} cardColors={cardColors} onBack={handleBack} title={categoryTitle}
                                  description={categoryDescription}/>
            )}
            <Footer/>
            <Toaster />
        </div>
    );
}

export default App;
