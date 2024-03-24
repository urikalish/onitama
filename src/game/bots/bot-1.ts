import { Move } from '../model/move';
import { Position } from '../model/position';
import { getMove } from './bot';

export function getRedScore(p: Position): number {
    const VICTORY_SCORE = 100;
    if (p.pieceData[10] === 'm') {
        return VICTORY_SCORE;
    }
    if (p.pieceData[14] === 'M') {
        return -VICTORY_SCORE;
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
    const squareScores = [0, 0, 0, 0, 0, 0, 0.1, 0.1, 0.1, 0, 0, 0.1, 0.2, 0.1, 0, 0, 0.1, 0.1, 0.1, 0, 0, 0, 0, 0, 0];
    let redMaster = false;
    let blueMaster = false;
    let score = 0;
    for (const [i, d] of p.pieceData.entries()) {
        if (d === '') {
            continue;
        }
        if (d === 's') {
            score += +10;
            score += squareScores[i];
        } else if (d === 'S') {
            score -= 10;
            score -= squareScores[i];
        } else {
            const x = i % 5;
            const y = Math.trunc(i / 5);
            if (d === 'm') {
                redMaster = true;
                score += [
                    [0, 0, 0, 0.1, 0.2],
                    [0, 0, 0.1, 0.2, 0],
                    [0, 0.1, 0.2, 0, 0],
                ][gamePhase][x];
                score += [0, 0.1, 0.2, 0.1, 0][y];
            } else if (d === 'M') {
                blueMaster = true;
                score -= [
                    [0.2, 0.1, 0, 0, 0],
                    [0, 0.2, 0.1, 0, 0],
                    [0, 0, 0.2, 0.1, 0],
                ][gamePhase][x];
                score -= [0, 0.1, 0.2, 0.1, 0][y];
            }
        }
    }
    if (!blueMaster) {
        return VICTORY_SCORE;
    }
    if (!redMaster) {
        return -VICTORY_SCORE;
    }
    return Number(score.toFixed(1));
}

export async function getBotMove(p: Position, strength: number, progressCB: (progressPercent: number) => void): Promise<[Move, number]> {
    return getMove(p, strength, getRedScore, true, false, progressCB);
}
