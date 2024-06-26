import { Box, Button, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function Home() {
    const navigate = useNavigate();

    const handleClickCredits = useCallback(() => {
        navigate(`/credits`);
    }, []);

    const handleClickRules = useCallback(() => {
        navigate(`/rules`);
    }, []);

    const handleClickPlay = useCallback(() => {
        navigate(`/init`);
    }, []);

    return (
        <Box className="home page">
            <Box className="page-cover" sx={{ opacity: '0.5' }} />
            <Box className="page--content-and-actions">
                <Box className="page--content">
                    <img alt="Onitama logo" className="width--100" src="/img/logo/onitama-pagoda.png" />
                </Box>
                <Box className="page--actions">
                    <Button onClick={handleClickCredits} variant="outlined" className="action-button">
                        <Typography>Credits</Typography>
                    </Button>
                    <Button onClick={handleClickRules} variant="outlined" className="action-button">
                        <Typography>Rules</Typography>
                    </Button>
                    <Button onClick={handleClickPlay} variant="contained" className="action-button">
                        <Typography>Play</Typography>
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
