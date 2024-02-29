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
        setSelectedSourceIndex(-1);
    }, [cardPossibleMoves]);

    const handleClickPiece = useCallback((event: any) => {
        setSelectedSourceIndex(Number(event.target.dataset.squareIndex));
    }, []);

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
                        className={`square ${squareTempleOfArmyIndex(index) === 0 ? 'temple temple--blue' : ''}${
                            squareTempleOfArmyIndex(index) === 1 ? 'temple temple--red' : ''
                        } ${cardPossibleMoves.find((m) => m.from === index) ? 'selectable-source' : ''}${
                            cardPossibleMoves.find((m) => m.from === selectedSourceIndex && m.to === index) ? 'selectable-target' : ''
                        } ${index === selectedSourceIndex ? 'selected' : ''}`}
                        onClick={handleClickSquare}
                    />
                ))}
            </Box>
            <Box className="pieces">
                {b.squares.map(
                    (s, index) =>
                        s.piece && (
                            <Box
                                key={s.piece.name}
                                data-name={s.piece.name}
                                data-square-index={index}
                                className={`piece ${s.piece.color} ${s.piece.type} ${cardPossibleMoves.find((m) => m.from === index) ? 'selectable-source' : ''}${
                                    cardPossibleMoves.find((m) => m.from === selectedSourceIndex && m.to === index) ? 'selectable-target' : ''
                                } ${index === selectedSourceIndex ? 'selected' : ''}`}
                                style={{ transform: `translate(${index % 5}00%, ${Math.trunc(index / 5)}00%)` }}
                                onClick={handleClickPiece}
                            />
                        ),
                )}
            </Box>
        </Box>
    );
}
