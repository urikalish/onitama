import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, Radio, RadioGroup, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getRandomCardsNames } from '../game/model/card';

const LOCAL_STORAGE_KEY_PLAYER_TYPES = 'playerTypes';
const LOCAL_STORAGE_KEY_DECK_NAMES = 'deckNames';

export function Start() {
    const [playerTypes, setPLayerTypes] = useState('human,human');
    const [baseDeck, setBaseDeck] = useState(true);
    const [pathDeck, setPathDeck] = useState(true);
    const [windAndPromoDecks, setWindAndPromoDecks] = useState(true);
    const [canSubmit, setCanSubmit] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let value;
        value = localStorage.getItem(LOCAL_STORAGE_KEY_PLAYER_TYPES);
        if (value) {
            setPLayerTypes(value);
        }
        value = localStorage.getItem(LOCAL_STORAGE_KEY_DECK_NAMES);
        if (value) {
            const deckNames = value.split(',');
            setBaseDeck(deckNames.includes('base'));
            setPathDeck(deckNames.includes('path'));
            setWindAndPromoDecks(deckNames.includes('wind') && deckNames.includes('promo'));
        }
    }, []);

    const handleChangePlayerTypes = useCallback((event: any) => {
        setPLayerTypes(event.target.value);
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
        localStorage.setItem(LOCAL_STORAGE_KEY_PLAYER_TYPES, playerTypes);
        localStorage.setItem(LOCAL_STORAGE_KEY_DECK_NAMES, decks.join(','));
        const cardNames = getRandomCardsNames(decks, 5);
        navigate(`/game?players=${playerTypes}&cards=${cardNames.join(',')}`);
    }, [playerTypes, baseDeck, pathDeck, windAndPromoDecks]);

    return (
        <Box className="start page">
            <Box className="page-cover" />
            <Box className="page--content-and-actions">
                <Box className="page--content">
                    <Typography variant="h4">Players</Typography>
                    <FormControl>
                        <RadioGroup value={playerTypes} onChange={handleChangePlayerTypes} name="players-radio-buttons-group">
                            <FormControlLabel value="human,human" control={<Radio />} label="Human vs. human" />
                            <FormControlLabel value="human,bot" control={<Radio />} label="Human vs. bot" />
                        </RadioGroup>
                    </FormControl>
                    <Typography variant="h4" sx={{ marginTop: '2rem' }}>
                        Movement
                    </Typography>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox checked={baseDeck} onChange={handleChangeBaseDeck} />} label="Base deck" />
                        <FormControlLabel control={<Checkbox checked={pathDeck} onChange={handleChangePathDeck} />} label="Sensei's Path cards" />
                        <FormControlLabel control={<Checkbox checked={windAndPromoDecks} onChange={handleChangeWindAndPromoDecks} />} label="Way of the Wind + promo cards" />
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
