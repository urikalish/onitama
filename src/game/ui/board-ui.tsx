import './board.css';

import { Box } from '@mui/material';
import React, { useEffect, useRef } from 'react';

import { Board, squareTempleOfArmyIndex } from '../model/board';
import { getSquareNameByIndex } from '../model/square';

type BoardUIProps = {
    board: Board;
};

export function BoardUI({ board }: BoardUIProps) {
    const boardRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
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
            boardRef.current!.appendChild(squareElm);
        }
        return () => {
            if (boardRef.current) {
                (boardRef.current as HTMLElement).replaceChildren();
            }
        };
    }, [board]);

    return board && <Box ref={boardRef} className="board"></Box>;
}
