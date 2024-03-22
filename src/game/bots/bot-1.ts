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
    const squareScore = [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 2, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0];
    let redMaster = false;
    let blueMaster = false;
    let score = 0;
    for (const [i, d] of p.pieceData.entries()) {
        if (d === '') {
            continue;
        }
        if (d === 'm') {
            redMaster = true;
            score += squareScore[i];
        } else if (d === 's') {
            score += +10;
            score += squareScore[i];
        } else if (d === 'M') {
            blueMaster = true;
            score -= squareScore[i];
        } else if (d === 'S') {
            score -= 10;
            score -= squareScore[i];
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
