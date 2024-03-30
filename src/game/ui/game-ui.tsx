import './game.css';

import { Box } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { fbEndGame } from '../../firebase/firebase';
import { AnalyticsAction, AnalyticsCategory, sendAnalyticsEvent } from '../../services/analytics';
import { GameResult } from '../model/game';
import { g } from '../model/game';
import { Move, MoveType } from '../model/move';
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
    const [position, setPosition] = useState<Position | null>(null);
    const [allPossibleMoves, setAllPossibleMoves] = useState<Move[]>([]);
    const [cardPossibleMoves, setCardPossibleMoves] = useState<Move[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!g) {
            navigate('/init');
            return;
        }
        setPosition(g.getCurPosition());
    }, []);

    useEffect(() => {
        if (!g || !position) {
            return;
        }
        if (g.isGameGoing()) {
            setAllPossibleMoves(g.possibleMoves);
            setCardPossibleMoves([]);
        } else {
            if (!g.isRemoteGame() || g.getRemotePlayerIndex() === 1) {
                sendAnalyticsEvent(AnalyticsCategory.GAME_PHASE, AnalyticsAction.GAME_PHASE_GAME_ENDED);
                sendAnalyticsEvent(
                    AnalyticsCategory.GAME_RESULT,
                    g.results.has(GameResult.WIN_BLUE) ? `${g?.players[0].name} > ${g?.players[1].name}` : `${g?.players[1].name} > ${g?.players[0].name}`,
                );
                if (g.isRemoteGame()) {
                    fbEndGame(g);
                }
            }
            setTimeout(() => {
                if (g) {
                    navigate('/end');
                }
            }, 3000);
        }
    }, [position]);

    useEffect(() => {
        if (!g || allPossibleMoves.length === 0) {
            return;
        }
        if (g.isBotTurn()) {
            setTimeout(() => {
                (async () => {
                    if (!g) {
                        return;
                    }
                    const bm = await g.getBotMove();
                    const m = allPossibleMoves.filter((m) => m.cardName === bm.cardName && m.from === bm.from && m.to === bm.to)[0];
                    g.move(m);
                    setPosition(g.getCurPosition());
                })();
            }, 500);
        }
    }, [allPossibleMoves]);

    const handleSelectCard = useCallback(
        (cardName: string) => {
            if (!g) {
                return;
            }
            const moves = allPossibleMoves.filter((m) => m.cardName === cardName);
            if (moves.length === 1 && moves[0].types.has(MoveType.PASS_CARD_ONLY)) {
                const m = moves[0];
                g.move(m);
                setPosition(g.getCurPosition());
            } else {
                setCardPossibleMoves(moves);
            }
        },
        [allPossibleMoves],
    );

    const handleSelectMove = useCallback(
        (from: number, to: number) => {
            if (!g) {
                return;
            }
            const m = cardPossibleMoves.find((m) => m.from === from && m.to === to);
            g.move(m);
            setPosition(g.getCurPosition());
        },
        [g, cardPossibleMoves],
    );

    return (
        g && (
            <Box className="game position--relative fade-in">
                <CoverUI opacity={0.4} />
                <Box className="game-content">
                    <Box className="game--main">
                        <BoardUI b={g.board} cardPossibleMoves={cardPossibleMoves} onSelectMove={handleSelectMove} />
                        {g.isGameGoing() && <HandsUi p={position} allPossibleMoves={allPossibleMoves} onSelectCard={handleSelectCard} />}
                    </Box>
                    {(g.isBotTurn() || g.isRemoteTurn() || g.isGameEnded()) && <Box className="game-over-cover" />}
                </Box>
            </Box>
        )
    );
}
