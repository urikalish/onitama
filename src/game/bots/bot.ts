import { Move, MoveType } from '../model/move';
import { Mover } from '../model/mover';
import { Position } from '../model/position';

export type Context = {
    myIndex: number;
    blueScoreFunc: (p: Position, context: Context) => number;
    blueScoresCache: Map<number, number> | null;
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

function getHashCode(str: string): number {
    let hash = 0;
    let i;
    let l;
    for (i = 0, l = str.length; i < l; i++) {
        hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
    }
    return hash;
}

export function getPositionHashCode(p: Position): number {
    return getHashCode(p.pieceData.toString());
}

function getScore(p: Position, context: Context) {
    let blueScore;
    if (context.blueScoresCache) {
        const hashCode = getPositionHashCode(p);
        if (context.blueScoresCache.has(hashCode)) {
            blueScore = context.blueScoresCache.get(hashCode) || 0;
        } else {
            blueScore = context.blueScoreFunc(p, context);
            context.blueScoresCache.set(hashCode, blueScore);
        }
    } else {
        blueScore = context.blueScoreFunc(p, context);
    }
    return context.myIndex === 0 ? blueScore : -blueScore;
}

function minimax(p: Position, depth: number, isMaximizingPlayer: boolean, context: Context) {
    if (depth === 0) {
        return getScore(p, context);
    }
    const nextMoves = mover.getAllPossibleMoves(p);
    if (nextMoves.length === 0) {
        return getScore(p, context);
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

function alphaBeta(p: Position, depth: number, a: number, b: number, maximizingPlayer: boolean, context: Context) {
    if (depth === 0) {
        return getScore(p, context);
    }
    const nextMoves = mover.getAllPossibleMoves(p);
    if (nextMoves.length === 0) {
        return getScore(p, context);
    }
    sortMoves(nextMoves);
    if (maximizingPlayer) {
        let value = -Infinity;
        for (const m of nextMoves) {
            value = Math.max(value, alphaBeta(m.newPosition, depth - 1, a, b, false, context));
            a = Math.max(a, value);
            if (b <= a) {
                break;
            }
        }
        return value;
    } else {
        let value = Infinity;
        for (const m of nextMoves) {
            value = Math.min(value, alphaBeta(m.newPosition, depth - 1, a, b, true, context));
            b = Math.min(b, value);
            if (b <= a) {
                break;
            }
        }
        return value;
    }
}
export async function getMove(
    p: Position,
    strength: number,
    blueScoreFunc: (p: Position) => number,
    useAlphaBeta: boolean,
    useScoresCache: boolean,
    progressCB: (progressPercent: number) => void,
): Promise<Move> {
    progressCB(0);
    const moves = mover.getAllPossibleMoves(p);
    if (moves.length === 0) {
        throw 'No moves!';
    }
    if (moves.length === 1) {
        progressCB(100);
        return moves[0];
    }
    let winMove;
    winMove = moves.find((m) => m.types.has(MoveType.MOVE_M) && m.types.has(MoveType.WIN_STONE));
    if (winMove) {
        progressCB(100);
        return winMove;
    }
    winMove = moves.find((m) => m.types.has(MoveType.MOVE_M) && m.types.has(MoveType.WIN_STREAM));
    if (winMove) {
        progressCB(100);
        return winMove;
    }
    winMove = moves.find((m) => m.types.has(MoveType.WIN));
    if (winMove) {
        progressCB(100);
        return winMove;
    }
    const context: Context = {
        myIndex: p.armyIndex,
        blueScoreFunc,
        blueScoresCache: useScoresCache ? new Map<number, number>() : null,
    };
    const depth = strength;
    let score;
    let bestMoveScore = Number.NEGATIVE_INFINITY;
    let bestMoves: Move[] = [];
    sortMoves(moves);
    moves.forEach((m, i) => {
        if (useAlphaBeta) {
            score = alphaBeta(m.newPosition, depth, -Infinity, Infinity, false, context);
        } else {
            score = minimax(m.newPosition, depth, false, context);
        }
        if (score === bestMoveScore) {
            bestMoves.push(m);
        } else if (score > bestMoveScore) {
            bestMoves = [m];
            bestMoveScore = score;
        }
        progressCB(Math.round(((i + 1) / moves.length) * 100));
    });
    return bestMoves[Math.trunc(Math.random() * bestMoves.length)];
}
