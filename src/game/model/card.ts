import { shuffleArray } from '../../services/utils';
import allCardsData from '../data/cards-data.json';
import { Color } from './color';

function sortHand(hand: string[], i: number, j: number) {
    if (hand[i] > hand[j]) {
        const temp = hand[i];
        hand[i] = hand[j];
        hand[j] = temp;
    }
}

export function get5RandomCardsNames(decks: string[]): string[] {
    const relevantCardsNames = allCards
        .filter((c) => {
            return decks.includes(c.deck);
        })
        .map((c) => c.name);
    const shuffledCardNames: string[] = shuffleArray(relevantCardsNames);
    shuffledCardNames.length = 5;
    sortHand(shuffledCardNames, 0, 1);
    sortHand(shuffledCardNames, 2, 3);
    return shuffledCardNames;
}

export function getStartingColor(cardName: string): Color {
    const card = allCards.find((c) => c.name === cardName)!;
    return card.start === 'blue' ? Color.BLUE : Color.RED;
}

export function getCardMoves(cardName: string): number[] {
    const card = allCards.find((c) => c.name === cardName)!;
    return card.moves;
}

export function rotateCardMove(dx: number, dy: number, armyIndex: number): [number, number] {
    return armyIndex === 0 ? [-dy, dx] : [dy, -dx];
}

export function passCard(cardData: string[], cardName: string): string[] {
    const cardNames0 = cardData[0].split(',');
    const cardNames1 = cardData[1].split(',');
    let index;
    index = cardNames0.indexOf(cardName);
    if (index > -1) {
        cardNames0.splice(index, 1);
        sortHand(cardNames0, 0, 1);
        sortHand(cardNames0, 2, 3);
        cardNames1.push(cardName);
    } else {
        index = cardNames1.indexOf(cardName);
        if (index > -1) {
            cardNames1.splice(index, 1);
            sortHand(cardNames1, 0, 1);
            sortHand(cardNames1, 2, 3);
            cardNames0.push(cardName);
        }
    }
    return [cardNames0.join(','), cardNames1.join(',')];
}

export class Card {
    name: string;
    moves: number[];
    start: string;
    deck: string;

    constructor(name: string, moves: number[], start: string, deck: string) {
        this.name = name;
        this.moves = moves;
        this.start = start;
        this.deck = deck;
    }
}

const allCards: Card[] = allCardsData.map((cd) => new Card(cd.name, cd.moves, cd.start, cd.deck));
