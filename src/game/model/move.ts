import { Position } from './position';

export enum MoveType {
    NA = '-',
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
    fullMoveNum: number,
    armyIndex: number,
    cardName: string,
    cardOptionIndex: number,
    from: number,
    to: number,
    types: Set<MoveType>,
    name: string,
    oldPosition: Position,
    newPosition: Position,
) {
    const m: Move = new Move();
    m.fullMoveNum = fullMoveNum;
    m.armyIndex = armyIndex;
    m.cardName = cardName;
    m.cardOptionIndex = cardOptionIndex;
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
    fullMoveNum = 1;
    armyIndex = 0;
    cardName: string;
    cardOptionIndex: number;
    from = -1;
    to = -1;
    name = '';
    oldPosition: Position = new Position();
    newPosition: Position = new Position();
}
