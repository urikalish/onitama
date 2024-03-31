import './admin.css';

import { Box, Button, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { fbDeleteAllOldGames } from '../firebase/firebase';
import { goTest } from '../game/model/test';

export function Admin() {
    const navigate = useNavigate();

    const handleClickDeleteOldGames = useCallback(() => {
        fbDeleteAllOldGames(1000 * 3600 * 24);
    }, []);

    const handleClickTestBots = useCallback(() => {
        goTest().then(() => {});
    }, []);

    const handleClickHome = useCallback(() => {
        navigate(`/`);
    }, []);

    return (
        <Box className="admin page">
            <Box className="page-cover" sx={{ opacity: '0.5' }} />
            <Box className="page--content-and-actions">
                <Box className="page--content">
                    <Box>
                        <Button onClick={handleClickDeleteOldGames} variant="contained" className="admin--button">
                            <Typography>Delete Old Games</Typography>
                        </Button>
                    </Box>
                    <Box>
                        <Button onClick={handleClickTestBots} variant="contained" className="admin--button">
                            <Typography>Test Bots</Typography>
                        </Button>
                    </Box>
                </Box>
                <Box className="page--actions">
                    <Button onClick={handleClickHome} variant="outlined" className="action-button">
                        <Typography>Home</Typography>
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
