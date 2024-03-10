import './rules.css';

import { Box, Button, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function Rules() {
    const navigate = useNavigate();

    const handleClickHome = useCallback(() => {
        navigate(`/`);
    }, []);

    const handleClickPlay = useCallback(() => {
        navigate(`/start`);
    }, []);

    return (
        <Box className="rules page">
            <Box className="page-cover" />
            <Box className="page--content-and-actions">
                <Box className="page--content">
                    <Typography variant="h4">Rules</Typography>
                    <embed className="rulebook" type="application/pdf" src="/pdf/rulebook.pdf#toolbar=0&statusbar=0&scrollbar=0&navpanes=0" />
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
