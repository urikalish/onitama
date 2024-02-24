import { Color } from './color';
import { Piece, PieceType } from './piece';
import { PlayerType } from './player';

export function flipArmyIndex(armyIndex: number): number {
    return Math.abs(armyIndex - 1);
}

export class Army {
    index: number;
    color: Color;
    playerType: PlayerType;
    pieces: Piece[];

    constructor(armyIndex: number, playerType: PlayerType) {
        this.index = armyIndex;
        this.color = armyIndex === 0 ? Color.BLUE : Color.RED;
        this.playerType = playerType;
        this.pieces = [];
    }

    createAndAddPiece(pieceType: PieceType): Piece {
        const piece = new Piece(this.index, pieceType);
        this.pieces.push(piece);
        return piece;
    }

    getPiece(name: string): Piece | null {
        return this.pieces.find((p) => p.name === name) || null;
    }

    removePiece(pieceName: string): boolean {
        const index = this.pieces.findIndex((p) => p.name === pieceName);
        if (index === -1) {
            return false;
        }
        this.pieces.splice(index, 1);
        return true;
    }
}
