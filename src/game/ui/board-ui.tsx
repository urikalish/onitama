import './board.css';

import { Box } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Board } from '../model/board';
import { Move } from '../model/move';

type BoardUIProps = {
    b: Board;
    possibleMoves: Move[];
    onSelectMove: (from: number, to: number) => void;
};

export function BoardUI({ b, possibleMoves, onSelectMove }: BoardUIProps) {
    const boardSquaresRef = useRef<HTMLElement | null>(null);
    const boardPiecesRef = useRef<HTMLElement | null>(null);

    const [selectedPieceName, setSelectedPieceName] = useState<string>('');

    function initPieces() {
        (boardPiecesRef.current as HTMLElement).replaceChildren();
        for (let index = 0; index < 25; index++) {
            const square = b.squares[index];
            if (!square.piece) {
                continue;
            }
            const pieceElm = document.createElement('div');
            pieceElm.setAttribute('data-name', square.piece.name);
            pieceElm.classList.add('piece');
            pieceElm.classList.add(square.piece.armyIndex === 0 ? 'blue' : 'red', square.piece.type);
            pieceElm.addEventListener('click', handleClickPiece);
            boardPiecesRef.current!.appendChild(pieceElm);
        }
    }

    function handleSquares() {
        const selectedPieceSquareIndex = selectedPieceName ? b.getSquareIndexByPieceName(selectedPieceName) : -1;
        const squareElms: HTMLElement[] = Array.from(document.querySelectorAll(`.squares > .square`));
        squareElms.forEach((squareElm) => {
            squareElm.classList.toggle('selectable-source', !!possibleMoves.find((m) => m.from === Number(squareElm.dataset.index)));
            squareElm.classList.toggle('selectable-target', !!possibleMoves.find((m) => m.from === selectedPieceSquareIndex && m.to === Number(squareElm.dataset.index)));
        });
    }

    function handlePieces() {
        const pieceElmsToHandle: HTMLElement[] = Array.from(document.querySelectorAll(`.pieces > .piece`));
        for (let index = 0; index < 25; index++) {
            const square = b.squares[index];
            const piece = square.piece;
            if (!piece) {
                continue;
            }
            const pieceElmIndex = pieceElmsToHandle.findIndex((elm) => elm.dataset.name === piece.name);
            const pieceElm = pieceElmsToHandle[pieceElmIndex];
            pieceElmsToHandle.splice(pieceElmIndex, 1);
            pieceElm.dataset.squareIndex = String(index);
            pieceElm.style.transform = `translate(${index % 5}00%, ${Math.trunc(index / 5)}00%)`;
            pieceElm.classList.toggle('selectable-source', !!possibleMoves.find((m) => m.from === square.index));
            pieceElm.classList.toggle('selected', piece.name === selectedPieceName);
            pieceElm.classList.toggle('selectable-target', !!possibleMoves.find((m) => m.to === square.index));
        }
        pieceElmsToHandle.forEach((elm) => {
            elm.remove();
        });
    }

    const handleClickSquare = useCallback(
        (event: any) => {
            const from = b.getSquareIndexByPieceName(selectedPieceName);
            const to = Number(event.target.dataset.index);
            onSelectMove(from, to);
        },
        [selectedPieceName],
    );

    function handleClickPiece(event: any) {
        setSelectedPieceName(event.target.dataset.name);
    }

    useEffect(() => {
        initPieces();
    }, []);

    useEffect(() => {
        setSelectedPieceName('');
    }, [possibleMoves]);

    useEffect(() => {
        handleSquares();
        handlePieces();
    }, [possibleMoves, selectedPieceName]);

    return (
        b && (
            <Box className="board">
                <Box ref={boardSquaresRef} className="squares">
                    <Box data-index="0" data-name="a5" className="square" onClick={handleClickSquare} />
                    <Box data-index="1" data-name="b5" className="square" onClick={handleClickSquare} />
                    <Box data-index="2" data-name="c5" className="square" onClick={handleClickSquare} />
                    <Box data-index="3" data-name="d5" className="square" onClick={handleClickSquare} />
                    <Box data-index="4" data-name="e5" className="square" onClick={handleClickSquare} />
                    <Box data-index="5" data-name="a4" className="square" onClick={handleClickSquare} />
                    <Box data-index="6" data-name="b4" className="square" onClick={handleClickSquare} />
                    <Box data-index="7" data-name="c4" className="square" onClick={handleClickSquare} />
                    <Box data-index="8" data-name="d4" className="square" onClick={handleClickSquare} />
                    <Box data-index="9" data-name="e4" className="square" onClick={handleClickSquare} />
                    <Box data-index="10" data-name="a3" className="square temple temple--blue" onClick={handleClickSquare} />
                    <Box data-index="11" data-name="b3" className="square" onClick={handleClickSquare} />
                    <Box data-index="12" data-name="c3" className="square" onClick={handleClickSquare} />
                    <Box data-index="13" data-name="d3" className="square" onClick={handleClickSquare} />
                    <Box data-index="14" data-name="e3" className="square temple temple--red" onClick={handleClickSquare} />
                    <Box data-index="15" data-name="a2" className="square" onClick={handleClickSquare} />
                    <Box data-index="16" data-name="b2" className="square" onClick={handleClickSquare} />
                    <Box data-index="17" data-name="c2" className="square" onClick={handleClickSquare} />
                    <Box data-index="18" data-name="d2" className="square" onClick={handleClickSquare} />
                    <Box data-index="19" data-name="e2" className="square" onClick={handleClickSquare} />
                    <Box data-index="20" data-name="a1" className="square" onClick={handleClickSquare} />
                    <Box data-index="21" data-name="b1" className="square" onClick={handleClickSquare} />
                    <Box data-index="22" data-name="c1" className="square" onClick={handleClickSquare} />
                    <Box data-index="23" data-name="d1" className="square" onClick={handleClickSquare} />
                    <Box data-index="24" data-name="e1" className="square" onClick={handleClickSquare} />
                </Box>
                <Box ref={boardPiecesRef} className="pieces" />
            </Box>
        )
    );
}
