import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Game } from '../model/game';
import { PlayerType } from '../model/player';
import { BoardUI } from './board-ui';

export function GameUI() {
    const [g, setG] = useState<Game | null>(null);
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const decks = (queryParams.get('decks') || 'base').split(',');
        setG(new Game(PlayerType.HUMAN, 'Blue player', PlayerType.HUMAN, 'Red player', decks, ''));
    }, []);

    return (
        g && (
            <Box>
                <BoardUI b={g.board} />
                <Box>{g.getCurPosition()?.handsData[0]}</Box>
                <Box>{g.getCurPosition()?.handsData[1]}</Box>
            </Box>
        )
    );
}
