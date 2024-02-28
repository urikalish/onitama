import { Box, Button, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Home() {
    const [baseDeck, setBaseDeck] = useState(true);
    const [pathDeck, setPathDeck] = useState(false);
    const [windDeck, setWindDeck] = useState(false);
    const [canSubmit, setCanSubmit] = useState(true);
    const navigate = useNavigate();

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
        if (decks.length > 0) {
            navigate(`/game?decks=${decks.join(',')}`);
        }
    }, [baseDeck, pathDeck, windDeck]);

    return (
        <Box className="home" sx={{ padding: '2rem' }}>
            {/*<Box>*/}
            {/*    <NavLink to="/tags?mode=air" className="link">*/}
            {/*        <Button variant="outlined" sx={{ width: '12rem' }}>*/}
            {/*            <Typography>חידון תגי זרוע האוויר</Typography>*/}
            {/*        </Button>*/}
            {/*    </NavLink>*/}
            {/*</Box>*/}
            {/*<Box sx={{ marginTop: '1rem' }}>*/}
            {/*    <NavLink to="/tags?mode=land" className="link">*/}
            {/*        <Button variant="outlined" sx={{ width: '12rem' }}>*/}
            {/*            <Typography>חידון תגי זרוע היבשה</Typography>*/}
            {/*        </Button>*/}
            {/*    </NavLink>*/}
            {/*</Box>*/}
            {/*<Box sx={{ marginTop: '1rem' }}>*/}
            {/*    <NavLink to="/tags?mode=all" className="link">*/}
            {/*        <Button variant="outlined" sx={{ width: '12rem' }}>*/}
            {/*            <Typography>חידון תגי אוויר ויבשה</Typography>*/}
            {/*        </Button>*/}
            {/*    </NavLink>*/}
            {/*</Box>*/}
            <Typography variant="h4">About Onitama</Typography>
            <Typography variant="body2" sx={{ color: 'var(--color--gray--light)', marginTop: '0.5rem' }}>
                Onitama is a two-player, perfect information abstract game created in 2014 by game designer Shimpei Sato. It is thematically based on the different fighting styles
                of Japanese martial arts.
            </Typography>
            <Typography variant="h4" sx={{ marginTop: '2rem' }}>
                Movement Cards
            </Typography>
            <FormGroup>
                <FormControlLabel control={<Checkbox checked={baseDeck} onChange={handleChangeBaseDeck} disabled />} label="Base deck" />
                <FormControlLabel control={<Checkbox checked={pathDeck} onChange={handleChangePathDeck} />} label="Sensei's Path cards" />
                <FormControlLabel control={<Checkbox checked={windDeck} onChange={handleChangeWindDeck} />} label="Way of the Wind + promo cards" />
            </FormGroup>
            <Button disabled={!canSubmit} onClick={handleClickStart} variant="outlined" sx={{ marginTop: '2rem', width: '12rem' }}>
                <Typography>Start Game</Typography>
            </Button>
        </Box>
    );
}
