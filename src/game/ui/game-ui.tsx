import './game.css';

import { Box } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Game } from '../model/game';
import { Move } from '../model/move';
import { PlayerType } from '../model/player';
import { Position } from '../model/position';
import { BoardUI } from './board-ui';
import { HandsUi } from './hands-ui';

export function GameUI() {
    const [g, setG] = useState<Game | null>(null);
    const [position, setPosition] = useState<Position | null>(null);
    const [allPossibleMoves, setAllPossibleMoves] = useState<Move[]>([]);
    const [cardPossibleMoves, setCardPossibleMoves] = useState<Move[]>([]);

    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const decks = (queryParams.get('decks') || 'base').split(',');
        const game = new Game(PlayerType.HUMAN, 'Blue player', PlayerType.HUMAN, 'Red player', decks);
        game.startGame(Date.now());
        setG(game);
    }, []);

    useEffect(() => {
        if (!g) {
            return;
        }
        setPosition(g!.getCurPosition());
    }, [g]);

    useEffect(() => {
        if (!g) {
            return;
        }
        setAllPossibleMoves(g!.possibleMoves);
        setCardPossibleMoves([]);
    }, [position]);

    const handleSelectCard = useCallback(
        (cardName: string) => {
            setCardPossibleMoves(allPossibleMoves.filter((m) => m.cardName === cardName));
        },
        [allPossibleMoves],
    );

    const handleSelectMove = useCallback(
        (from: number, to: number) => {
            const move = cardPossibleMoves.find((m) => m.from === from && m.to === to);
            g!.move(move);
            setPosition(g!.getCurPosition());
            if (g!.isGameEnded()) {
                setTimeout(() => {
                    alert(g!.resultStr);
                }, 1000);
            }
        },
        [g, cardPossibleMoves],
    );

    return (
        g && (
            <Box className="game">
                <Box className="main">
                    <BoardUI b={g.board} cardPossibleMoves={cardPossibleMoves} onSelectMove={handleSelectMove} />
                    <HandsUi p={position} allPossibleMoves={allPossibleMoves} onSelectCard={handleSelectCard} />
                </Box>
                {g?.isGameEnded() && <Box className="game-cover" />}
            </Box>
        )
    );
}
