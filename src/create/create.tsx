import { Box, Button, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function Create() {
    const navigate = useNavigate();

    const handleClickCancel = useCallback(() => {
        navigate(`/start`);
    }, []);

    return (
        <Box className="create page">
            <Box className="page-cover" />
            <Box className="page--content-and-actions">
                <Box className="page--content">
                    <Typography variant="h4" className="page--section-header" sx={{ margin: '2rem 0 0.5rem 0' }}>
                        Create Game
                    </Typography>
                </Box>
                <Box className="page--actions">
                    <Button onClick={handleClickCancel} variant="outlined" className="action-button">
                        <Typography>Cancel</Typography>
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
