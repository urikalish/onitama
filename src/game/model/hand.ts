import { Card, CardState } from './card';
import { Piece, PieceType } from './piece';

export class Hand {
    playerIndex: number;
    cards: Card[];

    constructor(playerIndex: number) {
        this.playerIndex = playerIndex;
        this.cards = [];
    }

    getCard(name) {
        return this.cards.find((c) => c.name === name);
    }

    createAndAddCard(cardName: string, cardState: CardState): Card {
        const piece = new Piece(this.index, pieceType);
        this.pieces.push(piece);
        return piece;
    }

    addCard(card: Card, cardState: CardState) {
        card.playerIndex = this.playerIndex;
        card.state = cardState;
        this.cards.push(card);
    }

    removeCard(name: string) {
        const index = this.cards.findIndex((c) => c.name === name);
        if (index === -1) {
            return;
        }
        this.cards.splice(index, 1);
    }
}
