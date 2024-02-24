import { shuffleArray } from '../../services/utils';
import allCardsData from '../data/cards-data.json';
import { Color } from './color';

export enum CardState {
    USABLE = 'usable',
    WAITING = 'waiting',
}

export function createCardInstance(cardName: string, playerIndex: number, state: CardState) {
    const cardData = allCardsData.filter((c) => c.name === cardName);
    const card = new Card(cardData.name, cardData.moves, cardData.start, cardData.deck);
    card.playerIndex = playerIndex;
    card.state = state;
    return card;
}

export function getFiveRandomCardNames(decs: string[]): string[] {
    const relevantCardsNames = allCardsData
        .filter((cd) => {
            return decs.includes(cd.deck);
        })
        .map((cd) => cd.name);
    const shuffledCardNames: string[] = shuffleArray(relevantCardsNames);
    shuffledCardNames.length = 5;
    return shuffledCardNames;
}

export function getStartingColor(cardName: string): Color {
    const cardData = allCardsData.filter((c) => c.name === cardName);
    return cardData.start === 'blue' ? Color.BLUE : Color.RED;
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
