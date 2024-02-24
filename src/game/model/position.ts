import { Hand } from './hand';
import { PieceType, PieceTypeCased } from './piece';

export function createPositionInstance(pieceData: string[], hands: Hand[], halfMoveClock: number, fullMoveNum: number): Position {
    const p: Position = new Position();
    p.pieceData = pieceData;
    p.hands = hands;
    p.armyIndex = hands[0].cards.length > hands[1].cards.length ? 0 : 1;
    p.halfMoveClock = halfMoveClock;
    p.fullMoveNum = fullMoveNum;
    return p;
}

export function createNextPosition(p: Position): Position {
    return createPositionInstance([...p.pieceData], p.hands, p.halfMoveClock + 1, p.armyIndex === 0 ? p.fullMoveNum : p.fullMoveNum + 1);
}

export function assureTwoMasters(p: Position): boolean {
    return p.pieceData.findIndex((pd) => pd === 'M') > -1 && p.pieceData.findIndex((pd) => pd === 'm') > -1;
}

export function getOnePieceCount(p: Position, pieceTypeCased: PieceTypeCased): number {
    return p.pieceData.reduce((count: number, pd: string) => {
        return pd === pieceTypeCased ? count + 1 : count;
    }, 0);
}

export function getAllPieceCount(p: Position) {
    return [
        {
            [PieceType.STUDENT]: getOnePieceCount(p, PieceTypeCased.BLUE_STUDENT),
        },
        {
            [PieceType.STUDENT]: getOnePieceCount(p, PieceTypeCased.RED_STUDENT),
        },
    ];
}

export function getStandardScore(p: Position): number {
    let score = 0;
    const pieceCount = getAllPieceCount(p);
    score += pieceCount[0][PieceType.STUDENT];
    score -= pieceCount[1][PieceType.STUDENT];
    return score;
}

export class Position {
    pieceData: string[] = [];
    hands: Hand[] = [];
    armyIndex = 0;
    halfMoveClock = 0;
    fullMoveNum = 1;
}
