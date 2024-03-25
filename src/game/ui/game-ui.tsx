import './game.css';

import { Box } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { AnalyticsAction, AnalyticsCategory, sendAnalyticsEvent } from '../../services/analytics';
import { getRandomCardsNames } from '../model/card';
import { Game, GameResult } from '../model/game';
import { Move, MoveType } from '../model/move';
import { PlayerType } from '../model/player';
import { Position } from '../model/position';
import { BoardUI } from './board-ui';
import { CoverUI } from './cover-ui';
import { HandsUi } from './hands-ui';

export function handleProgressCallback(armyIndex: number, progressPercent: number) {
    const propName = armyIndex === 0 ? '--progress--blue' : '--progress--red';
    document.documentElement.style.setProperty(propName, `${progressPercent}%`);
    if (progressPercent >= 100) {
        setTimeout(() => {
            document.documentElement.style.setProperty(propName, '0%');
        }, 250);
    }
}

export function GameUI() {
    const g = useRef<Game | null>(null);
    const [position, setPosition] = useState<Position | null>(null);
    const [allPossibleMoves, setAllPossibleMoves] = useState<Move[]>([]);
    const [cardPossibleMoves, setCardPossibleMoves] = useState<Move[]>([]);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (g.current) {
            return;
        }
        const queryParams = new URLSearchParams(location.search);
        const players: string[] = (queryParams.get('players') || 'human,human').split(',');
        const deckNames = (queryParams.get('decks') || 'base').split(',');
        const cardNames = getRandomCardsNames(deckNames, 5);
        const game = new Game(
            players[0],
            players[0] === 'human' ? PlayerType.HUMAN : PlayerType.BOT,
            players[1],
            players[1] === 'human' ? PlayerType.HUMAN : PlayerType.BOT,
            cardNames,
            handleProgressCallback,
        );
        game.startGame(Date.now());
        g.current = game;
        setPosition(game.getCurPosition());
        sendAnalyticsEvent(AnalyticsCategory.GAME_PHASE, AnalyticsAction.GAME_PHASE_GAME_STARTED);
        sendAnalyticsEvent(AnalyticsCategory.PLAYERS, `${players[0]} vs ${players[1]}`);
    }, []);

    useEffect(() => {
        if (!g.current || !position) {
            return;
        }
        if (g.current.isGameGoing()) {
            setAllPossibleMoves(g.current.possibleMoves);
            setCardPossibleMoves([]);
        } else {
            sendAnalyticsEvent(AnalyticsCategory.GAME_PHASE, AnalyticsAction.GAME_PHASE_GAME_ENDED);
            sendAnalyticsEvent(
                AnalyticsCategory.GAME_RESULT,
                g.current.results.has(GameResult.WIN_BLUE)
                    ? `${g.current?.players[0].name} > ${g.current?.players[1].name}`
                    : `${g.current?.players[1].name} > ${g.current?.players[0].name}`,
            );
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
        if (!g.current || allPossibleMoves.length === 0) {
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
