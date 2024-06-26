import { proxy } from 'comlink';

import { flipIndex, getDateTime } from '../../services/utils';
import { Army } from './army';
import { Board } from './board';
import { Color } from './color';
import { getFenStr, parseFenStr } from './fen';
import { Move, MoveType } from './move';
import { Mover } from './mover';
import { PieceType } from './piece';
import { Player, PlayerType } from './player';
import { assureTwoMasters, Position } from './position';

export enum GameStatus {
    CREATED = 'created',
    WAITING = 'waiting',
    STARTED = 'started',
    ENDED = 'ended',
}

export enum GameResult {
    WIN = 'win',
    WIN_BLUE = 'win-blue',
    WIN_RED = 'win-red',
    WIN_STONE = 'win-stone',
    WIN_STREAM = 'win-stream',
    INVALID_POSITION = 'invalid-position',
}

export class Game {
    id: number;
    creationTime: number;
    creationDate: string;
    status: GameStatus;
    players: Player[];
    armies: Army[];
    board: Board;
    positions: Position[] = [];
    moves: Move[] = [];
    possibleMoves: Move[] = [];
    mover = new Mover();
    results: Set<GameResult> = new Set();
    resultStr = '';
    bot: any;
    progressCB: ((armyIndex: number, progressPercent: number) => void) | null = null;
    debug = false;

    constructor(
        id: number,
        player0Name: string,
        player0Type: PlayerType,
        player1Name: string,
        player1Type: PlayerType,
        fenStr: string,
        progressCB: ((armyIndex: number, progressPercent: number) => void) | null,
    ) {
        this.id = id;
        const now = new Date();
        this.creationTime = now.getTime();
        this.creationDate = getDateTime(now);
        this.status = GameStatus.CREATED;
        if (player0Type === PlayerType.BOT || player1Type === PlayerType.BOT) {
            this.bot = new ComlinkWorker<typeof import('../bots/bot')>(new URL('../bots/bot', import.meta.url), {});
            this.progressCB = progressCB;
        }
        this.players = [new Player(player0Name, 0, player0Type), new Player(player1Name, 1, player1Type)];
        this.armies = [new Army(0, player0Type), new Army(1, player1Type)];
        this.board = new Board();
        this.applyFen(fenStr);
    }

    startGame() {
        this.status = GameStatus.STARTED;
    }

    getCurPosition(): Position {
        return this.positions[this.positions.length - 1];
    }

    getCurMove(): Move | null {
        return this.moves.length ? this.moves[this.moves.length - 1] : null;
    }

    getCurPlayer(): Player | null {
        const p = this.getCurPosition();
        return p ? this.players[p.armyIndex] : null;
    }

    pushMove(m: Move) {
        this.moves.push(m);
        if (this.debug) {
            console.log(`MOVE ${m.name}`);
        }
    }

    isGameWaiting(): boolean {
        return this.status === GameStatus.WAITING;
    }

    isGameGoing(): boolean {
        return this.status === GameStatus.STARTED;
    }

    isGameEnded(): boolean {
        return this.status === GameStatus.ENDED;
    }

    isRemoteGame(): boolean {
        return this.players[0].type === PlayerType.REMOTE || this.players[1].type === PlayerType.REMOTE;
    }

    isRemoteGameCreator(): boolean {
        return this.players[1].type === PlayerType.REMOTE;
    }

    checkForGameEnded() {
        const m = this.getCurMove();
        if (!m) {
            return;
        }
        if (!m.types.has(MoveType.WIN)) {
            return;
        }
        this.results.add(GameResult.WIN);
        if (m.types.has(MoveType.WIN_BLUE)) {
            this.results.add(GameResult.WIN_BLUE);
            this.resultStr = 'Blue victory by';
        } else if (m.types.has(MoveType.WIN_RED)) {
            this.results.add(GameResult.WIN_RED);
            this.resultStr = 'Red victory by';
        }
        if (m.types.has(MoveType.WIN_STONE) && m.types.has(MoveType.WIN_STREAM)) {
            this.results.add(GameResult.WIN_STONE);
            this.results.add(GameResult.WIN_STREAM);
            this.resultStr += ' the ways of the stone and the stream.';
        }
        if (m.types.has(MoveType.WIN_STONE)) {
            this.results.add(GameResult.WIN_STONE);
            this.resultStr += ' the way of the stone.';
        } else if (m.types.has(MoveType.WIN_STREAM)) {
            this.results.add(GameResult.WIN_STREAM);
            this.resultStr += ' the way of the stream.';
        }
        this.status = GameStatus.ENDED;
    }

    pushPosition(p: Position) {
        this.positions.push(p);
        if (this.debug) {
            console.log(`POSITION ${getFenStr(p)}`);
        }
        this.possibleMoves = this.mover.getAllPossibleMoves(p);
        this.checkForGameEnded();
    }

    applyFen(fenStr: string) {
        const p = parseFenStr(fenStr);
        if (!assureTwoMasters(p)) {
            this.results.add(GameResult.INVALID_POSITION);
            this.status = GameStatus.ENDED;
            alert('Invalid fen!');
            throw 'Invalid fen!';
        }
        this.board.clearAllPieces();
        for (let i = 0; i < 25; i++) {
            const char = p.pieceData[i];
            if (!char) {
                continue;
            }
            const color = char === char.toUpperCase() ? Color.BLUE : Color.RED;
            const armyIndex = color === Color.BLUE ? 0 : 1;
            const piece = this.armies[armyIndex].createAndAddPiece(char.toLowerCase() as PieceType);
            this.board.placePiece(piece, i);
        }
        this.pushPosition(p);
    }

    move(m: Move | undefined): Move | null {
        if (!m) {
            return null;
        }
        if (!m.types.has(MoveType.PASS_CARD_ONLY)) {
            const fromSquare = this.board.squares[m.from];
            const piece = fromSquare.piece;
            if (!piece) {
                return null;
            }
            if (m.types.has(MoveType.CAPTURE)) {
                const targetPieceName = this.board.squares[m.to].piece?.name || '';
                this.board.clearSquareByPieceName(targetPieceName);
                this.armies[flipIndex(m.armyIndex)].removePiece(targetPieceName);
            }
            this.board.movePiece(piece, m.from, m.to);
        }
        this.pushMove(m);
        this.pushPosition(m.newPosition);
        return m;
    }

    isBotTurn() {
        const p = this.getCurPosition();
        return p && this.isGameGoing() && this.armies[p.armyIndex].playerType === PlayerType.BOT;
    }

    isLocalTurn() {
        const p = this.getCurPosition();
        return p && this.isGameGoing() && this.armies[p.armyIndex].playerType === PlayerType.LOCAL;
    }

    isRemoteTurn() {
        const p = this.getCurPosition();
        return p && this.isGameGoing() && this.armies[p.armyIndex].playerType === PlayerType.REMOTE;
    }

    handleProgressCallback(armyIndex: number, progressPercent: number) {
        if (this.progressCB) {
            this.progressCB(armyIndex, progressPercent);
        }
    }

    async getBotMove() {
        const p = this.getCurPosition();
        const index = p.armyIndex;
        const [move, score]: [Move, number] = await this.bot['getBotMove'](this.players[index].name, p, proxy(this.handleProgressCallback.bind(this)));
        return {
            armyIndex: index,
            cardName: move.cardName,
            from: move.from,
            to: move.to,
            score,
        };
    }
}

export let g: Game | null = null;
export const setG = (game: Game) => {
    g = game;
};
