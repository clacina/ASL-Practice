import ReactPlayer from 'react-player';

export function FlashcardPlayer({
    url,
    playing,
    loop,
    autoPlay,
    controls,
    playbackRate,
    onPlay,
    onPause,
    onEnded,
    onError,
}) {
    return (
        <div className="flashcard-video">
            {url ? (
                <ReactPlayer
                    className="flashcard-video-iframe"
                    title="ASL sign video"
                    src={url}
                    playing={playing}
                    loop={loop}
                    autoPlay={autoPlay}
                    controls={controls}
                    playsinline={true}
                    muted={true}
                    width="100%"
                    height="100%"
                    playbackRate={playbackRate}
                    onPlay={onPlay}
                    onPause={onPause}
                    onEnded={onEnded}
                    onError={onError}
                    config={{
                        file: {
                            attributes: {
                                playsInline: true,
                            },
                        },
                    }}
                />
            ) : (
                <div className="flashcard-video-placeholder">
                    No video available
                </div>
            )}
        </div>
    );
}
