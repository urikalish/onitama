import { get5RandomCardsNames, getStartingColor } from './card';
import { Color } from './color';
import { Game, GameResult } from './game';
import { PlayerType } from './player';

export async function goTest() {
    const NUM_OF_GAMES = 100;
    const wins = [0, 0];
    for (let i = 0; i < NUM_OF_GAMES; i++) {
        const cardNames: string[] = get5RandomCardsNames(['base', 'path', 'wind', 'promo']);
        const cardNames0: string[] = [cardNames[0], cardNames[1]];
        const cardNames1: string[] = [cardNames[2], cardNames[3]];
        const startingColor = getStartingColor(cardNames[4]);
        if (startingColor === Color.BLUE) {
            cardNames0.push(cardNames[4]);
        } else {
            cardNames1.push(cardNames[4]);
        }
        const fenStr = `S3s/S3s/M3m/S3s/S3s ${cardNames0.join(',')}/${cardNames1.join(',')} 1`;
        const g = new Game('test0', PlayerType.BOT, 'test1', PlayerType.BOT, fenStr, null);
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
