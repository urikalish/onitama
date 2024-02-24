import { Position } from './position';

export enum MoveType {
    NA = 'NA',
    MOVE_S = 'move_s',
    MOVE_M = 'move_m',
    CAPTURE = 'capture',
    CAPTURED_S = 'captured_s',
    CAPTURED_M = 'captured_m',
    WIN = 'win',
    WIN_STONE = 'win_stone',
    WIN_STREAM = 'win_stream',
}

export function createMoveInstance(
    halfMoveNum: number,
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
    m.halfMoveNum = halfMoveNum;
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
    halfMoveNum = 1;
    armyIndex = 0;
    cardName: string = '';
    from = -1;
    to = -1;
    name = '';
    oldPosition: Position = new Position();
    newPosition: Position = new Position();
}
