import toast from "react-hot-toast";

export function PhoneLandscapeLayout({
    video,
    nav,
    termList,
    positionLabel,
    termText,
    termBg,
    termFg,
    onBack,
    swipeHandlers,
}) {
    toast("PhoneLandscape Layout loaded", {
        style: {
            background: 'white',
            color: 'black'
        }
    });
    return (
        <div className="layout-phone-landscape" {...swipeHandlers}>
            <div className="layout-phone-landscape__video-wrap">
                {video}
            </div>
            <div className="layout-phone-landscape__sidebar">
                <button className="btn-back layout-phone-landscape__back" onClick={onBack}>← Back</button>
                <div
                    className="layout-phone-landscape__term"
                    style={{backgroundColor: termBg, color: termFg}}
                >{termText}</div>
                <div className="layout-phone-landscape__position">{positionLabel}</div>
                <div className="layout-phone-landscape__nav">{nav}</div>
                {termList}
            </div>
        </div>
    );
}
