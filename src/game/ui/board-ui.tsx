import './board.css';

import { Box } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Board, squareTempleOfArmyIndex } from '../model/board';
import { Move } from '../model/move';
import { getSquareNameByIndex } from '../model/square';

type BoardUIProps = {
    b: Board;
    possibleMoves: Move[];
};

export function BoardUI({ b, possibleMoves }: BoardUIProps) {
    const boardSquaresRef = useRef<HTMLElement | null>(null);
    const boardPiecesRef = useRef<HTMLElement | null>(null);

    const [selectedPieceName, setSelectedPieceName] = useState<string>('');

    function initSquares() {
        (boardSquaresRef.current as HTMLElement).replaceChildren();
        for (let index = 0; index < 25; index++) {
            const squareElm = document.createElement('div');
            squareElm.setAttribute('data-index', String(index));
            squareElm.setAttribute('data-name', getSquareNameByIndex(index));
            squareElm.classList.add('square');
            const squareTempleOfArmy = squareTempleOfArmyIndex(index);
            if (squareTempleOfArmy === 0) {
                squareElm.classList.add('temple', 'temple--blue');
            } else if (squareTempleOfArmy === 1) {
                squareElm.classList.add('temple', 'temple--red');
            }
            const square = b.squares[index];
            if (square.piece) {
                squareElm.classList.add('occupied');
            } else {
                squareElm.classList.add('empty');
            }
            boardSquaresRef.current!.appendChild(squareElm);
        }
    }

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
            (boardPiecesRef.current as HTMLElement).appendChild(pieceElm);
        }
    }

    useEffect(() => {
        initSquares();
        initPieces();
    }, []);

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
            pieceElm.classList.toggle('selectable', !!possibleMoves.find((m) => m.from === Number(pieceElm.dataset.squareIndex)));
            pieceElm.classList.toggle('selected', piece.name === selectedPieceName);

            // if (index === this.selectedIndex) {
            //     pieceElm.classList.add('clickable');
            // }
            // if (this.game.possibleMoves.find(m => m.from === index)) {
            //     pieceElm.classList.add('clickable');
            // }
            // if (this.selectedIndex !== -1 && this.game.possibleMoves.find(m => m.from === this.selectedIndex && m.to === index)) {
            //     pieceElm.classList.add('clickable');
            // }
        }
        pieceElmsToHandle.forEach((elm) => {
            elm.remove();
        });
    }

    const handleClickPiece = useCallback((event: any) => {
        setSelectedPieceName(event.target.dataset.name);
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
                <Box ref={boardSquaresRef} className="squares" />
                <Box ref={boardPiecesRef} className="pieces" />
            </Box>
        )
    );
}
