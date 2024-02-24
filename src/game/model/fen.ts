import { Hand } from './hand';
import { createPositionInstance, Position } from './position';

export class Fen {
    // S3s/S3s/M3m/S3s/S3s c1/c2/c3 c4/c5 0 1;

    static parseFenStr(fenStr: string): Position {
        const parts = fenStr.split(' ');
        const pd: string[] = [];
        const rows = parts[0].split(`/`);
        rows.forEach((row: string) => {
            for (let i = 0; i < row.length; i++) {
                if (['1', '2', '3', '4', '5'].includes(row[i])) {
                    pd.push(...new Array(Number(row[i])).fill(''));
                } else {
                    pd.push(row[i]);
                }
            }
        });
        const hands = [new Hand(0, parts[1].split(`/`)), new Hand(1, parts[2].split(`/`))];
        return createPositionInstance(pd, hands, Number(parts[3]), Number(parts[4]));
    }

    static getFenStr(p: Position | null, includeHands = true, includeHalfMoveClock = true, includeHalfMoveNum = true): string {
        if (!p) {
            return '';
        }
        const parts: string[] = [];
        const pd: string[] = [];
        let emptySquaresCount = 0;
        for (let i = 0; i < 64; i++) {
            if (i % 8 === 0) {
                if (i !== 0) {
                    pd.push(`/`);
                }
                emptySquaresCount = 0;
            }
            if (p.pieceData[i]) {
                if (emptySquaresCount > 0) {
                    pd.push(String(emptySquaresCount));
                }
                pd.push(p.pieceData[i]);
                emptySquaresCount = 0;
            } else {
                emptySquaresCount++;
            }
            if (i % 8 === 7 && emptySquaresCount > 0) {
                pd.push(String(emptySquaresCount));
            }
        }
        parts[0] = pd.join('');
        if (includeHands) {
            parts[1] = p.hands[0].getCardNames().join('/');
            parts[2] = p.hands[1].getCardNames().join('/');
        }
        if (includeHalfMoveClock) {
            parts[3] = String(p.halfMoveClock);
        }
        if (includeHalfMoveNum) {
            parts[4] = String(p.halfMoveNum);
        }
        return parts.join(' ');
    }
}
