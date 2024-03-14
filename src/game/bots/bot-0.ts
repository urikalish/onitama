import { Move } from '../model/move';
import { Mover } from '../model/mover';
import { Position } from '../model/position';
import { shuffleFisherYates, sortMoves } from './bot';

export async function getBotMove(p: Position /*, strength: number*/): Promise<Move> {
    const moves = new Mover().getAllPossibleMoves(p);
    if (moves.length === 0) {
        throw 'No moves!';
    }
    if (moves.length === 1) {
        return moves[0];
    }
    shuffleFisherYates(moves);
    sortMoves(moves);
    return moves[0];
}
