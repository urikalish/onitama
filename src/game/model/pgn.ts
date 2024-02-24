import { Game, GameResult } from './game';

export class Pgn {
    static getPgnStr(game: Game, logText: string): string {
        const date = new Date(game.startTime);
        let monthStr = date.toLocaleDateString('en-US', { month: 'numeric' });
        monthStr = monthStr.length === 1 ? '0' + monthStr : monthStr;
        let dayStr = date.toLocaleDateString('en-US', { day: 'numeric' });
        dayStr = dayStr.length === 1 ? '0' + dayStr : dayStr;
        const dateStr = `${date.toLocaleDateString('en-US', { year: 'numeric' })}.${monthStr}.${dayStr}`;
        let resultStr = '*';
        if (game.results.size > 0) {
            if (game.results.has(GameResult.WIN_BY_BLUE)) {
                resultStr = `Blue 1 - 0 Red`;
            } else if (game.results.has(GameResult.WIN_BY_RED)) {
                resultStr = `Blue 0 - 1 Red`;
            } else {
                resultStr = `Blue 1/2 - 1/2 Red`;
            }
        }
        return (
            `[Event "Online Onitama game"]\n` +
            `[Site "https://kalish-onitama.netlify.app"]\n` +
            `[Date "${dateStr}"]\n` +
            `[Round "N/A"]\n` +
            `[Blue "${game.players[0].type}"]\n` +
            `[Red "${game.players[1].type}"]\n` +
            `[Result "${resultStr}"]\n\n` +
            `${logText}`
        );
    }
}
