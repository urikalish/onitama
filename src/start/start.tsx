import './start.css';

import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, Radio, RadioGroup, Slider, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getRandomCardsNames } from '../game/model/card';

const LOCAL_STORAGE_SETTINGS_KEY = 'onitamaSettings';
const OPPONENT_TYPE = 'opponentType';
const BOT_STRENGTH = 'botStrength';
const DECK_NAMES = 'deckNames';

const MIN_BOT_STRENGTH = 2;
const MAX_BOT_STRENGTH = 6;

export function Start() {
    const [opponentType, setOpponentType] = useState('human');
    const [botStrength, setBotStrength] = useState(MIN_BOT_STRENGTH);
    const [baseDeck, setBaseDeck] = useState(true);
    const [pathDeck, setPathDeck] = useState(false);
    const [windAndPromoDecks, setWindAndPromoDecks] = useState(false);
    const [canSubmit, setCanSubmit] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY) || '{}');
        let value;
        value = settings[OPPONENT_TYPE];
        if (value) {
            setOpponentType(value);
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
        setOpponentType(event.target.value);
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
        const audioElm = document.getElementById('musicPlayer');
        if (audioElm) {
            (audioElm as HTMLAudioElement).play().then(() => {});
        }
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
        settings[OPPONENT_TYPE] = opponentType;
        settings[BOT_STRENGTH] = botStrength.toString();
        settings[DECK_NAMES] = decks.join(',');
        localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
        const botStrengthParam = opponentType === 'bot' ? `&strength=${botStrength}` : '';
        navigate(`/game?opponent=${opponentType}${botStrengthParam}&cards=${cardNames.join(',')}`);
    }, [opponentType, botStrength, baseDeck, pathDeck, windAndPromoDecks]);

    return (
        <Box className="start page">
            <Box className="page-cover" />
            <Box className="page--content-and-actions">
                <Box className="page--content">
                    <FormGroup>
                        <Typography variant="h4" className="page--section-header">
                            Opponent
                        </Typography>
                        <FormControl>
                            <RadioGroup value={opponentType} onChange={handleChangeOpponentType} name="opponent-type-radio-group">
                                <FormControlLabel value="human" control={<Radio />} label="Human" />
                                <FormControlLabel value="bot" control={<Radio />} label="Bot" />
                            </RadioGroup>
                            <Box className={`start--bot-level ${opponentType === 'bot' ? '' : 'hidden'}`}>
                                <Typography variant="body2" className="start--bot-level-slider-label">
                                    Easy
                                </Typography>
                                <Slider
                                    value={botStrength}
                                    step={1}
                                    marks
                                    min={MIN_BOT_STRENGTH}
                                    max={MAX_BOT_STRENGTH}
                                    disabled={opponentType !== 'bot'}
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
