import './game.css';

import { Box } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Progress } from '../../progress/progress';
import { AnalyticsAction, AnalyticsCategory, sendAnalyticsEvent } from '../../services/analytics';
import { Game, GameResult } from '../model/game';
import { Move, MoveType } from '../model/move';
import { PlayerType } from '../model/player';
import { Position } from '../model/position';
import { BoardUI } from './board-ui';
import { CoverUI } from './cover-ui';
import { HandsUi } from './hands-ui';

export function GameUI() {
    const g = useRef<Game | null>(null);
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
        const isSinglePlayer = opponent === 'bot';
        const game = new Game(
            'Blue Player',
            PlayerType.HUMAN,
            0,
            isSinglePlayer ? 'Red Bot' : 'Red Player',
            isSinglePlayer ? PlayerType.BOT : PlayerType.HUMAN,
            isSinglePlayer ? strength : 0,
            cardNames,
        );
        game.startGame(Date.now());
        g.current = game;
        setPosition(game.getCurPosition());
        sendAnalyticsEvent(AnalyticsCategory.GAME_PHASE, AnalyticsAction.GAME_PHASE_GAME_STARTED);
        sendAnalyticsEvent(AnalyticsCategory.GAME_TYPE, isSinglePlayer ? AnalyticsAction.GAME_TYPE_1_PLAYER : AnalyticsAction.GAME_TYPE_2_PLAYERS);
    }, []);

    useEffect(() => {
        if (!g.current) {
            return;
        }
        if (g.current.isGameGoing()) {
            setAllPossibleMoves(g.current.possibleMoves);
            setCardPossibleMoves([]);
        } else {
            sendAnalyticsEvent(AnalyticsCategory.GAME_PHASE, AnalyticsAction.GAME_PHASE_GAME_ENDED);
            if (g.current?.players[1].type === PlayerType.BOT) {
                sendAnalyticsEvent(
                    AnalyticsCategory.GAME_RESULT,
                    g.current.results.has(GameResult.WIN_BLUE)
                        ? AnalyticsAction.GAME_RESULT_BOT_LOSS + g.current?.players[1].strength
                        : AnalyticsAction.GAME_RESULT_BOT_WIN + g.current?.players[1].strength,
                );
            }
            setTimeout(() => {
                if (g.current) {
                    const ways = [];
                    if (g.current.results.has(GameResult.WIN_STONE)) {
                        ways.push('stone');
                    }
                    if (g.current.results.has(GameResult.WIN_STREAM)) {
                        ways.push('stream');
                    }
                    navigate(`/end?win=${g.current.results.has(GameResult.WIN_BLUE) ? 'blue' : 'red'}&way=${ways.join(',')}`);
                }
            }, 3000);
        }
    }, [position]);

    useEffect(() => {
        if (!g.current) {
            return;
        }
        if (!g.current.isBotTurn()) {
            return;
        }
        setTimeout(() => {
            (async () => {
                if (!g.current) {
                    return;
                }
                const bm = await g.current.getBotMove();
                const m = allPossibleMoves.filter((m) => m.cardName === bm.cardName && m.from === bm.from && m.to === bm.to)[0];
                g.current.move(m);
                setPosition(g.current.getCurPosition());
            })();
        }, 500);
    }, [allPossibleMoves]);

    const handleSelectCard = useCallback(
        (cardName: string) => {
            if (!g.current) {
                return;
            }
            const moves = allPossibleMoves.filter((m) => m.cardName === cardName);
            if (moves.length === 1 && moves[0].types.has(MoveType.PASS_CARD_ONLY)) {
                const m = moves[0];
                g.current.move(m);
                setPosition(g.current.getCurPosition());
            } else {
                setCardPossibleMoves(moves);
            }
        },
        [allPossibleMoves],
    );

    const handleSelectMove = useCallback(
        (from: number, to: number) => {
            if (!g.current) {
                return;
            }
            const m = cardPossibleMoves.find((m) => m.from === from && m.to === to);
            g.current.move(m);
            setPosition(g.current.getCurPosition());
        },
        [g, cardPossibleMoves],
    );

    return (
        g.current && (
            <Box className="game position--relative fade-in">
                <CoverUI opacity={0.4} />
                <Box className="game-content">
                    <Progress />
                    <Box className="game--main">
                        <BoardUI b={g.current.board} cardPossibleMoves={cardPossibleMoves} onSelectMove={handleSelectMove} />
                        {g.current.isGameGoing() && <HandsUi p={position} allPossibleMoves={allPossibleMoves} onSelectCard={handleSelectCard} />}
                    </Box>
                    {(g.current.isGameEnded() || g.current.isBotTurn()) && <Box className="game-over-cover" />}
                </Box>
            </Box>
        )
    );
}
