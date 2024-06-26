import './credits.css';

import { Box, Button, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export function Credits() {
    const navigate = useNavigate();

    const handleClickHome = useCallback(() => {
        navigate(`/`);
    }, []);

    const handleClickPlay = useCallback(() => {
        navigate(`/init`);
    }, []);

    return (
        <Box className="credits page">
            <Box className="page-cover" />
            <Box className="page--content-and-actions">
                <Box className="page--content">
                    <Typography variant="h4" className="page--section-header" sx={{ margin: '2rem 0 0.5rem 0' }}>
                        Credits
                    </Typography>
                    <Box className="credits--line">
                        <Typography variant="body1" className="credits--label">
                            <Box component="span" className="credits--label">
                                Game Designer -
                            </Box>
                            <Box component="span" className="credits--value">
                                Shimpei Sato, 2014
                            </Box>
                        </Typography>
                    </Box>
                    <Box className="credits--line">
                        <Typography variant="body1" className="credits--label">
                            <Box component="span" className="credits--label">
                                Web Developer -
                            </Box>
                            <Box component="span" className="credits--value">
                                Uri Kalish, 2024
                            </Box>
                        </Typography>
                    </Box>
                    <Box className="credits--line">
                        <Typography variant="body1" className="credits--label">
                            <Box component="span" className="credits--label">
                                Dev Libs -
                            </Box>
                            <Box component="span" className="credits--value">
                                TypeScript, Vite
                            </Box>
                        </Typography>
                    </Box>
                    <Box className="credits--line">
                        <Typography variant="body1" className="credits--label">
                            <Box component="span" className="credits--label">
                                RT Libs -
                            </Box>
                            <Box component="span" className="credits--value">
                                React, Material, Comlink
                            </Box>
                        </Typography>
                    </Box>
                    <Box className="credits--line">
                        <Typography variant="body1" className="credits--label">
                            <Box component="span" className="credits--label">
                                DB -
                            </Box>
                            <Box component="span" className="credits--value">
                                Firebase
                            </Box>
                        </Typography>
                    </Box>
                    <Box className="credits--line">
                        <Typography variant="body1" className="credits--label">
                            <Box component="span" className="credits--label">
                                Images -
                            </Box>
                            <Box component="span" className="credits--value">
                                Midjourney
                            </Box>
                        </Typography>
                    </Box>
                    <Box className="credits--line">
                        <Typography variant="body1" className="credits--label">
                            <Box component="span" className="credits--label">
                                Music -
                            </Box>
                            <Box component="span" className="credits--value">
                                Triple7Music
                            </Box>
                        </Typography>
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
