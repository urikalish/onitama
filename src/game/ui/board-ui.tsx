import './board.css';

import { Box } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';

import { Board, squareTempleOfArmyIndex } from '../model/board';
import { Move } from '../model/move';

type BoardUIProps = {
    b: Board;
    cardPossibleMoves: Move[];
    onSelectMove: (from: number, to: number) => void;
};

export function BoardUI({ b, cardPossibleMoves, onSelectMove }: BoardUIProps) {
    const [selectedSourceIndex, setSelectedSourceIndex] = useState<number>(-1);

    useEffect(() => {
        if (!cardPossibleMoves.find((m) => m.from === selectedSourceIndex)) {
            setSelectedSourceIndex(-1);
        }
    }, [cardPossibleMoves, selectedSourceIndex]);

    const handleClickPiece = useCallback(
        (event: any) => {
            const index = Number(event.target.dataset.squareIndex);
            if (cardPossibleMoves.find((m) => m.from === index)) {
                setSelectedSourceIndex(index);
            } else if (cardPossibleMoves.find((m) => m.to === index)) {
                onSelectMove(selectedSourceIndex, index);
            }
        },
        [selectedSourceIndex, onSelectMove],
    );

    const handleClickSquare = useCallback(
        (event: any) => {
            const from = selectedSourceIndex;
            const to = Number(event.target.dataset.index);
            onSelectMove(from, to);
        },
        [selectedSourceIndex, onSelectMove],
    );

    return (
        <Box className="board">
            <Box className="squares">
                {b.squares.map((s, index) => (
                    <Box
                        key={s.name}
                        data-index={index}
                        data-name={s.name}
                        className={`square ${squareTempleOfArmyIndex(index) === 0 ? 'torii torii--blue' : ''}${squareTempleOfArmyIndex(index) === 1 ? 'torii torii--red' : ''} ${
                            cardPossibleMoves.find((m) => m.from === index) ? 'selectable-source' : ''
                        }${cardPossibleMoves.find((m) => m.from === selectedSourceIndex && m.to === index) ? 'selectable-target' : ''} ${
                            index === selectedSourceIndex ? 'selected' : ''
                        }`}
                        onClick={handleClickSquare}
                    />
                ))}
            </Box>
            <Box className="pieces">
                {b.getPiecesDataByName().map((pd) => (
                    <Box
                        key={pd.p.name}
                        data-name={pd.p.name}
                        data-square-index={pd.i}
                        className={`piece ${pd.p.color} ${pd.p.type} ${cardPossibleMoves.find((m) => m.from === pd.i) ? 'selectable-source' : ''}${
                            cardPossibleMoves.find((m) => m.from === selectedSourceIndex && m.to === pd.i) ? 'selectable-target' : ''
                        } ${pd.i === selectedSourceIndex ? 'selected' : ''}`}
                        style={{ transform: `translate(${Math.trunc((pd.i % 5) * 111)}%, ${Math.trunc(pd.i / 5) * 111}%)` }}
                        onClick={handleClickPiece}
                    />
                ))}
            </Box>
        </Box>
    );
}
