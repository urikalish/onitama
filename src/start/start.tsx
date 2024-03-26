import './start.css';

import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LOCAL_STORAGE_SETTINGS_KEY = 'onitama';
const BLUE_PLAYER = 'bluePlayer';
const RED_PLAYER = 'redPlayer';
const DECK_NAMES = 'deckNames';

export function Start() {
    const [bluePlayer, setBluePlayer] = useState('human');
    const [redPlayer, setRedPlayer] = useState('human');
    const [baseDeck, setBaseDeck] = useState(true);
    const [pathDeck, setPathDeck] = useState(true);
    const [windAndPromoDecks, setWindAndPromoDecks] = useState(true);
    const [canSubmit, setCanSubmit] = useState(true);
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
        value = settings[DECK_NAMES];
        if (value) {
            const deckNames = value.split(',');
            setBaseDeck(deckNames.includes('base'));
            setPathDeck(deckNames.includes('path'));
            setWindAndPromoDecks(deckNames.includes('wind') && deckNames.includes('promo'));
        }
    }, []);

    const handleChangeBluePlayer = useCallback((event: any) => {
        setBluePlayer(event.target.value);
    }, []);

    const handleChangeRedPlayer = useCallback((event: any) => {
        setRedPlayer(event.target.value);
    }, []);

    useEffect(() => {
        setCanSubmit(baseDeck || pathDeck || windAndPromoDecks);
    }, [baseDeck, pathDeck, windAndPromoDecks]);

    const handleChangeBaseDeck = useCallback((event: any) => {
        setBaseDeck(event.target.checked);
    }, []);

    const handleChangePathDeck = useCallback((event: any) => {
        setPathDeck(event.target.checked);
    }, []);

    const handleChangeWindAndPromoDecks = useCallback((event: any) => {
        setWindAndPromoDecks(event.target.checked);
    }, []);

    const handleClickRules = useCallback(() => {
        navigate(`/rules`);
    }, []);

    const handleClickHome = useCallback(() => {
        navigate(`/`);
    }, []);

    const handleClickStart = useCallback(() => {
        const decks = [];
        if (baseDeck) {
            decks.push('base');
        }
        if (pathDeck) {
            decks.push('path');
        }
        if (windAndPromoDecks) {
            decks.push('wind');
            decks.push('promo');
        }
        const settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY) || '{}');
        settings[BLUE_PLAYER] = bluePlayer;
        settings[RED_PLAYER] = redPlayer;
        settings[DECK_NAMES] = decks.join(',');
        localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
        navigate(`/game?players=${bluePlayer},${redPlayer}&decks=${decks.join(',')}`);
    }, [bluePlayer, redPlayer, baseDeck, pathDeck, windAndPromoDecks]);

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
                    <FormGroup>
                        <Typography variant="h4" className="page--section-header" sx={{ marginTop: '2rem !important' }}>
                            Movement
                        </Typography>
                        <FormControlLabel control={<Checkbox checked={baseDeck} onChange={handleChangeBaseDeck} />} label="Base deck" />
                        <FormControlLabel control={<Checkbox checked={pathDeck} onChange={handleChangePathDeck} />} label="Sensei's Path cards" />
                        <FormControlLabel control={<Checkbox checked={windAndPromoDecks} onChange={handleChangeWindAndPromoDecks} />} label="Way of the Wind + promo cards" />
                    </FormGroup>
                </Box>
                <Box className="page--actions">
                    <Button onClick={handleClickHome} variant="outlined" className="action-button">
                        <Typography>Home</Typography>
                    </Button>
                    <Button onClick={handleClickRules} variant="outlined" className="action-button">
                        <Typography>Rules</Typography>
                    </Button>
                    <Button disabled={!canSubmit} onClick={handleClickStart} variant="contained" className="action-button">
                        <Typography>Start</Typography>
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
