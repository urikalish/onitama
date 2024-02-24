import { Piece } from './piece';

export function getNameByIndex(index: number) {
    return String.fromCharCode(97 + (index % 5)) + String(5 - Math.trunc(index / 5));
}

export function getIndexByName(name: string) {
    return (5 - Number(name[1])) * 5 + (name[0].charCodeAt(0) - 97);
}

export class Square {
    index: number;
    name: string;
    piece: Piece | null;

    constructor(index: number) {
        this.index = index;
        this.name = getNameByIndex(index);
        this.piece = null;
    }

    isOccupied() {
        return !!this.piece;
    }

    isEmpty() {
        return !this.piece;
    }

    setPiece(piece: Piece) {
        this.piece = piece;
    }

    clearPiece() {
        if (!this.piece) {
            return;
        }
        this.piece = null;
    }
}
