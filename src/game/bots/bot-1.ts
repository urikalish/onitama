import { Move } from '../model/move';
import { Position } from '../model/position';
import { getMove } from './bot-helper';

export function getPieceScore(p: string): number {
    if (p === 'M') return 1000000;
    if (p === 'm') return -1000000;
    if (p === 'S') return 1000;
    if (p === 's') return -1000;
    return 0;
}

export function score1(p: Position, myIndex: number): number {
    let score = 0;
    p.pieceData.forEach((d) => {
        score += getPieceScore(d);
    });
    return myIndex === 0 ? score : -score;
}

export async function getBotMove(p: Position, strength: number): Promise<Move> {
    return getMove(p, strength, score1);
}
