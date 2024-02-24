import { shuffleArray } from '../../services/utils';
import allCardsData from '../data/cards-data.json';
import { Color } from './color';

const allCards: Card[] = allCardsData.map((cd) => new Card(cd.name, cd.moves, cd.start, cd.deck));

export enum CardState {
    USABLE = 'usable',
    WAITING = 'waiting',
}

export function getRandomCardsNames(decs: string[], numberOfCards: number = 5): string[] {
    const relevantCardsNames = allCards
        .filter((c) => {
            return decs.includes(c.deck);
        })
        .map((c) => c.name);
    const shuffledCardNames: string[] = shuffleArray(relevantCardsNames);
    shuffledCardNames.length = numberOfCards;
    return shuffledCardNames;
}

export function getStartingColor(cardName: string): Color {
    const card = allCards.find((c) => c.name === cardName)!;
    return card.start === 'blue' ? Color.BLUE : Color.RED;
}

export function createCardInstance(cardName: string, playerIndex: number, state: CardState): Card {
    const card = allCards.find((c) => c.name === cardName)!;
    const newCard: Card = new Card(card.name, card.moves, card.start, card.deck);
    newCard.playerIndex = playerIndex;
    newCard.state = state;
    return newCard;
}

export class Card {
    name: string;
    moves: number[];
    start: string;
    deck: string;
    playerIndex: number = -1;
    state: CardState = CardState.WAITING;

    constructor(name: string, moves: number[], start: string, deck: string) {
        this.name = name;
        this.moves = moves;
        this.start = start;
        this.deck = deck;
    }
}
