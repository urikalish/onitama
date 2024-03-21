import { Move } from '../model/move';
import { Position } from '../model/position';
import { getMove } from './bot';

export function getRedScore(p: Position): number {
    if (p.pieceData[10] === 'm') {
        return 100;
    }
    if (p.pieceData[14] === 'M') {
        return -100;
    }
    const boardCenter = [6, 7, 8, 11, 12, 13, 16, 17, 18, 21, 22, 23];
    let redMaster = false;
    let blueMaster = false;
    let score = 0;
    for (const [i, d] of p.pieceData.entries()) {
        if (d === '') {
            continue;
        }
        if (d === 'm') {
            redMaster = true;
            if (boardCenter.includes(i)) {
                score += 1;
            }
        } else if (d === 's') {
            score += +10;
            if (boardCenter.includes(i)) {
                score += 1;
            }
        } else if (d === 'M') {
            blueMaster = true;
            if (boardCenter.includes(i)) {
                score -= 1;
            }
        } else if (d === 'S') {
            score -= 10;
            if (boardCenter.includes(i)) {
                score -= 1;
            }
        }
    }
    if (!blueMaster) {
        return 100;
    }
    if (!redMaster) {
        return -100;
    }
    return score;
}

export async function getBotMove(p: Position, strength: number, progressCB: (progressPercent: number) => void): Promise<Move> {
    return getMove(p, strength, getRedScore, true, false, progressCB);
}
