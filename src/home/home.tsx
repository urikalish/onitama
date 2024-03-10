import { Box, Button, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function Home() {
    const navigate = useNavigate();

    const handleClickAbout = useCallback(() => {
        navigate(`/about`);
    }, []);

    const handleClickRules = useCallback(() => {
        navigate(`/rules`);
    }, []);

    const handleClickPlay = useCallback(() => {
        navigate(`/play`);
    }, []);

    return (
        <Box className="home page">
            <Box className="page-cover" />
            <Box className="page--content-and-actions">
                <Box className="page--content">
                    <img alt="Onitama logo" className="width--100" src="/img/logo/onitama-pagoda.png" />
                </Box>
                <Box className="page--actions">
                    <Button onClick={handleClickAbout} variant="outlined" className="action-button">
                        <Typography>About</Typography>
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
