import { Move, MoveType } from '../model/move';
import { Mover } from '../model/mover';
import { Position } from '../model/position';

type Context = {
    myIndex: number;
    scoreFunc: (p: Position, myIndex: number) => number;
};

const mover = new Mover();

export function shuffleFisherYates(arr: Move[]) {
    let rnd;
    let cur = arr.length;
    while (cur !== 0) {
        rnd = Math.floor(Math.random() * cur);
        cur--;
        [arr[cur], arr[rnd]] = [arr[rnd], arr[cur]];
    }
}

export function sortMoves(moves: Move[]) {
    shuffleFisherYates(moves);
    moves.sort((a, b) => {
        let scoreA;
        if (a.types.has(MoveType.WIN)) {
            scoreA = 2;
        } else if (a.types.has(MoveType.CAPTURE)) {
            scoreA = 1;
        } else {
            scoreA = 0;
        }
        let scoreB;
        if (b.types.has(MoveType.WIN)) {
            scoreB = 2;
        } else if (b.types.has(MoveType.CAPTURE)) {
            scoreB = 1;
        } else {
            scoreB = 0;
        }
        if (scoreA > scoreB) return -1;
        if (scoreB > scoreA) return 1;
        return 0;
    });
}

function minimax(p: Position, depth: number, isMaximizingPlayer: boolean, context: Context) {
    if (depth === 0) {
        return context.scoreFunc(p, context.myIndex);
    }
    const nextMoves = mover.getAllPossibleMoves(p);
    if (nextMoves.length === 0) {
        return context.scoreFunc(p, context.myIndex);
    }
    if (isMaximizingPlayer) {
        let maxEval = -Infinity;
        for (const m of nextMoves) {
            maxEval = Math.max(maxEval, minimax(m.newPosition, depth - 1, false, context));
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const m of nextMoves) {
            minEval = Math.min(minEval, minimax(m.newPosition, depth - 1, true, context));
        }
        return minEval;
    }
}

// function alphaBeta(p: Position, depth: number, a: number, b: number, maximizingPlayer: boolean, context: Context) {
//     if (depth === 0) {
//         return context.scoreFunc(p, context.myIndex);
//     }
//     const nextMoves = mover.getAllPossibleMoves(p);
//     if (nextMoves.length === 0) {
//         return context.scoreFunc(p, context.myIndex);
//     }
//     if (maximizingPlayer) {
//         let value = Number.NEGATIVE_INFINITY;
//         for (const m of nextMoves) {
//             value = Math.max(value, alphaBeta(m.newPosition, depth - 1, a, b, false, context));
//             a = Math.max(a, value);
//             if (b <= a) {
//                 break;
//             }
//         }
//         return value;
//     } else {
//         let value = Number.POSITIVE_INFINITY;
//         for (const m of nextMoves) {
//             value = Math.min(value, alphaBeta(m.newPosition, depth - 1, a, b, true, context));
//             b = Math.min(b, value);
//             if (b <= a) {
//                 break;
//             }
//         }
//         return value;
//     }
// }

export async function getMove(p: Position, strength: number, scoreFunc: (p: Position, myIndex: number) => number): Promise<Move> {
    const moves = mover.getAllPossibleMoves(p);
    if (moves.length === 0) {
        throw 'No moves!';
    }
    if (moves.length === 1) {
        return moves[0];
    }
    sortMoves(moves);
    const winMove = moves.find((m) => m.types.has(MoveType.WIN));
    if (winMove) {
        return winMove;
    }
    const context: Context = {
        myIndex: p.armyIndex,
        scoreFunc,
    };
    const depth = strength;
    let score;
    let bestMoveScore = Number.NEGATIVE_INFINITY;
    let bestMoves: Move[] = [];
    moves.forEach((m) => {
        score = minimax(m.newPosition, depth, true, context);
        if (score === bestMoveScore) {
            bestMoves.push(m);
        } else if (score > bestMoveScore) {
            bestMoves = [m];
            bestMoveScore = score;
        }
    });
    return bestMoves[Math.trunc(Math.random() * bestMoves.length)];
}
