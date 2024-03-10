import './home.css';

import { Box, Button, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function Home() {
    const navigate = useNavigate();

    const handleClickPlay = useCallback(() => {
        navigate(`/play`);
    }, []);

    return (
        <Box className="home position--relative fade-in">
            <Box className="cover" sx={{ opacity: '0.7' }} />
            <Box className="position--absolute" sx={{ inset: '2rem' }}>
                <Typography variant="h4">About</Typography>
                <Typography variant="body2" sx={{ color: 'var(--color--gray--light)', marginTop: '0.5rem' }}>
                    Onitama is a two-player, perfect information abstract game created in 2014 by game designer Shimpei Sato. This digital version was developed by Uri Kalish in
                    2024.
                </Typography>
                <Button onClick={handleClickPlay} variant="outlined" className="home--play-button">
                    <Typography>Play</Typography>
                </Button>
            </Box>
        </Box>
    );
}
