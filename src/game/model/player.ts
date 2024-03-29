import { Color } from './color';

export enum PlayerType {
    LOCAL = 'local',
    REMOTE = 'remote',
    BOT = 'bot',
}

export class Player {
    name: string;
    index: number;
    color: Color;
    type: PlayerType;

    constructor(name: string, index: number, type: PlayerType) {
        this.index = index;
        this.name = name;
        this.color = index === 0 ? Color.BLUE : Color.RED;
        this.type = type;
    }
}
