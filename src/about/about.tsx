import './about.css';

import { Box, Button, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function About() {
    const navigate = useNavigate();

    const handleClickHome = useCallback(() => {
        navigate(`/`);
    }, []);

    const handleClickPlay = useCallback(() => {
        navigate(`/play`);
    }, []);

    return (
        <Box className="about position--relative page-padding fade-in">
            <Box className="cover" sx={{ opacity: '0.7' }} />
            <Box className="content-and-actions">
                <Box>
                    <Typography variant="h4">About</Typography>
                    <Typography variant="body2" sx={{ color: 'var(--color--gray--light)', marginTop: '0.5rem' }}>
                        Onitama is a two-player, perfect information abstract game created by game designer Shimpei Sato. This digital version was developed by Uri Kalish.
                    </Typography>
                </Box>
                <Box className="action-buttons">
                    <Button onClick={handleClickHome} variant="outlined" className="action-button">
                        <Typography>Home</Typography>
                    </Button>
                    <Button onClick={handleClickPlay} variant="contained" className="action-button">
                        <Typography>Play</Typography>
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
