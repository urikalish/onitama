import './create.css';

import { Box, Button, Typography } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fbCreateGame, fbDeleteGame, fbWaitForStatusChange, initFirebaseApp } from '../firebase/firebase';
import { get5RandomCardsNames, getStartingColor } from '../game/model/card';
import { Color } from '../game/model/color';
import { getInitialFenStr } from '../game/model/fen';
import { g, Game, GameStatus, setG } from '../game/model/game';
import { PlayerType } from '../game/model/player';
import { handleProgressCallback } from '../game/ui/game-ui';
import { AnalyticsAction, AnalyticsCategory, sendAnalyticsEvent } from '../services/analytics';
import { getRandomNumber } from '../services/utils';

export function Create() {
    const initialized = useRef(false);
    const [gameId, setGameId] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (initialized.current) {
            return;
        }
        const gameId = getRandomNumber(5);
        const playerNames: string[] = ['local', 'remote'];
        const playerTypes: PlayerType[] = [PlayerType.LOCAL, PlayerType.REMOTE];
        const cardNames: string[] = get5RandomCardsNames(['base', 'path', 'wind', 'promo']);
        const cardNames0: string[] = [cardNames[0], cardNames[1]];
        const cardNames1: string[] = [cardNames[2], cardNames[3]];
        if (getStartingColor(cardNames[4]) === Color.BLUE) {
            cardNames0.push(cardNames[4]);
        } else {
            cardNames1.push(cardNames[4]);
        }
        const fenStr = getInitialFenStr(cardNames0, cardNames1);
        setG(new Game(gameId, playerNames[0], playerTypes[0], playerNames[1], playerTypes[1], fenStr, handleProgressCallback));
        setGameId(g!.id);
        g!.status = GameStatus.JOINING;
        initFirebaseApp();
        fbCreateGame(g!).then(() => {});
        fbWaitForStatusChange(g!.id, (status: string) => {
            if (status === GameStatus.STARTED) {
                g!.startGame();
                sendAnalyticsEvent(AnalyticsCategory.GAME_PHASE, AnalyticsAction.GAME_PHASE_GAME_STARTED);
                sendAnalyticsEvent(AnalyticsCategory.PLAYERS, 'local vs remote');
                navigate('/game');
            }
        });
        initialized.current = true;
    }, []);

    const handleClickCancel = useCallback(() => {
        fbDeleteGame(gameId);
        navigate(`/init`);
    }, [gameId]);

    return (
        <Box className="create page">
            <Box className="page-cover" />
            <Box className="page--content-and-actions">
                <Box className="page--content">
                    <Typography variant="h4" className="page--section-header" sx={{ margin: '2rem 0 0.5rem 0' }}>
                        Create Game
                    </Typography>
                    {gameId && (
                        <>
                            <Typography variant="body1" className="create--text">
                                The game was created successfully and will start automatically when the remote player joins. Please ask the other player to join the game using this
                                ID:
                            </Typography>
                            <Typography variant="h3" className="create--id">
                                {gameId}
                            </Typography>
                            <Typography variant="body1" className="create--text">
                                Waiting...
                            </Typography>
                        </>
                    )}
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
