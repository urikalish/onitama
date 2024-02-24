import { Card, CardState, createCardInstance } from './card';

export function passAndActivate(cardName: string, fromHand: Hand, toHand: Hand) {
    const card = fromHand.removeCard(cardName);
    card.playerIndex = toHand.playerIndex;
    card.state = CardState.WAITING;
    toHand.addCard(card);
    fromHand.cards[1].state = CardState.USABLE;
}

export class Hand {
    playerIndex: number;
    cards: Card[];

    constructor(playerIndex: number, cardNames: string[]) {
        this.playerIndex = playerIndex;
        this.cards = [];
        for (let i = 0; i < cardNames.length; i++) {
            this.cards.push(createCardInstance(cardNames[i], playerIndex, i < 2 ? CardState.USABLE : CardState.WAITING));
        }
    }

    removeCard(name: string): Card {
        const index = this.cards.findIndex((c) => c.name === name);
        const card = this.cards[index];
        this.cards.splice(index, 1);
        return card;
    }

    addCard(card: Card): Card {
        this.cards.push(card);
        return card;
    }

    getCardNames(): string[] {
        return this.cards.map((c) => c.name);
    }
}
