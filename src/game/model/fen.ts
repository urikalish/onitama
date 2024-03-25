import { createPositionInstance, Position } from './position';

// S3s/S3s/M3m/S3s/S3s c1,c2,c3 c4,c5 1;

export function parseFenStr(fenStr: string): Position {
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
    const hands0Data: string[] = parts[1].split(',');
    const hands1Data: string[] = parts[2].split(',');
    const armyIndex = hands0Data.length > hands1Data.length ? 0 : 1;
    return createPositionInstance(armyIndex, pd, [parts[1], parts[2]], Number(parts[3]));
}

export function getFenStr(p: Position | null, includeHands = true, includeMoveNum = true): string {
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
        parts[1] = p.handsData[0];
        parts[2] = p.handsData[1];
    }
    if (includeMoveNum) {
        parts[3] = String(p.moveNum);
    }
    return parts.join(' ');
}
