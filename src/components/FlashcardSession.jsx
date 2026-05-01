import {useState, useEffect, useCallback, useMemo, useRef} from "react";
import {contrastColor} from "../utils/contrastColor";
import {shuffle} from "../utils/shuffle";
import ReactPlayer from 'react-player'
import toast from "react-hot-toast";
import Tippy from "@tippyjs/react";

export function FlashcardSession({terms, cardColors, onBack, title, description}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [localTerms, setLocalTerms] = useState(terms);
    const [localColors, setLocalColors] = useState(cardColors);
    const [termDrawerOpen, setTermDrawerOpen] = useState(false);
    const [isMobileHorizontal, setIsMobileHorizontal] = useState(false);
    const [autoPlay, setAutoPlay] = useState(false);
    const [showPlayerControls, setShowPlayerControls] = useState(true);
    const [playing, setPlaying] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const selectRef = useRef(null);

    useEffect(() => {
        function check() {
            setIsMobileHorizontal(
                window.innerWidth < 1424 && window.matchMedia('(orientation: landscape)').matches
            );
        }
        check();
        window.addEventListener('resize', check);
        window.addEventListener('orientationchange', check);
        return () => {
            window.removeEventListener('resize', check);
            window.removeEventListener('orientationchange', check);
        };
    }, []);

    const goNext = useCallback(() => {
        setPlaying(false);
        setCurrentIndex(i => (i + 1) % localTerms.length);
    }, [localTerms.length]);

    const goPrev = useCallback(() => {
        setPlaying(false);
        setCurrentIndex(i => (i - 1 + localTerms.length) % localTerms.length);
    }, [localTerms.length]);

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

    const bg = localColors[currentIndex];
    const fg = contrastColor(bg);
    const playbackUrl = getPlaybackUrl();

    if (isMobileHorizontal) {
        return (
            <div className="flashcard-session">
                <div className="fcs-landscape">
                    <div className="fcs-landscape__controls">
                        <button className="btn-back" onClick={onBack}>← Back</button>
                        <div className="flashcard-card" style={{backgroundColor: bg, color: fg}}>
                            <span className="flashcard-term">{localTerms[currentIndex].term}</span>
                        </div>
                        <p className="flashcard-position">{currentIndex + 1} / {localTerms.length}</p>
                        <div className="flashcard-nav fcs-landscape__nav">
                            <button className="btn-nav" onClick={goPrev}>← Prev</button>
                            <button className="btn-nav" onClick={goNext}>Next →</button>
                            <button className="btn-nav" onClick={handleShuffle}>⇄ Shuffle</button>
                            <Tippy key="autoplay" content={autoPlay ? 'Cancel Auto-Play' : 'Enable Auto-Play'} placement="top">
                                <button
                                    className={`btn-nav${autoPlay ? ' btn-nav--active' : ''}`}
                                    onClick={() => setAutoPlay(p => !p)}
                                >{autoPlay ? '⏸ Auto' : '▶ Auto'}</button>
                            </Tippy>
                            <Tippy key="playercontrols" content={showPlayerControls ? 'Hide Player Controls' : 'Show Player Controls'} placement="top">
                                <button
                                    className={`btn-nav${showPlayerControls ? ' btn-nav--active' : ''}`}
                                    onClick={() => setShowPlayerControls(p => !p)}
                                >🎛️ Controls</button>
                            </Tippy>
                            <Tippy key="playpause" content={playing ? 'Pause' : 'Play'} placement="top">
                                <button
                                    className={`btn-nav${playing ? ' btn-nav--active' : ''}`}
                                    onClick={() => setPlaying(p => !p)}
                                >{playing ? '⏸' : '▶'}</button>
                            </Tippy>
                            <Tippy key="playbackrate" content={playbackRate === 1 ? 'Slow to ½×' : 'Reset to 1×'} placement="top">
                                <button
                                    className={`btn-nav${playbackRate !== 1 ? ' btn-nav--active' : ''}`}
                                    onClick={() => setPlaybackRate(r => r === 1 ? 0.5 : 1)}
                                >🐢 {playbackRate === 1 ? '1×' : '½×'}</button>
                            </Tippy>
                        </div>
                    </div>
                    <div className="fcs-landscape__video">
                        <div className="flashcard-video">
                            {playbackUrl ? (
                                <ReactPlayer
                                    className="flashcard-video-iframe"
                                    title="ASL sign video"
                                    src={playbackUrl}
                                    playing={playing}
                                    autoPlay={autoPlay}
                                    controls={showPlayerControls}
                                    playsinline={true}
                                    muted={true}
                                    // width="100%"
                                    // height="100%"
                                    playbackRate={playbackRate}
                                    onPlay={() => setPlaying(true)}
                                    onPause={() => setPlaying(false)}
                                    onEnded={() => setPlaying(false)}
                                    onError={playbackError}
                                    config={{
                                        file: {
                                            attributes: {
                                                playsinline: true
                                            }
                                        }
                                    }}
                                />
                            ) : (
                                <div className="flashcard-video-placeholder">
                                    No video available
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="fcs-landscape__termlist">
                        <select
                            ref={selectRef}
                            size={20}
                            className="term-select"
                            onChange={e => { setPlaying(false); setCurrentIndex(Number(e.target.value)); }}
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
        );
    }

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
                    <div className="flashcard-video">
                        {playbackUrl ? (
                            <ReactPlayer
                                className="flashcard-video-iframe"
                                title="ASL sign video"
                                src={playbackUrl}
                                playing={playing}
                                playbackRate={playbackRate}
                                playsinline={true}
                                autoPlay={autoPlay}
                                controls={showPlayerControls}
                                muted={true}
                                width="100%"
                                height="100%"
                                onPlay={() => setPlaying(true)}
                                onPause={() => setPlaying(false)}
                                onEnded={() => setPlaying(false)}
                                onError={playbackError}
                                config={{
                                    file: {
                                        attributes: {
                                            playsinline: true
                                        }
                                    }
                                }}
                            ></ReactPlayer>
                        ) : (
                            <div className="flashcard-video-placeholder">
                                No video available
                            </div>
                        )}
                    </div>
                    <p className="flashcard-position">{currentIndex + 1} / {localTerms.length}</p>
                    <div className="flashcard-nav">
                        <button className="btn-nav" onClick={goPrev}>← Prev</button>
                        <button className="btn-nav" onClick={goNext}>Next →</button>
                        <button className="btn-nav" onClick={handleShuffle}>⇄ Shuffle</button>
                        <button className="btn-nav btn-nav--terms" onClick={() => setTermDrawerOpen(true)}>📋 Terms</button>
                        <Tippy key="autoplay" content={autoPlay ? 'Cancel Auto-Play' : 'Enable Auto-Play'} placement="top">
                            <button
                                className={`btn-nav${autoPlay ? ' btn-nav--active' : ''}`}
                                onClick={() => setAutoPlay(p => !p)}
                            >{autoPlay ? '🔁 Auto' : '⏸ Wait'}</button>
                        </Tippy>
                        <Tippy key="playercontrols" content={showPlayerControls ? 'Hide Player Controls' : 'Show Player Controls'} placement="top">
                            <button
                                className={`btn-nav${showPlayerControls ? ' btn-nav--active' : ''}`}
                                onClick={() => setShowPlayerControls(p => !p)}
                            >🎛️ Controls</button>
                        </Tippy>
                        <Tippy key="playpause" content={playing ? 'Pause' : 'Play'} placement="top">
                            <button
                                className={`btn-nav${playing ? ' btn-nav--active' : ''}`}
                                onClick={() => setPlaying(p => !p)}
                            >{playing ? '⏸' : '▶'}</button>
                        </Tippy>
                        <Tippy key="playbackrate" content={playbackRate === 1 ? 'Slow to ½×' : 'Reset to 1×'} placement="top">
                            <button
                                className={`btn-nav${playbackRate !== 1 ? ' btn-nav--active' : ''}`}
                                onClick={() => setPlaybackRate(r => r === 1 ? 0.5 : 1)}
                            >🐢 {playbackRate === 1 ? '1×' : '½×'}</button>
                        </Tippy>
                    </div>
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
                            onChange={e => { setPlaying(false); setCurrentIndex(Number(e.target.value)); setTermDrawerOpen(false); }}
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
