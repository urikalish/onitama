import './board.css';

import { Box } from '@mui/material';
import React, { useEffect, useRef } from 'react';

import { Board, squareTempleOfArmyIndex } from '../model/board';
import { Position } from '../model/position';
import { getSquareNameByIndex } from '../model/square';

type BoardUIProps = {
    p: Position;
    b: Board;
};

export function BoardUI({ b }: BoardUIProps) {
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
            squareElm.classList.add('empty');
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
            pieceElm.classList.add(square.piece.armyIndex === 0 ? 'piece-blue' : 'piece-red', square.piece.typeCased);
            //pieceElm.addEventListener('click', onClickPiece);
            (boardPiecesRef.current as HTMLElement).appendChild(pieceElm);
        }
    }

    useEffect(() => {
        initSquares();
        initPieces();
    }, []);

    // useEffect(() => {
    //     const pieceElmsToHandle = Array.from(document.querySelectorAll(`.board-pieces > .piece`));
    //     for (let index = 0; index < 25; index++) {
    //         const square = b.squares[index];
    //         const piece = square.piece;
    //         if (!piece) {
    //             continue;
    //         }
    //         let pieceElm, pieceElmIndex;
    //         pieceElmIndex = pieceElmsToHandle.findIndex(elm => elm.dataset.name === piece.name);
    //         if (pieceElmIndex > -1) {
    //             pieceElm = pieceElmsToHandle[pieceElmIndex];
    //             pieceElmsToHandle.splice(pieceElmIndex, 1);
    //         } else {
    //             //check name changed due to promotion
    //             pieceElmIndex = pieceElmsToHandle.findIndex(elm => elm.dataset.name.substring(1) === piece.name.substring(1));
    //             if (pieceElmIndex > -1) {
    //                 pieceElm = pieceElmsToHandle[pieceElmIndex];
    //                 pieceElm.setAttribute('data-name', piece.name);
    //                 pieceElmsToHandle.splice(pieceElmIndex, 1);
    //             } else {
    //                 continue;
    //             }
    //         }
    //         pieceElm.dataset.squareIndex = String(index);
    //         pieceElm.style.transform = `translate(${uiIndex % 8}00%, ${Math.trunc(uiIndex / 8)}00%)`;
    //         pieceElm.className = '';
    //         pieceElm.classList.add('piece', piece.armyIndex === 0 ? 'white' : 'black', piece.typeCased);
    //         if (index === this.selectedIndex) {
    //             pieceElm.classList.add('clickable');
    //         }
    //         if (this.game.possibleMoves.find(m => m.from === index)) {
    //             pieceElm.classList.add('clickable');
    //         }
    //         if (this.selectedIndex !== -1 && this.game.possibleMoves.find(m => m.from === this.selectedIndex && m.to === index)) {
    //             pieceElm.classList.add('clickable');
    //         }
    //     }
    //     pieceElmsToHandle.forEach(elm => {
    //         elm.remove();
    //     });
    // }, [b]);

    return (
        b && (
            <Box className="board">
                <Box ref={boardSquaresRef} className="board-squares" />
                <Box ref={boardPiecesRef} className="board-pieces" />
            </Box>
        )
    );
}
