import { Piece } from './piece';
import { Square } from './square';

export class Board {
    squares: Square[];

    constructor() {
        this.squares = [];
        for (let i = 0; i < 25; i++) {
            this.addSquare(i);
        }
    }

    addSquare(index: number): Square {
        const square = new Square(index);
        this.squares.push(square);
        return square;
    }

    clearPiece(index: number) {
        this.squares[index].clearPiece();
    }

    placePiece(piece: Piece, index: number) {
        const square = this.squares[index];
        square.setPiece(piece);
    }

    movePiece(piece: Piece, from: number, to: number) {
        this.squares[from].clearPiece();
        this.placePiece(piece, to);
    }

    clearSquareByPieceName(pieceName: string): boolean {
        const index = this.squares.findIndex((s) => s.piece?.name === pieceName);
        if (index === -1) {
            return false;
        }
        this.clearPiece(index);
        return true;
    }
}
