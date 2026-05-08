import {useEffect, useRef} from "react";
import styled from "styled-components";

const TermsListModal = styled.div`
    --color-bg: rgb(180, 130, 30);
      
    .modal {
        position: fixed;
        inset: 0;
        z-index: 300;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal__backdrop {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
    }

    .modal__panel {
        position: relative;
        background: var(--color-bg);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 20px;
        max-width: 480px;
        width: 80%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: var(--shadow);
    }

    .modal__close {
        position: absolute;
        top: 12px;
        right: 12px;
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: var(--text-h);
        line-height: 1;
        padding: 4px 8px;
        min-height: 44px;
        min-width: 44px;

        &:hover {
            color: var(--text-h);
            opacity: 0.7;
        }

        &:focus-visible {
            outline: 2px solid var(--accent);
            outline-offset: 2px;
            border-radius: 4px;
        }
    }

    .modal__body {
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 8px;
        color: var(--text-h);
        font-size: 14px;
        line-height: 1.5;
        text-align: left;
    }

    .modal__body h4 {
        margin: 0;
        text-align: center;
    }

    .modal__body a {
        color: var(--text-h);
    }

    .modal__body hr {
        margin: 0;
        border: 1px solid var(--border);
    }
`;


export function TermsListModalDialog({onClose, currentIndex, onSelectTerm, sortedTerms}) {
    const closeButtonRef = useRef(null);
    const panelRef = useRef(null);
    const selectRef = useRef(null);

    const termSelectEl = (
        <select
            ref={selectRef}
            size={10}
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


    useEffect(() => {
        closeButtonRef.current?.focus();

        function handleKey(e) {
            if (e.key === "Escape") {
                onClose();
                return;
            }
            if (e.key === "Tab") {
                const panel = panelRef.current;
                if (!panel) return;
                const focusable = Array.from(panel.querySelectorAll("button, a[href]"));
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (e.shiftKey) {
                    if (document.activeElement === first) {
                        e.preventDefault();
                        last.focus();
                    }
                } else {
                    if (document.activeElement === last) {
                        e.preventDefault();
                        first.focus();
                    }
                }
            }
        }

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    return <TermsListModal>
        <div className="modal">
            <div
                className="modal__backdrop"
                onClick={onClose}
                onKeyDown={onClose}
                role="button"
                aria-label="Close disclaimer"
                tabIndex="-1"
            />
            <div
                ref={panelRef}
                className="modal__panel"
                role="dialog"
                aria-modal="true"
                aria-labelledby="title"
            >
                <button
                    ref={closeButtonRef}
                    className="modal__close"
                    aria-label="Close disclaimer"
                    onClick={onClose}
                >✕
                </button>
                <div className="modal__body">
                    {termSelectEl}
                </div>
            </div>
        </div>
    </TermsListModal>
}
