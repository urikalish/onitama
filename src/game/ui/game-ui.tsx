import './game.css';

import { Box } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Game } from '../model/game';
import { Move } from '../model/move';
import { PlayerType } from '../model/player';
import { BoardUI } from './board-ui';
import { HandsUi } from './hands-ui';

export function GameUI() {
    const [g, setG] = useState<Game | null>(null);
    const [possibleMoves, setPossibleMoves] = useState<Move[]>([]);

    const location = useLocation();

    function initGame() {
        const queryParams = new URLSearchParams(location.search);
        const decks = (queryParams.get('decks') || 'base').split(',');
        const game = new Game(PlayerType.HUMAN, 'Blue player', PlayerType.HUMAN, 'Red player', decks, '');
        game.startGame(Date.now());
        setG(game);
    }

    useEffect(() => {
        initGame();
    }, []);

    const handleSelectCard = useCallback(
        (cardName: string) => {
            setPossibleMoves((g?.possibleMoves || []).filter((m) => m.cardName === cardName));
        },
        [g],
    );

    return (
        <Box className="game">
            {g && (
                <Box className="main">
                    <BoardUI p={g.getCurPosition()} b={g.board} possibleMoves={possibleMoves} />
                    <HandsUi p={g.getCurPosition()} possibleMoves={g.possibleMoves} onSelectCard={handleSelectCard} />
                </Box>
            )}
        </Box>
    );
}
