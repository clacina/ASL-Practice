export function TabletPortraitLayout({
    video,
    nav,
    termList,
    positionLabel,
    termText,
    termBg,
    termFg,
    onBack,
    swipeHandlers,
    title,
    description,
}) {
    return (
        <div className="layout-tablet-portrait" {...swipeHandlers}>
            <button className="btn-back layout-tablet-portrait__back" onClick={onBack}>← Back</button>
            {(title || description) && (
                <div className="layout-tablet-portrait__header">
                    {title && <h1 className="layout-tablet-portrait__title">{title}</h1>}
                    {description && <p className="layout-tablet-portrait__desc">{description}</p>}
                </div>
            )}
            <div className="layout-tablet-portrait__video-wrap">
                {video}
            </div>
            <div
                className="layout-tablet-portrait__term"
                style={{backgroundColor: termBg, color: termFg}}
            >{termText}</div>
            <div className="layout-tablet-portrait__position">{positionLabel}</div>
            <div className="layout-tablet-portrait__nav">{nav}</div>
            <div className="layout-tablet-portrait__termlist">{termList}</div>
        </div>
    );
}
