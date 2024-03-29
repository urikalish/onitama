import './start.css';

import { Box, Button, FormControl, FormGroup, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { g, Game, setG } from '../game/model/game';
import { PlayerType } from '../game/model/player';
import { handleProgressCallback } from '../game/ui/game-ui';
import { AnalyticsAction, AnalyticsCategory, sendAnalyticsEvent } from '../services/analytics';

const LOCAL_STORAGE_SETTINGS_KEY = 'onitama';
const BLUE_PLAYER = 'bluePlayer';
const RED_PLAYER = 'redPlayer';

export function Start() {
    const [bluePlayer, setBluePlayer] = useState('human');
    const [redPlayer, setRedPlayer] = useState('human');
    const [canSubmit] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY) || '{}');
        let value;
        value = settings[BLUE_PLAYER];
        if (value) {
            setBluePlayer(value);
        }
        value = settings[RED_PLAYER];
        if (value) {
            setRedPlayer(value);
        }
    }, []);

    const handleChangeBluePlayer = useCallback((event: any) => {
        setBluePlayer(event.target.value);
    }, []);

    const handleChangeRedPlayer = useCallback((event: any) => {
        setRedPlayer(event.target.value);
    }, []);

    const handleClickHome = useCallback(() => {
        navigate(`/`);
    }, []);

    const handleClickStart = useCallback(() => {
        const settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY) || '{}');
        settings[BLUE_PLAYER] = bluePlayer;
        settings[RED_PLAYER] = redPlayer;
        localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));

        const players: string[] = [bluePlayer, redPlayer];
        const deckNames = ['base', 'path', 'wind', 'promo'];
        setG(
            new Game(
                players[0],
                players[0] === 'human' ? PlayerType.HUMAN : PlayerType.BOT,
                players[1],
                players[1] === 'human' ? PlayerType.HUMAN : PlayerType.BOT,
                { deckNames },
                handleProgressCallback,
            ),
        );
        g!.startGame(Date.now());
        sendAnalyticsEvent(AnalyticsCategory.GAME_PHASE, AnalyticsAction.GAME_PHASE_GAME_STARTED);
        sendAnalyticsEvent(AnalyticsCategory.PLAYERS, `${players[0]} vs ${players[1]}`);
        navigate('/game');
    }, [bluePlayer, redPlayer]);

    return (
        <Box className="start page">
            <Box className="page-cover" />
            <Box className="page--content-and-actions">
                <Box className="page--content">
                    <FormGroup>
                        <Typography variant="h4" className="page--section-header">
                            Players
                        </Typography>
                        <Box className="start--players">
                            <FormControl fullWidth>
                                <InputLabel id="blue-select-label">Blue Player</InputLabel>
                                <Select labelId="blue-select-label" id="blue-select" value={bluePlayer} label="Blue Player" onChange={handleChangeBluePlayer}>
                                    <MenuItem value="human">Human</MenuItem>
                                    <MenuItem value="bot0">Bot 0 (easy)</MenuItem>
                                    <MenuItem value="bot1">Bot 1</MenuItem>
                                    <MenuItem value="bot2">Bot 2</MenuItem>
                                    <MenuItem value="bot3">Bot 3</MenuItem>
                                    <MenuItem value="bot4">Bot 4</MenuItem>
                                    <MenuItem value="bot5">Bot 5 (hard)</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="red-select-label">Red Player</InputLabel>
                                <Select labelId="red-select-label" id="red-select" value={redPlayer} label="Red Player" onChange={handleChangeRedPlayer}>
                                    <MenuItem value="human">Human</MenuItem>
                                    <MenuItem value="bot0">Bot 0 (easy)</MenuItem>
                                    <MenuItem value="bot1">Bot 1</MenuItem>
                                    <MenuItem value="bot2">Bot 2</MenuItem>
                                    <MenuItem value="bot3">Bot 3</MenuItem>
                                    <MenuItem value="bot4">Bot 4</MenuItem>
                                    <MenuItem value="bot5">Bot 5 (hard)</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </FormGroup>
                </Box>
                <Box className="page--actions">
                    <Button onClick={handleClickHome} variant="outlined" className="action-button">
                        <Typography>Home</Typography>
                    </Button>
                    <Button disabled={!canSubmit} onClick={handleClickStart} variant="contained" className="action-button">
                        <Typography>Start</Typography>
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
