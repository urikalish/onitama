import { Color } from './color';

export enum PlayerType {
    HUMAN = 'human',
    BOT = 'bot',
}

export class Player {
    index: number;
    color: Color;
    type: PlayerType;
    name: string;

    constructor(index: number, type: PlayerType, name: string) {
        this.index = index;
        this.color = index === 0 ? Color.BLUE : Color.RED;
        this.type = type;
        this.name = name;
    }
}
