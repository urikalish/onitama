import { Move } from '../model/move';
import { Position } from '../model/position';
import { Context, getMove } from './bot';

export function getPieceScore(p: string): number {
    if (p === 'M') return 100;
    if (p === 'm') return -100;
    if (p === 'S') return 1;
    if (p === 's') return -1;
    return 0;
}

export function getBlueScore1(p: Position, context: Context): number {
    let score = 0;
    p.pieceData.forEach((d) => {
        score += getPieceScore(d);
    });
    if (context.myIndex !== 0) {
        score = -score;
    }
    return score;
}

export async function getBotMove(p: Position, strength: number): Promise<Move> {
    return getMove(p, strength, getBlueScore1, true, false);
}
