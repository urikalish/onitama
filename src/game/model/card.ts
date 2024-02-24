import { shuffleArray } from '../../services/utils';
import allCardsData from '../data/cards-data.json';

export enum CardState {
    USABLE = 'usable',
    WAITING = 'waiting',
}

export function createInstance(cardName: string, playerIndex: number, state: CardState) {
    const cardData = allCardsData.filter((c) => c.name === cardName);
    return new Card(cardData.name, cardData.moves, cardData.start, cardData.deck, playerIndex, state);
}

export function getFiveRandomCardNames(decs: string[]) {
    const relevantCardsNames = allCardsData
        .filter((cd) => {
            return decs.includes(cd.deck);
        })
        .map((cd) => cd.name);
    const shuffledCardNames = shuffleArray(relevantCardsNames);
    shuffledCardNames.length = 5;
    return shuffledCardNames;
}

export function getStartingColor(cardName: string) {
    const cardData = allCardsData.filter((c) => c.name === cardName);
    return cardData.start;
}

export class Card {
    name: string;
    moves: number[];
    start: string;
    deck: string;
    playerIndex: number;
    state: CardState;

    constructor(name: string, moves: number[], start: string, deck: string, playerIndex: number, state: CardState) {
        this.name = name;
        this.moves = moves;
        this.start = start;
        this.deck = deck;
        this.playerIndex = playerIndex;
        this.state = state;
    }
}
