import toast from "react-hot-toast";

export function PhonePortraitLayout({
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
    // toast("PhonePortrait Layout loaded", {
    //     style: {
    //         background: 'white',
    //         color: 'black'
    //     }
    // });
    return (
        <div className="layout-phone-portrait" {...swipeHandlers}>
            <button className="btn-back layout-phone-portrait__back" onClick={onBack}>← Back</button>
            <div className="layout-phone-portrait__video-wrap">
                <span
                    className="layout-phone-portrait__term-overlay"
                    style={{backgroundColor: termBg, color: termFg}}
                >{termText}</span>
                {video}
            </div>
            <div className="layout-phone-portrait__position">{positionLabel}</div>
            <div className="layout-phone-portrait__nav">{nav}</div>
            {termList}
        </div>
    );
}
