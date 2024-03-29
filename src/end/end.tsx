import './end.css';

import { Box, Button, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { g, GameResult } from '../game/model/game';

export function End() {
    const [win, setWin] = useState<string>('');
    const [way, setWay] = useState<string>('');

    const navigate = useNavigate();

    useEffect(() => {
        if (!g) {
            navigate('/start');
            return;
        }
        const win = g.results.has(GameResult.WIN_BLUE) ? 'blue' : 'red';
        setWin(win);
        const ways = [];
        if (g.results.has(GameResult.WIN_STONE)) {
            ways.push('stone');
        }
        if (g.results.has(GameResult.WIN_STREAM)) {
            ways.push('stream');
        }
        setWay(ways.join(','));
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
                    <Typography variant="h4" className={`end--title end--title--${win === 'blue' ? 'blue' : 'red'}`}>{`${win === 'blue' ? 'Blue' : 'Red'} Victory!`}</Typography>
                    {way.split(',').includes('stone') && way.split(',').includes('stream') && (
                        <Typography variant="body1" className="end--subtitle">
                            By the Ways of the Stone and the Stream.
                        </Typography>
                    )}
                    {way.split(',').includes('stone') && !way.split(',').includes('stream') && (
                        <Typography variant="body1" className="end--subtitle">
                            By the Way of the Stone.
                        </Typography>
                    )}
                    {!way.split(',').includes('stone') && way.split(',').includes('stream') && (
                        <Typography variant="body1" className="end--subtitle">
                            By the Way of the Stream.
                        </Typography>
                    )}
                    <Box className="end--winner-piece-container">
                        <img alt="Victorious master" className="end--winner-piece" src={`/img/pieces/m${win === 'blue' ? '0' : '1'}.png`} />
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
