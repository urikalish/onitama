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

    return (
        <Box className="home position--relative page-padding fade-in">
            <Box className="cover" sx={{ opacity: '0.7' }} />
            <Box className="position--absolute" sx={{ inset: '2rem' }}>
                <Typography variant="h4">About</Typography>
                <Typography variant="body2" sx={{ color: 'var(--color--gray--light)', marginTop: '0.5rem' }}>
                    Onitama is a two-player, perfect information abstract game created by game designer Shimpei Sato. This digital version was developed by Uri Kalish.
                </Typography>
                <Box className="action-buttons">
                    <Button onClick={handleClickPlay} variant="contained" className="action-button">
                        <Typography>Play</Typography>
                    </Button>
                    <Button onClick={handleClickRules} variant="outlined" className="action-button">
                        <Typography>Rules</Typography>
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
