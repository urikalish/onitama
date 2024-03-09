import './game.css';

import { Box } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Footer } from '../../footer/footer';
import { Game } from '../model/game';
import { Move, MoveType } from '../model/move';
import { PlayerType } from '../model/player';
import { Position } from '../model/position';
import { BoardUI } from './board-ui';
import { CoverUI } from './cover-ui';
import { HandsUi } from './hands-ui';

export function GameUI() {
    const [g, setG] = useState<Game | null>(null);
    const [position, setPosition] = useState<Position | null>(null);
    const [allPossibleMoves, setAllPossibleMoves] = useState<Move[]>([]);
    const [cardPossibleMoves, setCardPossibleMoves] = useState<Move[]>([]);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const decks = (queryParams.get('decks') || 'base').split(',');
        const game = new Game(PlayerType.HUMAN, 'Blue player', PlayerType.HUMAN, 'Red player', decks);
        game.startGame(Date.now());
        setG(game);
    }, []);

    useEffect(() => {
        if (!g) {
            return;
        }
        setPosition(g!.getCurPosition());
    }, [g]);

    useEffect(() => {
        if (!g) {
            return;
        }
        setAllPossibleMoves(g!.possibleMoves);
        setCardPossibleMoves([]);
    }, [position]);

    const handleSelectCard = useCallback(
        (cardName: string) => {
            const moves = allPossibleMoves.filter((m) => m.cardName === cardName);
            if (moves.length === 1 && moves[0].types.has(MoveType.PASS_CARD_ONLY)) {
                g!.move(moves[0]);
                setPosition(g!.getCurPosition());
            } else {
                setCardPossibleMoves(moves);
            }
        },
        [g, allPossibleMoves],
    );

    const handleSelectMove = useCallback(
        (from: number, to: number) => {
            const move = cardPossibleMoves.find((m) => m.from === from && m.to === to);
            g!.move(move);
            setPosition(g!.getCurPosition());
            if (g!.isGameEnded()) {
                setTimeout(() => {
                    alert(g!.resultStr);
                    navigate('/');
                }, 2000);
            }
        },
        [g, cardPossibleMoves],
    );

    return (
        g && (
            <Box className="game position--relative">
                <CoverUI opacity={0.3} />
                <Box sx={{ position: 'absolute', inset: '0', display: 'grid', justifyContent: 'center' }}>
                    <Box className="main">
                        <BoardUI b={g.board} cardPossibleMoves={cardPossibleMoves} onSelectMove={handleSelectMove} />
                        <HandsUi p={position} allPossibleMoves={allPossibleMoves} onSelectCard={handleSelectCard} />
                    </Box>
                    {g?.isGameEnded() && <Box className="game-cover" />}
                    <Footer />
                </Box>
            </Box>
        )
    );
}
