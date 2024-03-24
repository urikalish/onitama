import { getRandomCardsNames } from './card';
import { Game, GameResult } from './game';
import { PlayerType } from './player';

export async function goTest(numberOfGames: number) {
    const wins = [0, 0];
    for (let i = 0; i < numberOfGames; i++) {
        const cardNames = getRandomCardsNames(['base', 'path', 'wind', 'promo'], 5);
        const g = new Game('test0', PlayerType.BOT, 'test1', PlayerType.BOT, cardNames, null);
        g.startGame(Date.now());
        do {
            const bm = await g.getBotMove();
            const m = g.possibleMoves.filter((m) => m.cardName === bm.cardName && m.from === bm.from && m.to === bm.to)[0];
            g.move(m);
        } while (g.isGameGoing());
        if (g.results.has(GameResult.WIN_BLUE)) {
            wins[0]++;
        } else {
            wins[1]++;
        }
        console.log(`[${wins}] ${((wins[0] / (wins[0] + wins[1])) * 100).toFixed(1)}% , ${((wins[1] / (wins[0] + wins[1])) * 100).toFixed(1)}%`);
    }
}
