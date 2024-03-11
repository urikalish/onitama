import './game.css';

import { Box } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Footer } from '../../footer/footer';
import { Game, GameResult } from '../model/game';
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
        const playerTypes: string[] = (queryParams.get('players') || '').split(',');
        const cardNames = (queryParams.get('cards') || '').split(',');
        const game = new Game(
            playerTypes[0] === 'human' ? PlayerType.HUMAN : PlayerType.BOT,
            `Blue ${playerTypes[0] === 'human' ? 'player' : 'bot'}`,
            playerTypes[1] === 'human' ? PlayerType.HUMAN : PlayerType.BOT,
            `Red ${playerTypes[1] === 'human' ? 'player' : 'bot'}`,
            cardNames,
        );
        game.startGame(Date.now());
        setG(game);
        setPosition(game.getCurPosition());
    }, []);

    useEffect(() => {
        if (!g) {
            return;
        }
        setCardPossibleMoves([]);
        if (g!.isGameEnded()) {
            setAllPossibleMoves([]);
            setTimeout(() => {
                navigate(`/end?win=${g!.results.has(GameResult.WIN_BLUE) ? 'blue' : 'red'}&way=${g!.results.has(GameResult.WIN_STONE) ? 'stone' : 'stream'}`);
            }, 2000);
            return;
        }
        setAllPossibleMoves(g!.possibleMoves);
    }, [g, position]);

    const goMove = useCallback(
        (cardName: string, from: number, to: number) => {
            const m = allPossibleMoves.filter((m) => m.cardName === cardName && m.from === from && m.to === to)[0];
            g!.move(m);
            setPosition(g!.getCurPosition());
        },
        [g, allPossibleMoves],
    );

    const handleSelectCard = useCallback(
        (cardName: string) => {
            const moves = allPossibleMoves.filter((m) => m.cardName === cardName);
            if (moves.length === 1 && moves[0].types.has(MoveType.PASS_CARD_ONLY)) {
                const m = moves[0];
                goMove(m.cardName, m.from, m.to);
            } else {
                setCardPossibleMoves(moves);
            }
        },
        [g, allPossibleMoves, goMove],
    );

    const handleSelectMove = useCallback(
        (from: number, to: number) => {
            const m = cardPossibleMoves.find((m) => m.from === from && m.to === to);
            goMove(m!.cardName, m!.from, m!.to);
        },
        [g, cardPossibleMoves, goMove],
    );

    return (
        g && (
            <Box className="game position--relative fade-in">
                <CoverUI opacity={0.4} />
                <Box className="game-content">
                    <Box className="game--main">
                        <BoardUI b={g.board} cardPossibleMoves={cardPossibleMoves} onSelectMove={handleSelectMove} />
                        <HandsUi p={position} allPossibleMoves={allPossibleMoves} onSelectCard={handleSelectCard} />
                    </Box>
                    {g?.isGameEnded() && <Box className="game-over-cover" />}
                    <Footer />
                </Box>
            </Box>
        )
    );
}
