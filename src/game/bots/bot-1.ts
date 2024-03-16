import { Move } from '../model/move';
import { Position } from '../model/position';
import { getMove } from './bot';

export function getBlueScore1(p: Position): number {
    let score = 0;
    const blueTorii = 10;
    const redTorii = 14;
    const centerCircle = [6, 7, 8, 11, 13, 16, 17, 18, 21, 22, 23];
    const centerSquare = 12;
    for (const [i, d] of p.pieceData.entries()) {
        if (d === '') {
            continue;
        }
        if (d === 'M') {
            score += 100;
            if (i === redTorii) {
                score += 100;
            }
            if (centerCircle.includes(i)) {
                score += 1;
            }
            if (i === centerSquare) {
                score += 2;
            }
        } else if (d === 'S') {
            score += 10;
            if (centerCircle.includes(i)) {
                score += 1;
            }
            if (i === centerSquare) {
                score += 2;
            }
        } else if (d === 'm') {
            score += -100;
            if (i === blueTorii) {
                score -= 100;
            }
            if (centerCircle.includes(i)) {
                score -= 1;
            }
            if (i === centerSquare) {
                score -= 2;
            }
        } else if (d === 's') {
            score += -10;
            if (centerCircle.includes(i)) {
                score -= 1;
            }
            if (i === centerSquare) {
                score -= 2;
            }
        }
    }
    return score;
}

export async function getBotMove(p: Position, strength: number): Promise<Move> {
    return getMove(p, strength, getBlueScore1, true, false);
}
