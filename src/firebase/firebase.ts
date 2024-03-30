import { initializeApp } from 'firebase/app';
import { Database, getDatabase, onValue, ref, set } from 'firebase/database';

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
export function fbWaitForJoining(g: Game, cb: (status: string) => void) {
    const statusRef = ref(db, `games/${g.id}/status`);
    onValue(statusRef, (snapshot) => {
        const status = snapshot.val();
        cb(status);
    });
}

export function fbEndGame(g: Game) {
    try {
        set(ref(db, `games/${g.id}/status`), GameStatus.ENDED.toString()).then(() => {});
    } catch (err) {
        alert(err);
    }
}
