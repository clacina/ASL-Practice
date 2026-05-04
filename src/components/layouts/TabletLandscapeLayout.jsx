import toast from "react-hot-toast";

export function TabletLandscapeLayout({
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
    // toast("TabletLandscape Layout loaded", {
    //     style: {
    //         background: 'white',
    //         color: 'black'
    //     }
    // });
    return (
        <div className="layout-tablet-landscape" {...swipeHandlers}>
            <div className="layout-tablet-landscape__video-col">
                <div className="layout-tablet-landscape__video-wrap">
                    {video}
                </div>
                <div
                    className="layout-tablet-landscape__term"
                    style={{backgroundColor: termBg, color: termFg}}
                >{termText}</div>
                <div className="layout-tablet-landscape__position">{positionLabel}</div>
            </div>
            <div className="layout-tablet-landscape__sidebar">
                <button className="btn-back layout-tablet-landscape__back" onClick={onBack}>← Back</button>
                <div className="layout-tablet-landscape__nav">{nav}</div>
                <div className="layout-tablet-landscape__termlist">{termList}</div>
            </div>
        </div>
    );
}
