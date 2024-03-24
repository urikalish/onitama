import { proxy } from 'comlink';

import { flipIndex } from '../../services/utils';
import { Army } from './army';
import { Board } from './board';
import { getRandomCardsNames, getStartingColor } from './card';
import { Color } from './color';
import { Fen } from './fen';
import { Move, MoveType } from './move';
import { Mover } from './mover';
import { PieceType } from './piece';
import { Player, PlayerType } from './player';
import { assureTwoMasters, Position } from './position';

export enum GameResult {
    WIN = 'win',
    WIN_BLUE = 'win-blue',
    WIN_RED = 'win-red',
    WIN_STONE = 'win-stone',
    WIN_STREAM = 'win-stream',
    INVALID_POSITION = 'invalid-position',
}

export class Game {
    players: Player[];
    armies: Army[];
    board: Board;
    positions: Position[] = [];
    moves: Move[] = [];
    possibleMoves: Move[] = [];
    startTime = 0;
    mover = new Mover();
    results: Set<GameResult> = new Set();
    resultStr = '';
    bot: any;
    progressCB: ((armyIndex: number, progressPercent: number) => void) | null = null;

    constructor(
        player0Name: string,
        player0Type: PlayerType,
        player1Name: string,
        player1Type: PlayerType,
        cardNames: string[],
        progressCB: ((armyIndex: number, progressPercent: number) => void) | null,
    ) {
        this.players = [new Player(player0Name, 0, player0Type), new Player(player1Name, 1, player1Type)];
        this.armies = [new Army(0, player0Type), new Army(1, player1Type)];
        this.board = new Board();
        const cNames = cardNames.length === 5 ? cardNames : getRandomCardsNames(['base'], 5);
        const cardNames0: string[] = [cNames[0], cNames[1]];
        const cardNames1: string[] = [cNames[2], cNames[3]];
        let startingColor;
        if (player0Type === PlayerType.HUMAN && player1Type === PlayerType.BOT) {
            startingColor = Color.BLUE;
        } else if (player0Type === PlayerType.BOT && player1Type === PlayerType.HUMAN) {
            startingColor = Color.RED;
        } else {
            startingColor = getStartingColor(cNames[4]);
        }
        if (startingColor === Color.BLUE) {
            cardNames0.push(cNames[4]);
        } else {
            cardNames1.push(cNames[4]);
        }
        this.applyFen(`S3s/S3s/M3m/S3s/S3s ${cardNames0.join(',')} ${cardNames1.join(',')} 1`);
        this.bot = new ComlinkWorker<typeof import('../bots/bot')>(new URL('../bots/bot', import.meta.url), {});
        this.progressCB = progressCB;
    }

    startGame(startTime: number) {
        this.startTime = startTime;
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
    }

    isGameGoing(): boolean {
        return this.results.size === 0;
    }

    isGameEnded(): boolean {
        return !this.isGameGoing();
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
            this.resultStr = 'Blue wins by';
        } else if (m.types.has(MoveType.WIN_RED)) {
            this.results.add(GameResult.WIN_RED);
            this.resultStr = 'Red wins by';
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
    }

    pushPosition(p: Position) {
        this.positions.push(p);
        this.possibleMoves = this.mover.getAllPossibleMoves(p);
        this.checkForGameEnded();
    }

    applyFen(fenStr: string) {
        const p = Fen.parseFenStr(fenStr);
        if (!assureTwoMasters(p)) {
            this.results.add(GameResult.INVALID_POSITION);
            alert('Missing some masters...');
        }
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

    isHumanTurn() {
        const p = this.getCurPosition();
        return p && this.isGameGoing() && this.armies[p.armyIndex].playerType === PlayerType.HUMAN;
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
            cardName: move.cardName,
            from: move.from,
            to: move.to,
            score,
        };
    }
}
