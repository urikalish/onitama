import { Color } from './color';

export enum PlayerType {
    HUMAN = 'human',
    BOT = 'bot',
}

export class Player {
    name: string;
    index: number;
    color: Color;
    type: PlayerType;
    strength: number;

    constructor(name: string, index: number, type: PlayerType, strength: number = 0) {
        this.index = index;
        this.name = name;
        this.color = index === 0 ? Color.BLUE : Color.RED;
        this.type = type;
        this.strength = strength;
    }
}
