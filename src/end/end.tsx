import './end.css';

import { Box, Button, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function End() {
    const [win, setWin] = useState<string>('');
    const [way, setWay] = useState<string>('');

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setWin(queryParams.get('win') || '');
        setWay(queryParams.get('way') || '');
    }, []);

    const handleClickHome = useCallback(() => {
        navigate(`/`);
    }, []);

    const handleClickPlay = useCallback(() => {
        navigate(`/start`);
    }, []);

    return (
        <Box className="end page">
            <Box className="page-cover" />
            <Box className="page--content-and-actions">
                <Box className="page--content">
                    <Typography variant="h4">Victory!</Typography>
                    <Typography variant="body1" sx={{ color: 'var(--color--gray--light)' }}>
                        By the way of the {way === 'stone' ? 'stone' : 'stream'}.
                    </Typography>
                    <Box className="end--winner-piece-container">
                        <Box className="piece end--winner-piece" data-name={`m${win === 'blue' ? '0' : '1'}2`} />
                    </Box>
                </Box>
                <Box className="page--actions">
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
