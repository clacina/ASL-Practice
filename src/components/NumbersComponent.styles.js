import styled from "styled-components";

export const NumbersComponentContainer = styled.div`
    width: 100%;
`;

export const NumbersComponentHeader = styled.div`
    display: flex;
    flex-direction: row;

    .btn-back {
        width: 100px;

        flex-shrink: 0;
        align-self: flex-start;
        background: none;
        border: none;
        padding: 0;
        color: var(--text);
        font-size: 15px;
        cursor: pointer;
        transition: color 0.2s;
        z-index: 100;

        &:hover {
            color: var(--text-h);
        }
    }

    h1 {
        //border: 1px solid pink;
        width: 100%;
        margin-top: 10px;
        justify-content: center;
        align-items: center;
    }

    .text-header {
        width: 100%;
        margin-left: -100px;
    }

    ul {
        display: flex;
        list-style: none;
        gap: 15px;
        padding: 0;
        text-align: left;
    }

    li {
        border-right: 1px solid grey;
        font-size: small;
        line-height: 15px;
    }

    li:last-child {
        border-right: none;
    }
`;

export const NumbersComponentBody = styled.div`
    //border: 1px solid blue;
    display: flex;
    justify-content: space-between;

    .flashcard-video {
        max-width: 400px;
    }
`;

export const NumbersComponentNav = styled.nav`
    //border: 1px solid yellow;
    flex: 1;
    width: 300px;
    display: flex;
    flex-direction: column;

    button {
        width: 150px;
    }
`;

export const NumbersComponentTermsList = styled.div`
    flex: none;
    width: 200px;
    border: 1px solid pink;
    max-height: 330px;
    overflow-y: auto;

    ul {
        list-style: none;
        text-align: left;
    }
`;

export const NumbersComponentHint = styled.p`
    width: 400px;
    border: 1px solid orange;
    height: 2rem;
`;

export const ButtonNav = styled.div`
    border: 1px solid green;
`;

export const NumbersComponentCheck = styled.div`
    border: 1px solid orange;
    width: 100%;
    margin-top: auto;
`;