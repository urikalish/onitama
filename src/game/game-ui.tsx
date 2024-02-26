import './game-ui.css';

import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Game } from './model/game';
import { PlayerType } from './model/player';

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
                <Box className="board">
                    <Box data-index="0" data-name="a5"></Box>
                    <Box data-index="1" data-name="b5"></Box>
                    <Box data-index="2" data-name="c5"></Box>
                    <Box data-index="3" data-name="d5"></Box>
                    <Box data-index="4" data-name="e5"></Box>
                    <Box data-index="5" data-name="a4"></Box>
                    <Box data-index="6" data-name="b4"></Box>
                    <Box data-index="7" data-name="c4"></Box>
                    <Box data-index="8" data-name="d4"></Box>
                    <Box data-index="9" data-name="e4"></Box>
                    <Box data-index="10" data-name="a3"></Box>
                    <Box data-index="11" data-name="b3"></Box>
                    <Box data-index="12" data-name="c3"></Box>
                    <Box data-index="13" data-name="d3"></Box>
                    <Box data-index="14" data-name="e3"></Box>
                    <Box data-index="15" data-name="a2"></Box>
                    <Box data-index="16" data-name="b2"></Box>
                    <Box data-index="17" data-name="c2"></Box>
                    <Box data-index="18" data-name="d2"></Box>
                    <Box data-index="19" data-name="e2"></Box>
                    <Box data-index="20" data-name="a1"></Box>
                    <Box data-index="21" data-name="b1"></Box>
                    <Box data-index="22" data-name="c1"></Box>
                    <Box data-index="23" data-name="d1"></Box>
                    <Box data-index="24" data-name="e1"></Box>
                </Box>
                <Box>{g.getCurPosition()?.handsData[0]}</Box>
                <Box>{g.getCurPosition()?.handsData[1]}</Box>
            </Box>
        )
    );
}
