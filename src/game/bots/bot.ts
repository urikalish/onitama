import { Move, MoveType } from '../model/move';
import { Mover } from '../model/mover';
import { Position } from '../model/position';

export type Context = {
    myIndex: number;
    redScoreFunc: (p: Position, context: Context) => number;
    redScoresCache: Map<number, number> | null;
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

function getScore(p: Position, context: Context): number {
    let redScore: number;
    if (context.redScoresCache) {
        const hashCode = getHashCode(p.pieceData.toString());
        if (context.redScoresCache.has(hashCode)) {
            redScore = context.redScoresCache.get(hashCode) || 0;
        } else {
            redScore = context.redScoreFunc(p, context);
            context.redScoresCache.set(hashCode, redScore);
        }
    } else {
        redScore = context.redScoreFunc(p, context);
    }
    return Number((context.myIndex === 1 ? redScore : -redScore).toFixed(1));
}

function minimax(p: Position, depth: number, isMaximizingPlayer: boolean, context: Context): number {
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

function alphaBeta(p: Position, depth: number, a: number, b: number, maximizingPlayer: boolean, context: Context): number {
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
    maxDepth: number,
    redScoreFunc: (p: Position) => number,
    useAlphaBeta: boolean,
    useScoresCache: boolean,
    progressCB: (progressPercent: number) => void,
): Promise<[Move, number]> {
    progressCB(0);
    const moves = mover.getAllPossibleMoves(p);
    if (moves.length === 0) {
        throw 'No moves!';
    }
    const VICTORY_SCORE = 100;
    let winMove;
    winMove = moves.find((m) => m.types.has(MoveType.MOVE_M) && m.types.has(MoveType.WIN_STONE));
    if (winMove) {
        progressCB(100);
        return [winMove, VICTORY_SCORE];
    }
    winMove = moves.find((m) => m.types.has(MoveType.MOVE_M) && m.types.has(MoveType.WIN_STREAM));
    if (winMove) {
        progressCB(100);
        return [winMove, VICTORY_SCORE];
    }
    winMove = moves.find((m) => m.types.has(MoveType.WIN));
    if (winMove) {
        progressCB(100);
        return [winMove, VICTORY_SCORE];
    }
    const context: Context = {
        myIndex: p.armyIndex,
        redScoreFunc: redScoreFunc,
        redScoresCache: useScoresCache ? new Map<number, number>() : null,
    };
    sortMoves(moves);
    let bestMoveScore: number;
    let bestMoves: Move[];
    let tryDepth = maxDepth;
    do {
        progressCB(0);
        bestMoveScore = Number.NEGATIVE_INFINITY;
        bestMoves = [];
        moves.forEach((m, i) => {
            let score;
            if (useAlphaBeta) {
                score = alphaBeta(m.newPosition, tryDepth, -Infinity, Infinity, false, context);
            } else {
                score = minimax(m.newPosition, tryDepth, false, context);
            }
            if (score === bestMoveScore) {
                bestMoves.push(m);
            } else if (score > bestMoveScore) {
                bestMoves = [m];
                bestMoveScore = score;
            }
            progressCB(Math.round(((i + 1) / moves.length) * 100));
        });
        tryDepth--;
    } while (bestMoveScore === -100 && tryDepth >= 0);
    return [bestMoves[Math.trunc(Math.random() * bestMoves.length)], bestMoveScore];
}
