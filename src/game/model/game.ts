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
    // botWorker: Worker = new Worker('js/bot-worker.min.js');
    // botWorker: Worker = new Worker('js/bot-worker.js');
    // onBotWorkerProgress: any | null = null;

    constructor(player0Type: PlayerType, player0Name: string, player1Type: PlayerType, player1Name: string, decks: string[]) {
        this.players = [new Player(0, player0Type, player0Name), new Player(1, player1Type, player1Name)];
        this.armies = [new Army(0, player0Type), new Army(1, player1Type)];
        this.board = new Board();
        const cardNames = getRandomCardsNames(decks, 5);
        const cardNames0: string[] = [cardNames[0], cardNames[1]];
        const cardNames1: string[] = [cardNames[2], cardNames[3]];
        const startingColor = getStartingColor(cardNames[4]);
        if (startingColor === Color.BLUE) {
            cardNames0.push(cardNames[4]);
        } else {
            cardNames1.push(cardNames[4]);
        }
        this.applyFen(`S3s/S3s/M3m/S3s/S3s ${cardNames0.join(',')} ${cardNames1.join(',')} 1`);
        // this.botWorker.onmessage = this.handleBotWorkerMessage.bind(this);
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

    getMoveNames(): string[] {
        const moveNames: string[] = [];
        this.moves.forEach((m) => {
            moveNames.push(m.name);
        });
        return moveNames;
    }

    getCurPlayer(): Player | null {
        const p = this.getCurPosition();
        return p ? this.players[p.armyIndex] : null;
    }

    pushMove(m: Move) {
        this.moves.push(m);
    }

    hasMoves(): boolean {
        return this.moves.length > 0;
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

    // isBotTurn() {
    //     const p = this.getCurPosition();
    //     return p && !this.isEnded() && this.armies[p.armyIndex].playerType === PlayerType.BOT;
    // }
    //
    // isHumanTurn() {
    //     const p = this.getCurPosition();
    //     return p && !this.isEnded() && this.armies[p.armyIndex].playerType === PlayerType.HUMAN;
    // }
    //
    // goComputeBotWorkerMove() {
    //     const p = this.getCurPosition();
    //     const botName = this.getCurPlayer()?.name || '';
    //     if (!p || !botName) {
    //         return null;
    //     }
    //     this.botWorker.postMessage({ botName, position: this.getCurPosition(), moveNames: this.getMoveNames() });
    // }
    //
    // handleBotWorkerMessage(e: any) {
    //     if (this.onBotWorkerProgress) {
    //         this.onBotWorkerProgress(e['data']['progress'], e['data']['moveName']);
    //     }
    // }
}
