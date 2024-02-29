import { Color } from './color';

export enum PieceType {
    STUDENT = 's',
    MASTER = 'm',
}

export enum PieceTypeCased {
    BLUE_STUDENT = 'S',
    BLUE_MASTER = 'M',
    RED_STUDENT = 's',
    RED_MASTER = 'm',
}

export class Piece {
    armyIndex: number;
    color: Color;
    type: PieceType;
    typeCased: PieceTypeCased;
    name: string;

    constructor(armyIndex: number, pieceType: PieceType, indexInArmy: number) {
        this.armyIndex = armyIndex;
        this.color = armyIndex === 0 ? Color.BLUE : Color.RED;
        this.type = pieceType;
        this.typeCased = armyIndex === 0 ? (pieceType.toUpperCase() as PieceTypeCased) : (pieceType.toLowerCase() as PieceTypeCased);
        this.name = `${this.type}${armyIndex}${indexInArmy}`;
    }
}
