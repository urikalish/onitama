import { Position } from '../model/position';

export const WIN_SCORE = 1000;

export function getRedScoreBasic(p: Position): number {
    const PIECE_SCORE = 100;
    const SQUARE_SCORE_S_MUL = 1;
    const SQUARE_SCORE_M_MUL = 10;
    if (p.pieceData[10] === 'm') {
        return WIN_SCORE;
    }
    if (p.pieceData[14] === 'M') {
        return -WIN_SCORE;
    }
    let pieceCount = 0;
    p.pieceData.forEach((pd) => {
        if (pd !== '') {
            pieceCount++;
        }
    });
    let gamePhase;
    if (pieceCount <= 4) {
        gamePhase = 2;
    } else if (pieceCount <= 6) {
        gamePhase = 1;
    } else {
        gamePhase = 0;
    }
    const squareScores = [
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 2, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
    ];
    let redMaster = false;
    let blueMaster = false;
    let score = 0;
    for (const [i, d] of p.pieceData.entries()) {
        if (d === '') {
            continue;
        }
        const x = i % 5;
        const y = Math.trunc(i / 5);
        if (d === 's') {
            score += PIECE_SCORE;
            score += squareScores[y][x] * SQUARE_SCORE_S_MUL;
        } else if (d === 'S') {
            score -= PIECE_SCORE;
            score -= squareScores[y][x] * SQUARE_SCORE_S_MUL;
        } else {
            if (d === 'm') {
                redMaster = true;
                score +=
                    [
                        [
                            [0, 0, 0, 0, 0],
                            [0, 0, 0, 1, 2],
                            [0, 0, 0, 1, 2],
                            [0, 0, 0, 1, 2],
                            [0, 0, 0, 0, 0],
                        ],
                        [
                            [0, 0, 0, 0, 0],
                            [0, 0, 1, 2, 0],
                            [0, 0, 1, 2, 0],
                            [0, 0, 1, 2, 0],
                            [0, 0, 0, 0, 0],
                        ],
                        [
                            [0, 0, 0, 0, 0],
                            [0, 1, 2, 0, 0],
                            [0, 1, 2, 0, 0],
                            [0, 1, 2, 0, 0],
                            [0, 0, 0, 0, 0],
                        ],
                    ][gamePhase][y][x] * SQUARE_SCORE_M_MUL;
            } else if (d === 'M') {
                blueMaster = true;
                score -=
                    [
                        [
                            [0, 0, 0, 0, 0],
                            [2, 1, 0, 0, 0],
                            [2, 1, 0, 0, 0],
                            [2, 1, 0, 0, 0],
                            [0, 0, 0, 0, 0],
                        ],
                        [
                            [0, 0, 0, 0, 0],
                            [0, 2, 1, 0, 0],
                            [0, 2, 1, 0, 0],
                            [0, 2, 1, 0, 0],
                            [0, 0, 0, 0, 0],
                        ],
                        [
                            [0, 0, 0, 0, 0],
                            [0, 0, 2, 1, 0],
                            [0, 0, 2, 1, 0],
                            [0, 0, 2, 1, 0],
                            [0, 0, 0, 0, 0],
                        ],
                    ][gamePhase][y][x] * SQUARE_SCORE_M_MUL;
            }
        }
    }
    if (!blueMaster) {
        return WIN_SCORE;
    }
    if (!redMaster) {
        return -WIN_SCORE;
    }
    return score;
}
