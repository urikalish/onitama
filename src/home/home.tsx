import './home.css';

import { Box, Button, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function Home() {
    const navigate = useNavigate();

    const handleClickPlay = useCallback(() => {
        navigate(`/play`);
    }, []);

    const handleClickRules = useCallback(() => {
        navigate(`/rules`);
    }, []);

    const handleClickAbout = useCallback(() => {
        navigate(`/about`);
    }, []);

    return (
        <Box className="home position--relative page-padding fade-in">
            <Box className="cover" sx={{ opacity: '0.7' }} />
            <Box className="position--absolute" sx={{ inset: '2rem' }}>
                <Box>
                    <img alt="Onitama logo" className="home--onitama-image" src="/img/logo/onitama-pagoda.png" />
                </Box>
                <Box className="action-buttons">
                    <Button onClick={handleClickPlay} variant="contained" className="action-button">
                        <Typography>Play</Typography>
                    </Button>
                    <Button onClick={handleClickRules} variant="outlined" className="action-button">
                        <Typography>Rules</Typography>
                    </Button>
                    <Button onClick={handleClickAbout} variant="outlined" className="action-button">
                        <Typography>About</Typography>
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
