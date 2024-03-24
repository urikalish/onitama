import './start.css';

import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, Radio, RadioGroup, Slider, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getRandomCardsNames } from '../game/model/card';

const LOCAL_STORAGE_SETTINGS_KEY = 'onitama';
const GAME_TYPE = 'gameType';
const GAME_TYPE_1_PLAYER = '1-player';
const GAME_TYPE_2_PLAYERS = '2-players';
const BOT_STRENGTH = 'botStrength';
const DECK_NAMES = 'deckNames';

const MIN_BOT_STRENGTH = 2;
const MAX_BOT_STRENGTH = 5;

export function Start() {
    const [gameType, setGameType] = useState('1-player');
    const [botStrength, setBotStrength] = useState(MAX_BOT_STRENGTH);
    const [baseDeck, setBaseDeck] = useState(true);
    const [pathDeck, setPathDeck] = useState(true);
    const [windAndPromoDecks, setWindAndPromoDecks] = useState(true);
    const [canSubmit, setCanSubmit] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY) || '{}');
        let value;
        value = settings[GAME_TYPE];
        if (value) {
            setGameType(value);
        }
        value = settings[BOT_STRENGTH];
        if (value) {
            setBotStrength(Math.max(Math.min(Number(value), MAX_BOT_STRENGTH), MIN_BOT_STRENGTH));
        }
        value = settings[DECK_NAMES];
        if (value) {
            const deckNames = value.split(',');
            setBaseDeck(deckNames.includes('base'));
            setPathDeck(deckNames.includes('path'));
            setWindAndPromoDecks(deckNames.includes('wind') && deckNames.includes('promo'));
        }
    }, []);

    const handleChangeOpponentType = useCallback((event: any) => {
        setGameType(event.target.value);
    }, []);

    const handleChangeBotStrength = useCallback((event: any) => {
        setBotStrength(event.target.value);
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
        const cardNames = getRandomCardsNames(decks, 5);
        const settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY) || '{}');
        settings[GAME_TYPE] = gameType;
        settings[BOT_STRENGTH] = botStrength.toString();
        settings[DECK_NAMES] = decks.join(',');
        localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
        if (gameType === GAME_TYPE_1_PLAYER) {
            navigate(`/game?players=human,bot&strengths=0,${botStrength}&cards=${cardNames.join(',')}`);
        } else {
            navigate(`/game?players=human,human&cards=${cardNames.join(',')}`);
        }
    }, [gameType, botStrength, baseDeck, pathDeck, windAndPromoDecks]);

    return (
        <Box className="start page">
            <Box className="page-cover" />
            <Box className="page--content-and-actions">
                <Box className="page--content">
                    <FormGroup>
                        <Typography variant="h4" className="page--section-header">
                            Players
                        </Typography>
                        <FormControl className="start--players">
                            <RadioGroup value={gameType} onChange={handleChangeOpponentType} name="start--players-type-radio-group">
                                <FormControlLabel value={GAME_TYPE_1_PLAYER} control={<Radio />} label="1 player" />
                                <FormControlLabel value={GAME_TYPE_2_PLAYERS} control={<Radio />} label="2 players" />
                            </RadioGroup>
                            <Box className={`start--bot-level ${gameType === GAME_TYPE_1_PLAYER} ? '' : 'hidden'}`}>
                                <Typography variant="body2" className="start--bot-level-slider-label">
                                    Easy
                                </Typography>
                                <Slider
                                    value={botStrength}
                                    step={1}
                                    marks
                                    min={MIN_BOT_STRENGTH}
                                    max={MAX_BOT_STRENGTH}
                                    disabled={gameType === GAME_TYPE_2_PLAYERS}
                                    onChange={handleChangeBotStrength}
                                    className="start--bot-level-slider"
                                />
                                <Typography variant="body2" className="start--bot-level-slider-label">
                                    Hard
                                </Typography>
                            </Box>
                        </FormControl>
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
