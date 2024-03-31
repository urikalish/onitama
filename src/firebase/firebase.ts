import { initializeApp } from 'firebase/app';
import { Database, get, getDatabase, off, onValue, push, ref, remove, set } from 'firebase/database';

import { getFenStr } from '../game/model/fen';
import { Game, GameStatus } from '../game/model/game';
import { Move } from '../game/model/move';
import { Position } from '../game/model/position';
import { getDateTime } from '../services/utils';

let db: Database;

function initFirebaseApp() {
    const firebaseConfig = {
        apiKey: 'AIzaSyBsO40MyUVaNRhyhuxqmYbi0IyjTaRUKWs',
        authDomain: 'kalish-onitama.firebaseapp.com',
        databaseURL: 'https://kalish-onitama-default-rtdb.europe-west1.firebasedatabase.app',
        projectId: 'kalish-onitama',
        storageBucket: 'kalish-onitama.appspot.com',
        messagingSenderId: '248146963421',
        appId: '1:248146963421:web:851cf82d61502fe2632434',
        measurementId: 'G-P3C8K2H1Z3',
    };
    const fbApp = initializeApp(firebaseConfig);
    db = getDatabase(fbApp);
}

function ensureDb() {
    if (!db) {
        initFirebaseApp();
    }
}

export async function fbGet(path: string) {
    try {
        ensureDb();
        const dbRef = ref(db, path);
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return null;
        }
    } catch (err) {
        return null;
    }
}

function fbSet(path: string, value: any) {
    try {
        ensureDb();
        set(ref(db, path), value).then(() => {});
    } catch (err) {
        alert(err);
    }
}

function fbPush(path: string, value: any) {
    try {
        ensureDb();
        push(ref(db, path), value).then(() => {});
    } catch (err) {
        alert(err);
    }
}

function fbOnChangeValue(path: string, cb: (value: any) => void) {
    try {
        ensureDb();
        const dbRef = ref(db, path);
        onValue(dbRef, (snapshot) => {
            const value = snapshot.val();
            cb(value);
        });
    } catch (err) {
        alert(err);
    }
}

function fbRemove(path: string) {
    try {
        ensureDb();
        const dbRef = ref(db, path);
        remove(dbRef).then(() => {});
    } catch (err) {
        alert(err);
    }
}

function fbDetach(path: string) {
    try {
        ensureDb();
        const dbRef = ref(db, path);
        off(dbRef);
    } catch (err) {
        alert(err);
    }
}

function fbAudit(gameId: number, msg: string) {
    fbPush(`games/${gameId}/audit`, msg);
}

export function fbCreateGame(g: Game) {
    const p = g.getCurPosition();
    const fenStr = getFenStr(p);
    fbSet(`games/${g.id}`, {
        id: g.id,
        cTime: g.creationTime,
        cDate: g.creationDate,
        cFen: fenStr,
        status: g.status.toString(),
    });
    fbAudit(g.id, `Game created at ${g.creationDate}`);
    fbAudit(g.id, fenStr);
    fbAudit(g.id, `${g.getCurPlayer()!.index === 0 ? 'Blue' : 'Red'} will move first`);
}
export function fbWaitForStatusChange(gameId: number, cb: (status: string) => void) {
    fbAudit(gameId, 'Creator waiting for opponent...');
    fbOnChangeValue(`games/${gameId}/status`, cb);
}

export async function fbGetGameRecord(gameId: number): Promise<any> {
    return fbGet(`games/${gameId}`);
}

export function fbStartGame(gameId: number) {
    fbAudit(gameId, `Game started at ${getDateTime(new Date())}`);
    fbSet(`games/${gameId}/status`, GameStatus.STARTED.toString());
}

export function fbWaitForMove(gameId: number, cb: (moveRec: any) => void) {
    fbOnChangeValue(`games/${gameId}/move`, cb);
}

export function fbSetMove(gameId: number, m: Move) {
    fbSet(`games/${gameId}/move`, {
        armyIndex: m.armyIndex,
        cardName: m.cardName,
        from: m.from,
        moveNum: m.moveNum,
        name: m.name,
        to: m.to,
        types: Array.from(m.types).toString(),
    });
    fbAudit(gameId, `${m.armyIndex === 0 ? 'Blue' : 'Red'} ${m.name}`);
}

export function fbSetPosition(gameId: number, p: Position) {
    const fenStr = getFenStr(p);
    fbSet(`games/${gameId}/position`, {
        armyIndex: p.armyIndex,
        fenStr: fenStr,
        positionNum: p.positionNum,
    });
    fbAudit(gameId, fenStr);
}

export function fbEndGame(gameId: number, resultStr: string) {
    fbSet(`games/${gameId}/status`, GameStatus.ENDED.toString());
    fbSet(`games/${gameId}/result`, resultStr);
    fbAudit(gameId, `Game ended. ${resultStr}`);
    setTimeout(() => {
        fbDetach(`games/${gameId}`);
    }, 5000);
}

export function fbDeleteGame(gameId: number) {
    fbDetach(`games/${gameId}`);
    fbRemove(`games/${gameId}`);
}

export function fbDeleteAllOldGames(timeDiff: number) {
    (async () => {
        const allGames = await fbGet(`games`);
        if (!allGames) {
            return;
        }
        let count = 0;
        const cutoff = Date.now() - timeDiff;
        for (const gameId in allGames) {
            const gameRec = allGames[gameId];
            if (gameRec.cTime < cutoff) {
                fbDeleteGame(Number(gameId));
                count++;
            }
        }
        alert(`${count} games deleted`);
    })();
}
