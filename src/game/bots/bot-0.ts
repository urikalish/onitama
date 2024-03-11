import { Move } from '../model/move';
import { Mover } from '../model/mover';
import { Position } from '../model/position';

export function getBotMove(p: Position): Move {
    const moves = new Mover().getAllPossibleMoves(p);
    return moves[Math.trunc(Math.random() * moves.length)];
}
