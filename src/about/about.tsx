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
        navigate(`/start`);
    }, []);

    return (
        <Box className="about page">
            <Box className="page-cover" />
            <Box className="page--content-and-actions">
                <Box className="page--content">
                    <Typography variant="h4" className="page--section-header">
                        About
                    </Typography>
                    <Typography variant="body1" className="about--about-text">
                        Onitama is a two-player, perfect information abstract game created in 2014 by game designer Shimpei Sato. It is thematically based on the different fighting
                        styles of Japanese martial arts.
                    </Typography>
                    <Typography variant="h4" className="page--section-header" sx={{ margin: '2rem 0 0.5rem 0' }}>
                        Credits
                    </Typography>
                    <Box className="about--credits-line">
                        <Typography variant="body1" className="about--credits-label">
                            <Box component="span" className="about--credits-label">
                                Game designer:
                            </Box>
                            <Box component="span" className="about--credits-value">
                                Shimpei Sato
                            </Box>
                        </Typography>
                    </Box>
                    <Box className="about--credits-line">
                        <Typography variant="body1" className="about--credits-label">
                            <Box component="span" className="about--credits-label">
                                Web developer:
                            </Box>
                            <Box component="span" className="about--credits-value">
                                Uri Kalish
                            </Box>
                        </Typography>
                    </Box>
                    <Box className="about--credits-line">
                        <Typography variant="body1" className="about--credits-label">
                            <Box component="span" className="about--credits-label">
                                Run-time libs:
                            </Box>
                            <Box component="span" className="about--credits-value">
                                React, MaterialUI
                            </Box>
                        </Typography>
                    </Box>
                    <Box className="about--credits-line">
                        <Typography variant="body1" className="about--credits-label">
                            <Box component="span" className="about--credits-label">
                                Dev libs:
                            </Box>
                            <Box component="span" className="about--credits-value">
                                TypeScript, Vite
                            </Box>
                        </Typography>
                    </Box>
                    <Box className="about--credits-line">
                        <Typography variant="body1" className="about--credits-label">
                            <Box component="span" className="about--credits-label">
                                Image creator:
                            </Box>
                            <Box component="span" className="about--credits-value">
                                Midjourney
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
