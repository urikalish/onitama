import { Position } from '../model/position';

export const WIN_SCORE = 1000;

export function getRedScoreBasic(p: Position): number {
    const PIECE_SCORE = 100;
    const SQUARE_SCORE = 1;
    const SQUARE_SCORE_MASTER_MULTIPLIER = 5;
    const MASTER_RANK_SCORE = 5;
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
        [0, SQUARE_SCORE, SQUARE_SCORE, SQUARE_SCORE, 0],
        [0, SQUARE_SCORE, 2 * SQUARE_SCORE, SQUARE_SCORE, 0],
        [0, SQUARE_SCORE, SQUARE_SCORE, SQUARE_SCORE, 0],
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
            score += squareScores[y][x];
        } else if (d === 'S') {
            score -= PIECE_SCORE;
            score -= squareScores[y][x];
        } else {
            if (d === 'm') {
                redMaster = true;
                score += SQUARE_SCORE_MASTER_MULTIPLIER * squareScores[y][x];
                score += [
                    [0, 0, 0, MASTER_RANK_SCORE, 2 * MASTER_RANK_SCORE],
                    [0, 0, MASTER_RANK_SCORE, 2 * MASTER_RANK_SCORE, 0],
                    [0, MASTER_RANK_SCORE, 2 * MASTER_RANK_SCORE, 0, 0],
                ][gamePhase][x];
            } else if (d === 'M') {
                blueMaster = true;
                score -= SQUARE_SCORE_MASTER_MULTIPLIER * squareScores[y][x];
                score -= [
                    [2 * MASTER_RANK_SCORE, MASTER_RANK_SCORE, 0, 0, 0],
                    [0, 2 * MASTER_RANK_SCORE, MASTER_RANK_SCORE, 0, 0],
                    [0, 0, 2 * MASTER_RANK_SCORE, MASTER_RANK_SCORE, 0],
                ][gamePhase][x];
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
