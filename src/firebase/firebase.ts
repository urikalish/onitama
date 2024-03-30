import { initializeApp } from 'firebase/app';
import { Database, get, getDatabase, onValue, ref, remove, set } from 'firebase/database';

import { getFenStr } from '../game/model/fen';
import { Game, GameStatus } from '../game/model/game';
import { Move } from '../game/model/move';

let db: Database;

export function initFirebaseApp() {
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

export async function fbGet(path: string) {
    try {
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

async function fbSet(path: string, value: any) {
    try {
        return await set(ref(db, path), value);
    } catch (err) {
        alert(err);
    }
}

function fbOnChangeValue(path: string, cb: (value: any) => void) {
    try {
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
        const dbRef = ref(db, path);
        remove(dbRef).then(() => {});
    } catch (err) {
        alert(err);
    }
}

export async function fbGetGameRecord(gameId: number): Promise<any> {
    return fbGet(`games/${gameId}`);
}

export function fbCreateGame(g: Game) {
    fbSet(`games/${g.id}`, {
        cTime: g.creationTime,
        cDate: g.creationDate,
        status: g.status.toString(),
        position: getFenStr(g.getCurPosition()),
    }).then(() => {});
}
export function fbSetMove(gameId: number, m: Move) {
    fbSet(`games/${gameId}/move`, {
        moveNum: m.moveNum,
        armyIndex: m.armyIndex,
        cardName: m.cardName,
        from: m.from,
        to: m.to,
        name: m.name,
        types: Array.from(m.types).toString(),
    }).then(() => {});
}

export function fbStartGame(gameId: number) {
    fbSet(`games/${gameId}/status`, GameStatus.STARTED.toString()).then(() => {});
}

export function fbEndGame(gameId: number) {
    fbSet(`games/${gameId}/status`, GameStatus.ENDED.toString()).then(() => {});
}

export function fbDeleteGame(gameId: number) {
    fbRemove(`games/${gameId}`);
}

export function fbWaitForStatusChange(gameId: number, cb: (status: string) => void) {
    fbOnChangeValue(`games/${gameId}/status`, cb);
}

export function fbWaitForMove(gameId: number, cb: (moveRec: any) => void) {
    fbOnChangeValue(`games/${gameId}/move`, cb);
}
