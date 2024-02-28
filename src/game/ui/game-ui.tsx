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
    const [selectedCardName, setSelectedCardName] = useState<string>('');
    const [possibleMoves, setPossibleMoves] = useState<Move[]>([]);

    const location = useLocation();

    function initGame() {
        const queryParams = new URLSearchParams(location.search);
        const decks = (queryParams.get('decks') || 'base').split(',');
        const game = new Game(PlayerType.HUMAN, 'Blue player', PlayerType.HUMAN, 'Red player', decks);
        game.startGame(Date.now());
        setG(game);
    }

    useEffect(() => {
        initGame();
    }, []);

    const handleSelectCard = useCallback(
        (cardName: string) => {
            setSelectedCardName(cardName);
            setPossibleMoves((g?.possibleMoves || []).filter((m) => m.cardName === cardName));
        },
        [g],
    );

    const handleSelectMove = useCallback(
        (from: number, to: number) => {
            const move = possibleMoves.filter((m) => m.from === from && m.to === to);
            alert(move[0]!.name);
        },
        [g, possibleMoves],
    );

    return (
        <Box className="game">
            {g && (
                <Box className="main">
                    <BoardUI b={g.board} possibleMoves={possibleMoves} onSelectMove={handleSelectMove} />
                    <HandsUi p={g.getCurPosition()} possibleMoves={g.possibleMoves} selectedCardName={selectedCardName} onSelectCard={handleSelectCard} />
                </Box>
            )}
        </Box>
    );
}
