import { initializeApp } from 'firebase/app';
import { Database, get, getDatabase, onValue, ref, set } from 'firebase/database';

import { getFenStr } from '../game/model/fen';
import { Game, GameStatus } from '../game/model/game';

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

export async function fbCreateGame(g: Game) {
    try {
        return await set(ref(db, `games/${g.id}`), {
            cTime: g.creationTime,
            cDate: g.creationDate,
            status: g.status.toString(),
            position: getFenStr(g.getCurPosition()),
        });
    } catch (err) {
        alert(err);
    }
}
export function fbWaitForJoining(id: number, cb: (status: string) => void) {
    try {
        const statusRef = ref(db, `games/${id}/status`);
        onValue(statusRef, (snapshot) => {
            const status = snapshot.val();
            cb(status);
        });
    } catch (err) {
        alert(err);
    }
}

export async function fbGetGameRecord(gameIdStr: number): Promise<any> {
    try {
        const valueRef = ref(db, `games/${gameIdStr}`);
        const snapshot = await get(valueRef);
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return null;
        }
    } catch (err) {
        return null;
    }
}

export function fbStartGame(id: number) {
    try {
        set(ref(db, `games/${id}/status`), GameStatus.STARTED.toString()).then(() => {});
    } catch (err) {
        alert(err);
    }
}

export function fbEndGame(g: Game) {
    try {
        set(ref(db, `games/${g.id}/status`), GameStatus.ENDED.toString()).then(() => {});
        set(ref(db, `games/${g.id}/result`), g.resultStr).then(() => {});
    } catch (err) {
        alert(err);
    }
}
