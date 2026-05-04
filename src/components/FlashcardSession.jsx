import {useState, useEffect, useCallback, useMemo, useRef} from "react";
import {contrastColor} from "../utils/contrastColor";
import {shuffle} from "../utils/shuffle";
import toast from "react-hot-toast";
import {FlashcardNav} from "./FlashcardNav";
import {FlashcardPlayer} from "./FlashcardPlayer";
import {useLayoutMode} from "../hooks/useLayoutMode";
import {useSwipe} from "../hooks/useSwipe";
import {PhonePortraitLayout} from "./layouts/PhonePortraitLayout";
import {PhoneLandscapeLayout} from "./layouts/PhoneLandscapeLayout";
import {TabletPortraitLayout} from "./layouts/TabletPortraitLayout";
import {TabletLandscapeLayout} from "./layouts/TabletLandscapeLayout";

export function FlashcardSession({terms, cardColors, onBack, title, description}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [localTerms, setLocalTerms] = useState(terms);
    const [localColors, setLocalColors] = useState(cardColors);
    const [termDrawerOpen, setTermDrawerOpen] = useState(false);
    const [autoPlay, setAutoPlay] = useState(false);
    const [showPlayerControls, setShowPlayerControls] = useState(false);
    const [playing, setPlaying] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [repeat, setRepeat] = useState(false);
    const selectRef = useRef(null);

    const layoutMode = useLayoutMode();

    const goNext = useCallback(() => {
        setPlaying(false);
        setCurrentIndex(i => (i + 1) % localTerms.length);
    }, [localTerms.length]);

    const goPrev = useCallback(() => {
        setPlaying(false);
        setCurrentIndex(i => (i - 1 + localTerms.length) % localTerms.length);
    }, [localTerms.length]);

    const swipeHandlers = useSwipe({onSwipeLeft: goNext, onSwipeRight: goPrev});

    function handleShuffle() {
        setPlaying(false);
        const indices = shuffle([...localTerms.keys()]);
        setLocalTerms(indices.map(i => localTerms[i]));
        setLocalColors(indices.map(i => localColors[i]));
        setCurrentIndex(0);
    }

    function getPlaybackUrl() {
        const current = localTerms[currentIndex];
        if (Object.prototype.hasOwnProperty.call(current, "type")) {
            switch (current.type) {
                case "spell":
                    return '/fingerspell/aslg.gif';
                default:
                    console.error("Unknown term type: ", current.type);
            }
        }
        if (current.code.length === 0) {
            const base_url = "https://media.signbsl.com/videos/asl/startasl/mp4/";
            const term_url = (base_url + current.term + ".mp4").toLowerCase()
            console.log("Looking for term url: ", term_url);
            return term_url;
        }
        return current.code;
    }

    useEffect(() => {
        function handleKey(e) {
            if (document.activeElement === selectRef.current) return;
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
        }

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [goNext, goPrev]);

    const sortedTerms = useMemo(
        () => localTerms.map((t, i) => ({term: t.term, i, fix: t.fix, code: t.code})).sort((a, b) => a.term.localeCompare(b.term)),
        [localTerms]
    );

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
                setPlaying(true);
                break;
            case PLAYBACK_STATE_END:
                console.log("Playback end: ", repeat);
                setPlaying(false);
                break;
            case PLAYBACK_STATE_PAUSE:
                console.log("Playback paused");
                setPlaying(false);
                break;
            default:
                console.error("Unknown Playback state change: ", stateChange);
        }
    }

    function onSelectTerm(e) {
        setPlaying(false);
        setCurrentIndex(Number(e.target.value));
        setTermDrawerOpen(false);
    }

    const bg = localColors[currentIndex];
    const fg = contrastColor(bg);
    const playbackUrl = getPlaybackUrl();

    const isPhonePortrait = layoutMode === 'phone-portrait';
    const isMobileLayout = layoutMode === 'phone-portrait' || layoutMode === 'phone-landscape'
        || layoutMode === 'tablet-portrait' || layoutMode === 'tablet-landscape';

    console.log("isPhonePortrait: ", isPhonePortrait);
    console.log("isMobileLayout: ", isMobileLayout);
    if (isMobileLayout) {
        console.log("Mobile layout mode");
        const videoEl = (
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
        );

        const navEl = (
            <FlashcardNav
                onPrev={goPrev}
                onNext={goNext}
                onShuffle={handleShuffle}
                onOpenTerms={isPhonePortrait ? () => setTermDrawerOpen(true) : undefined}
                autoPlay={autoPlay}
                onToggleAutoPlay={() => setAutoPlay(p => !p)}
                autoPlayActiveLabel="🔁 Auto"
                autoPlayInactiveLabel="⏸ Wait"
                showPlayerControls={showPlayerControls}
                onTogglePlayerControls={() => setShowPlayerControls(p => !p)}
                playing={playing}
                onTogglePlaying={() => setPlaying(p => !p)}
                playbackRate={playbackRate}
                onTogglePlaybackRate={() => setPlaybackRate(r => r === 1 ? 0.5 : 1)}
                repeat={repeat}
                onToggleRepeat={() => setRepeat(r => !r)}
            />
        );

        const termSelectEl = (
            <select
                ref={selectRef}
                size={20}
                className="term-select"
                onChange={onSelectTerm}
                value={currentIndex}
            >
                {sortedTerms.map(({term, i, fix}) => (
                    <option key={i} value={i} className={fix ? 'term-option--needs-fix' : undefined}>
                        {fix ? `[fix] ${term}` : term}
                    </option>
                ))}
            </select>
        );

        const termListEl = isPhonePortrait ? (
            <div className={`term-drawer${termDrawerOpen ? ' term-drawer--open' : ''}`}>
                <div className="term-drawer__backdrop" onClick={() => setTermDrawerOpen(false)} />
                <div className="term-drawer__panel">
                    <div className="term-drawer__header">
                        <span>Select a Term</span>
                        <button className="term-drawer__close" onClick={() => setTermDrawerOpen(false)}>✕</button>
                    </div>
                    {termSelectEl}
                </div>
            </div>
        ) : termSelectEl;

        const positionLabelEl = (
            <p className="flashcard-position">{currentIndex + 1} / {localTerms.length}</p>
        );

        const sharedSlots = {
            video: videoEl,
            nav: navEl,
            termList: termListEl,
            positionLabel: positionLabelEl,
            termText: localTerms[currentIndex].term,
            termBg: bg,
            termFg: fg,
            onBack,
            swipeHandlers,
            title,
            description,
        };

        switch (layoutMode) {
            case 'phone-portrait':   return <PhonePortraitLayout {...sharedSlots} />;
            case 'phone-landscape':  return <PhoneLandscapeLayout {...sharedSlots} />;
            case 'tablet-portrait':  return <TabletPortraitLayout {...sharedSlots} />;
            case 'tablet-landscape': return <TabletLandscapeLayout {...sharedSlots} />;
            default: break;
        }
    }

    console.log("Non-mobile display");
    return (
        <div className="flashcard-session">
            <button className="btn-back" onClick={onBack}>← Back</button>
            <div className="flashcard-session-body">
                <div className="flashcard-session-content">
                    <div className="flashcard-session-header">
                        <h1 className="flashcard-session-title">{title}</h1>
                        <p className="flashcard-session-desc">{description}</p>
                    </div>
                    <div className="flashcard-card" style={{backgroundColor: bg, color: fg}}>
                        <span className="flashcard-term">{localTerms[currentIndex].term}</span>
                    </div>
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
                    <p className="flashcard-position">{currentIndex + 1} / {localTerms.length}</p>
                    <FlashcardNav
                        onPrev={goPrev}
                        onNext={goNext}
                        onShuffle={handleShuffle}
                        onOpenTerms={() => setTermDrawerOpen(true)}
                        autoPlay={autoPlay}
                        onToggleAutoPlay={() => setAutoPlay(p => !p)}
                        autoPlayActiveLabel="🔁 Auto"
                        autoPlayInactiveLabel="⏸ Wait"
                        showPlayerControls={showPlayerControls}
                        onTogglePlayerControls={() => setShowPlayerControls(p => !p)}
                        playing={playing}
                        onTogglePlaying={() => setPlaying(p => !p)}
                        playbackRate={playbackRate}
                        onTogglePlaybackRate={() => setPlaybackRate(r => r === 1 ? 0.5 : 1)}
                        repeat={repeat}
                        onToggleRepeat={() => setRepeat(r => !r)}
                    />
                </div>
                <div className={`term-drawer${termDrawerOpen ? ' term-drawer--open' : ''}`}>
                    <div className="term-drawer__backdrop" onClick={() => setTermDrawerOpen(false)} />
                    <div className="term-drawer__panel">
                        <div className="term-drawer__header">
                            <span>Select a Term</span>
                            <button className="term-drawer__close" onClick={() => setTermDrawerOpen(false)}>✕</button>
                        </div>
                        <select
                            ref={selectRef}
                            size={20}
                            className="term-select"
                            onChange={onSelectTerm}
                            value={currentIndex}
                        >
                            {sortedTerms.map(({term, i, fix}) => (
                                <option key={i} value={i} className={fix ? 'term-option--needs-fix' : undefined}>
                                    {fix ? `[fix] ${term}` : term}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
