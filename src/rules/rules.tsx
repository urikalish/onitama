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
                    <Box className="rules-container">
                        <Typography variant="h4">Rules</Typography>
                        <Typography variant="h5" className="rules-section-header">
                            Initial Setup
                        </Typography>
                        <Typography variant="body1">
                            At the beginning of each game, a set of five cards is randomly selected from a total of 40 available movement cards, and one of the players is randomly
                            chosen to go first.
                            <br />
                            Each player starts with five pawns: one master and four students.
                        </Typography>
                        <Typography variant="h5" className="rules-section-header">
                            Movement and Attack
                        </Typography>
                        <Typography variant="body1">
                            This is a turn-based game.
                            <br />
                            On your turn, choose one of your two active cards, and move one of your pawns according to the grid drawn on the card. The colored square in the middle
                            represents the space your chosen pawn currently occupies, and the light squares indicate where your pawn can move, relative to its starting position.
                            <br />
                            Your pawn can jump over any other pawn, provided it does not land off the board or on one of your own pieces. If your pawn moves onto a square occupied
                            by one of your opponent’s pawns, the opponent’s pawn is captured and removed from the game.
                            <br />
                            After your move, your selected card will flip and go to your opponent but will become usable only in the next round.
                            <br />
                            If you have a legal move, you must take it - even if you do not want to. If you have no legal moves, simply choose a card to pass on to your opponent.
                        </Typography>
                        <Typography variant="h5" className="rules-section-header">
                            Game End
                        </Typography>
                        <Typography variant="body1">
                            There are two ways to win the game.
                            <br />
                            To win in the Way of the Stone, you must capture your opponent’s Master pawn.
                            <br />
                            To win in the Way of the Stream, you must move your own Master pawn into your opponent’s blue or red Torii gate square.
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
