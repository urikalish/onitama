import './board.css';

import { Box } from '@mui/material';
import React, { useEffect, useRef } from 'react';

import { Board, squareTempleOfArmyIndex } from '../model/board';
import { Move } from '../model/move';
import { Position } from '../model/position';
import { getSquareNameByIndex } from '../model/square';

type BoardUIProps = {
    p: Position;
    b: Board;
    possibleMoves: Move[];
};

export function BoardUI({ b, possibleMoves }: BoardUIProps) {
    const boardSquaresRef = useRef<HTMLElement | null>(null);
    const boardPiecesRef = useRef<HTMLElement | null>(null);

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
            //pieceElm.addEventListener('click', onClickPiece);
            (boardPiecesRef.current as HTMLElement).appendChild(pieceElm);
        }
    }

    useEffect(() => {
        initSquares();
        initPieces();
    }, []);

    useEffect(() => {
        const pieceElmsToHandle: HTMLElement[] = Array.from(document.querySelectorAll(`.board-pieces > .piece`));
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
    }, [b]);

    useEffect(() => {
        const squareElms: HTMLElement[] = Array.from(document.querySelectorAll(`.board-squares > .square`));
        squareElms.forEach((squareElm) => {
            squareElm.classList.toggle('selectable', !!possibleMoves.find((m) => m.from === Number(squareElm.dataset.index)));
        });
        const pieceElms: HTMLElement[] = Array.from(document.querySelectorAll(`.board-pieces > .piece`));
        pieceElms.forEach((pieceElm) => {
            pieceElm.classList.toggle('selectable', !!possibleMoves.find((m) => m.from === Number(pieceElm.dataset.squareIndex)));
        });
    }, [possibleMoves]);

    return (
        b && (
            <Box className="board">
                <Box ref={boardSquaresRef} className="board-squares" />
                <Box ref={boardPiecesRef} className="board-pieces" />
            </Box>
        )
    );
}
