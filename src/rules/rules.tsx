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
        navigate(`/init`);
    }, []);

    return (
        <Box className="rules page">
            <Box className="page-cover" />
            <Box className="page--content-and-actions">
                <Box className="page--content">
                    <Box className="rules-container">
                        <Typography variant="h4" className="page--section-header">
                            About Onitama
                        </Typography>
                        <Typography variant="body1" className="page--section-text">
                            Onitama is a two-player, perfect information abstract game created in 2014 by game designer Shimpei Sato. It is thematically based on the different
                            fighting styles of Japanese martial arts.
                        </Typography>
                        <Typography variant="h4" className="page--section-header">
                            Initial Setup
                        </Typography>
                        <Typography variant="body1" className="page--section-text">
                            At the beginning of each game, a set of five cards is randomly selected from a total of 40 available movement cards, and one of the players is randomly
                            chosen to go first. Each player starts with five pawns: one Master and four students.
                        </Typography>
                        <Typography variant="h4" className="page--section-header">
                            Move & Attack
                        </Typography>
                        <Typography variant="body1" className="page--section-text">
                            This is a turn-based game. On your turn, choose one of your two active cards, and move one of your pawns according to the grid drawn on the card. The
                            colored square in the middle represents the space your chosen pawn currently occupies, and the light squares indicate where your pawn can move, relative
                            to its starting position. Your pawn can jump over any other pawn, provided it does not land off the board or on one of your own pieces. If your pawn
                            moves onto a square occupied by one of your opponent’s pawns, the opponent’s pawn is captured and removed from the game. After your move, your selected
                            card will go to your opponent and flip, but will become usable only in the next round. If you have a legal move, you must take it - even if you do not
                            want to. If you have no legal moves, simply choose a card to pass on to your opponent.
                        </Typography>
                        <Typography variant="h4" className="page--section-header">
                            Game End
                        </Typography>
                        <Typography variant="body1" className="page--section-text">
                            There are two ways to win the game. To win in the Way of the Stone, you must capture your opponent’s Master pawn. To win in the Way of the Stream, you
                            must move your own Master pawn into your opponent’s blue or red Torii gate square.
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
