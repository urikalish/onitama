import { Position } from './position';

export enum MoveType {
    NA = 'NA',
    MOVE_S = 'move-s',
    MOVE_M = 'move-m',
    CAPTURE = 'capture',
    CAPTURED_S = 'captured-s',
    CAPTURED_M = 'captured-m',
    WIN = 'win',
    WIN_BLUE = 'win-blue',
    WIN_RED = 'win-red',
    WIN_STONE = 'win-stone',
    WIN_STREAM = 'win-stream',
}

export function createMoveInstance(
    moveNum: number,
    armyIndex: number,
    cardName: string,
    from: number,
    to: number,
    types: Set<MoveType>,
    name: string,
    oldPosition: Position,
    newPosition: Position,
) {
    const m: Move = new Move();
    m.moveNum = moveNum;
    m.armyIndex = armyIndex;
    m.cardName = cardName;
    m.from = from;
    m.to = to;
    m.types = types;
    m.name = name;
    m.oldPosition = oldPosition;
    m.newPosition = newPosition;
    return m;
}

export class Move {
    types: Set<MoveType> = new Set();
    moveNum = 1;
    armyIndex = 0;
    cardName: string = '';
    from = -1;
    to = -1;
    name = '';
    oldPosition: Position = new Position();
    newPosition: Position = new Position();
}
