import { Card, CardState, createCardInstance } from './card';

export function passCard(cardName: string) {}

export class Hand {
    playerIndex: number;
    cards: Card[];

    constructor(playerIndex: number) {
        this.playerIndex = playerIndex;
        this.cards = [];
    }

    getCard(name): Card | null {
        return this.cards.find((c) => c.name === name) || null;
    }

    createAndAddCard(cardName: string, cardState: CardState): Card {
        const card = createCardInstance(cardName, this.playerIndex, cardState);
        this.cards.push(card);
        return card;
    }

    removeCard(name: string): boolean {
        const index = this.cards.findIndex((c) => c.name === name);
        if (index === -1) {
            return false;
        }
        this.cards.splice(index, 1);
        return true;
    }

    emptyHand() {
        this.cards = [];
    }
}
