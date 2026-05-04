import Tippy from "@tippyjs/react";

export function FlashcardNav({
    className,
    onPrev,
    onNext,
    onShuffle,
    onOpenTerms,
    autoPlay,
    onToggleAutoPlay,
    autoPlayActiveLabel,
    autoPlayInactiveLabel,
    showPlayerControls,
    onTogglePlayerControls,
    playing,
    onTogglePlaying,
    playbackRate,
    onTogglePlaybackRate,
    repeat,
    onToggleRepeat,
}) {
    console.log("FlashcardNav ", `flashcard-nav${className ? ` ${className}` : ''}`);
    return (
        <div className={`flashcard-nav${className ? ` ${className}` : ''}`}>
            <button className="btn-nav" onClick={onPrev}>← Prev</button>
            <button className="btn-nav" onClick={onNext}>Next →</button>
            <button className="btn-nav" onClick={onShuffle}>⇄ Shuffle</button>
            {onOpenTerms && (
                <button className="btn-nav btn-nav--terms" onClick={onOpenTerms}>📋 Terms</button>
            )}
            <Tippy content={autoPlay ? 'Cancel Auto-Play' : 'Enable Auto-Play'} placement="top">
                <button
                    className={`btn-nav${autoPlay ? ' btn-nav--active' : ''}`}
                    onClick={onToggleAutoPlay}
                >{autoPlay ? autoPlayActiveLabel : autoPlayInactiveLabel}</button>
            </Tippy>
            <Tippy content={showPlayerControls ? 'Hide Player Controls' : 'Show Player Controls'} placement="top">
                <button
                    className={`btn-nav${showPlayerControls ? ' btn-nav--active' : ''}`}
                    onClick={onTogglePlayerControls}
                >🎛️ Controls</button>
            </Tippy>
            <Tippy content={playing ? 'Pause' : 'Play'} placement="top">
                <button
                    className={`btn-nav${playing ? ' btn-nav--active' : ''}`}
                    onClick={onTogglePlaying}
                >{playing ? '⏸' : '▶'}</button>
            </Tippy>
            <Tippy content={playbackRate === 1 ? 'Slow to ½×' : 'Reset to 1×'} placement="top">
                <button
                    className={`btn-nav${playbackRate !== 1 ? ' btn-nav--active' : ''}`}
                    onClick={onTogglePlaybackRate}
                >🐢 {playbackRate === 1 ? '1×' : '½×'}</button>
            </Tippy>
            <Tippy content={repeat ? 'Stop Looping' : 'Loop Video'} placement="top">
                <button
                    className={`btn-nav${repeat ? ' btn-nav--active' : ''}`}
                    onClick={onToggleRepeat}
                >🔁 Loop</button>
            </Tippy>
        </div>
    );
}