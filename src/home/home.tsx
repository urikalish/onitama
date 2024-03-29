import { Box, Button, Typography } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { goTest } from '../game/model/test';

export function Home() {
    const queryParams = new URLSearchParams(location.search);
    const [test] = useState(queryParams.get('mode') === 'test');
    const navigate = useNavigate();

    const handleClickCredits = useCallback(() => {
        navigate(`/credits`);
    }, []);

    const handleClickRules = useCallback(() => {
        navigate(`/rules`);
    }, []);

    const handleClickTest = useCallback(() => {
        goTest().then(() => {});
    }, []);

    const handleClickPlay = useCallback(() => {
        navigate(`/start`);
    }, []);

    return (
        <Box className="home page">
            <Box className="page-cover" sx={{ opacity: '0.5' }} />
            <Box className="page--content-and-actions">
                <Box className="page--content">
                    <img alt="Onitama logo" className="width--100" src="/img/logo/onitama-pagoda.png" />
                </Box>
                <Box className="page--actions">
                    {!test && (
                        <Button onClick={handleClickCredits} variant="outlined" className="action-button">
                            <Typography>Credits</Typography>
                        </Button>
                    )}
                    {!test && (
                    <Button onClick={handleClickRules} variant="outlined" className="action-button">
                        <Typography>Rules</Typography>
                    </Button>
                    )}
                    {!test && (
                        <Button onClick={handleClickPlay} variant="contained" className="action-button">
                            <Typography>Play</Typography>
                        </Button>
                    )}
                    {test && (
                        <Button onClick={handleClickTest} variant="contained" className="action-button">
                            <Typography>Test</Typography>
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
