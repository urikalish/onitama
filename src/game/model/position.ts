import { flipIndex } from '../../services/utils';
import { PieceType, PieceTypeCased } from './piece';

export function createPositionInstance(armyIndex: number, pieceData: string[], handsData: string[], moveNum: number): Position {
    const p: Position = new Position();
    p.armyIndex = armyIndex;
    p.pieceData = pieceData;
    p.handsData = handsData;
    p.moveNum = moveNum;
    return p;
}

export function createNextPosition(p: Position): Position {
    return createPositionInstance(flipIndex(p.armyIndex), [...p.pieceData], p.handsData, p.moveNum + 1);
}

export function assureTwoMasters(p: Position): boolean {
    return !!(p.pieceData.find((pd) => pd === 'M') && p.pieceData.find((pd) => pd === 'm'));
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
    armyIndex = -1;
    pieceData: string[] = [];
    handsData: string[] = [];
    moveNum = 1;
}
