import { flipIndex } from '../../services/utils';
import { squareTempleOfArmyIndex } from './board';
import { Card } from './card';
import { passAndActivate } from './hand';
import { createMoveInstance, Move, MoveType } from './move';
import { PieceType } from './piece';
import { createNextPosition, Position } from './position';

export class Mover {
    //region Helper Methods

    getX(i: number): number {
        return i % 5;
    }
    getY(i: number): number {
        return Math.trunc(i / 5);
    }
    getXAndY(i: number): [number, number] {
        return [i % 5, Math.trunc(i / 5)];
    }
    getFile(i: number): string {
        return String.fromCharCode(97 + (i % 5));
    }
    getRank(i: number): number {
        return 8 - Math.trunc(i / 5);
    }
    getFileAndRank(i: number): [string, number] {
        return [String.fromCharCode(97 + (i % 5)), 5 - Math.trunc(i / 5)];
    }
    isXOk(x: number): boolean {
        return x >= 0 && x <= 4;
    }
    isYOk(y: number): boolean {
        return y >= 0 && y <= 4;
    }
    getIndex(x: number, y: number): number {
        return y * 5 + x;
    }
    belongsToArmy(pd: string[], i: number, armyIndex: number): boolean {
        return !!pd[i] && (pd[i] === pd[i].toUpperCase() ? 0 : 1) === armyIndex;
    }
    hasPiece(p: Position, i: number): boolean {
        return !!p.pieceData[i];
    }
    isEmpty(p: Position, i: number): boolean {
        return !p.pieceData[i];
    }
    isPieceOfType(p: Position, i: number, pieceType: PieceType): boolean {
        return p.pieceData[i].toLowerCase() === pieceType;
    }
    getCasedPieceType(p: Position, pieceType: PieceType, flipArmy = false) {
        return flipArmy ? (p.armyIndex === 1 ? pieceType.toUpperCase() : pieceType.toLowerCase()) : p.armyIndex === 0 ? pieceType.toUpperCase() : pieceType.toLowerCase();
    }
    getCapturedMoveType(p: Position, i: number): MoveType {
        if (p.pieceData[i].toLowerCase() === PieceType.STUDENT) return MoveType.CAPTURED_S;
        if (p.pieceData[i].toLowerCase() === PieceType.MASTER) return MoveType.CAPTURED_M;
        return MoveType.NA;
    }
    rotateMove(dx: number, dy: number, armyIndex: number): [number, number] {
        if (armyIndex === 0) {
            if (dx < 0 && dy < 0) return [-dy, dx];
            if (dx > 0 && dy < 0) return [dy, -dx];
            if (dx > 0 && dy > 0) return [-dy, dx];
            if (dx < 0 && dy > 0) return [dy, -dx];
        } else {
            if (dx < 0 && dy < 0) return [dy, -dx];
            if (dx > 0 && dy < 0) return [-dy, dx];
            if (dx > 0 && dy > 0) return [dy, -dx];
            if (dx < 0 && dy > 0) return [-dy, dx];
        }
        return [0, 0];
    }

    //endregion

    getPieceMoves(p: Position, i: number, card: Card): Move[] {
        const moves: Move[] = [];
        let np, to, toX, toY, toFile, toRank;
        const [x, y] = this.getXAndY(i);
        const [fromFile, fromRank] = this.getFileAndRank(i);
        const pieceType = p.pieceData[i].toLowerCase() as PieceType;
        const casedPieceType = this.getCasedPieceType(p, pieceType);
        const myIndex = p.armyIndex;
        const enemyIndex = flipIndex(myIndex);

        for (let m = 0; m < card.moves.length; m += 2) {
            const [dx, dy] = this.rotateMove(card.moves[m], card.moves[m + 1], myIndex);
            toX = x + dx;
            toY = y + dy;
            to = this.getIndex(toX, toY);
            if (!this.isXOk(toX) || !this.isYOk(toY) || this.belongsToArmy(p.pieceData, to, myIndex)) {
                continue;
            }
            [toFile, toRank] = this.getFileAndRank(to);
            const moveTypes: Set<MoveType> = new Set();
            moveTypes.add(pieceType === PieceType.STUDENT ? MoveType.MOVE_S : MoveType.MOVE_M);
            if (pieceType === PieceType.MASTER && squareTempleOfArmyIndex(to) === enemyIndex) {
                moveTypes.add(MoveType.WIN);
                moveTypes.add(MoveType.WIN_STREAM);
            }
            if (this.isEmpty(p, to)) {
                //piece move
                np = createNextPosition(p);
                np.pieceData[i] = '';
                np.pieceData[to] = casedPieceType;
                passAndActivate(card.name, np.hands[myIndex], np.hands[enemyIndex]);
                if (pieceType === PieceType.MASTER && squareTempleOfArmyIndex(to) === enemyIndex) {
                    moveTypes.add(MoveType.WIN);
                    moveTypes.add(MoveType.WIN_STREAM);
                }
                moves.push(
                    createMoveInstance(p.halfMoveNum, p.armyIndex, card.name, i, to, moveTypes, `${casedPieceType}.${card.name}.${fromFile}${fromRank}>${toFile}${toRank}`, p, np),
                );
            } else {
                //piece capture
                moveTypes.add(MoveType.CAPTURE);
                if (p.pieceData[to].toLowerCase() === PieceType.STUDENT) {
                    moveTypes.add(MoveType.CAPTURED_S);
                } else {
                    moveTypes.add(MoveType.CAPTURED_M);
                    moveTypes.add(MoveType.WIN);
                    moveTypes.add(MoveType.WIN_STONE);
                }
                np = createNextPosition(p);
                np.pieceData[i] = '';
                np.pieceData[to] = this.getCasedPieceType(p, pieceType);
                np.halfMoveClock = 0;
                moves.push(
                    createMoveInstance(p.halfMoveNum, p.armyIndex, card.name, i, to, moveTypes, `${casedPieceType}.${card.name}.${fromFile}${fromRank}x${toFile}${toRank}`, p, np),
                );
            }
        }
        return moves;
    }

    getAllPossibleMoves(p: Position): Move[] {
        const moves: Move[] = [];
        const enemyArmyIndex = flipIndex(p.armyIndex);
        for (let i = 0; i < p.pieceData.length; i++) {
            if (!p.pieceData[i] || (p.pieceData && this.belongsToArmy(p.pieceData, i, enemyArmyIndex))) {
                continue;
            }
            for (let c = 0; c < 2; c++) {
                const card = p.hands[p.armyIndex].cards[c];
                moves.push(...this.getPieceMoves(p, i, card));
            }
        }
        return moves;
    }
}
