import './game.css';

import { Box } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Progress } from '../../progress/progress';
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
        const opponent: string = queryParams.get('opponent') || 'human';
        const strength: number = Number(queryParams.get('strength') || '0');
        const cardNames = (queryParams.get('cards') || '').split(',');
        const game = new Game(
            'Blue Player',
            PlayerType.HUMAN,
            0,
            opponent === 'human' ? 'Red Player' : 'Red Bot',
            opponent === 'human' ? PlayerType.HUMAN : PlayerType.BOT,
            opponent === 'human' ? 0 : strength,
            cardNames,
        );
        game.startGame(Date.now());
        setG(game);
        setPosition(game.getCurPosition());
    }, []);

    const goMove = useCallback(
        (cardName: string, from: number, to: number) => {
            const m = allPossibleMoves.filter((m) => m.cardName === cardName && m.from === from && m.to === to)[0];
            g!.move(m);
            setPosition(g!.getCurPosition());
        },
        [g, allPossibleMoves],
    );

    useEffect(() => {
        if (!g) {
            return;
        }
        setCardPossibleMoves([]);
        if (g!.isGameEnded()) {
            //setAllPossibleMoves([]);
            setTimeout(() => {
                navigate(`/end?win=${g!.results.has(GameResult.WIN_BLUE) ? 'blue' : 'red'}&way=${g!.results.has(GameResult.WIN_STONE) ? 'stone' : 'stream'}`);
            }, 2000);
            return;
        }
        setAllPossibleMoves(g!.possibleMoves);
        if (g!.isBotTurn()) {
            setTimeout(() => {
                (async () => {
                    const m = await g!.getBotMove();
                    goMove(m.cardName, m.from, m.to);
                })();
            }, 500);
        }
    }, [g, position, goMove]);

    const handleSelectCard = useCallback(
        (cardName: string) => {
            const moves = allPossibleMoves.filter((m) => m.cardName === cardName);
            if (moves.length === 1 && moves[0].types.has(MoveType.PASS_CARD_ONLY)) {
                goMove(moves[0].cardName, moves[0].from, moves[0].to);
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
                <CoverUI opacity={0.3} />
                <Box className="game-content">
                    <Progress />
                    <Box className="game--main">
                        <BoardUI b={g.board} cardPossibleMoves={cardPossibleMoves} onSelectMove={handleSelectMove} />
                        {g!.isGameGoing() && <HandsUi p={position} allPossibleMoves={allPossibleMoves} onSelectCard={handleSelectCard} />}
                    </Box>
                    {(g?.isGameEnded() || g?.isBotTurn()) && <Box className="game-over-cover" />}
                </Box>
            </Box>
        )
    );
}
