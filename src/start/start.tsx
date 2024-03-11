import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, Radio, RadioGroup, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getRandomCardsNames } from '../game/model/card';

export function Start() {
    const [playerTypes, setPLayerTypes] = useState('human,human');
    const [baseDeck, setBaseDeck] = useState(true);
    const [pathDeck, setPathDeck] = useState(true);
    const [windDeck, setWindDeck] = useState(true);
    const [canSubmit, setCanSubmit] = useState(true);
    const navigate = useNavigate();

    const handleChangePlayerTypes = useCallback((event: any) => {
        setPLayerTypes(event.target.value);
    }, []);

    useEffect(() => {
        setCanSubmit(baseDeck || pathDeck || windDeck);
    }, [baseDeck, pathDeck, windDeck]);

    const handleChangeBaseDeck = useCallback((event: any) => {
        setBaseDeck(event.target.checked);
    }, []);

    const handleChangePathDeck = useCallback((event: any) => {
        setPathDeck(event.target.checked);
    }, []);

    const handleChangeWindDeck = useCallback((event: any) => {
        setWindDeck(event.target.checked);
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
        if (windDeck) {
            decks.push('wind');
            decks.push('promo');
        }
        const cardNames = getRandomCardsNames(decks, 5);
        navigate(`/game?players=${playerTypes}&cards=${cardNames.join(',')}`);
    }, [playerTypes, baseDeck, pathDeck, windDeck]);

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
                        <FormControlLabel control={<Checkbox checked={windDeck} onChange={handleChangeWindDeck} />} label="Way of the Wind + promo cards" />
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
