import './join.css';

import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fbGetGameRecord, fbStartGame } from '../firebase/firebase';
import { g, Game, GameStatus, setG } from '../game/model/game';
import { PlayerType } from '../game/model/player';
import { handleProgressCallback } from '../game/ui/game-ui';

export function Join() {
    const navigate = useNavigate();
    const [gameIdStr, setGameIdStr] = useState('');

    useEffect(() => {
        if (gameIdStr && gameIdStr.length === 5) {
            (async () => {
                const gameId = parseFloat(gameIdStr);
                const record = await fbGetGameRecord(parseFloat(gameIdStr));
                if (record && record['status'] === GameStatus.JOINING) {
                    const playerNames: string[] = ['remote', 'local'];
                    const playerTypes: PlayerType[] = [PlayerType.REMOTE, PlayerType.LOCAL];
                    const fenStr = record['cFen'];
                    setG(new Game(gameId, playerNames[0], playerTypes[0], playerNames[1], playerTypes[1], fenStr, handleProgressCallback));
                    g!.startGame();
                    fbStartGame(g!.id);
                    navigate('/game');
                }
            })();
        }
    }, [gameIdStr]);

    const handleChangeGameId = useCallback((event: any) => {
        const str = event.target.value;
        if (str === '') {
            setGameIdStr('');
            return;
        }
        if (!isNaN(str) && !isNaN(parseFloat(str))) {
            if (str.length <= 5) {
                setGameIdStr(str);
            }
        }
    }, []);

    const handleClickCancel = useCallback(() => {
        navigate(`/init`);
    }, []);

    return (
        <Box className="join page">
            <Box className="page-cover" />
            <Box className="page--content-and-actions">
                <Box className="page--content">
                    <Typography variant="h4" className="page--section-header" sx={{ margin: '2rem 0 0.5rem 0' }}>
                        Join Game
                    </Typography>
                    <Typography variant="body1" className="create--text">
                        Please enter the ID provided by the game creator.
                    </Typography>
                    <TextField required id="game-id" placeholder="00000" variant="outlined" className="join--game-id" value={gameIdStr} onChange={handleChangeGameId} />
                </Box>
                <Box className="page--actions">
                    <Button onClick={handleClickCancel} variant="outlined" className="action-button">
                        <Typography>Cancel</Typography>
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
