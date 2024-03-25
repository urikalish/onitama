import { Position } from '../model/position';
import { getRedScoreBasic } from './bot-scoring';

export type botConfig = {
    name: string;
    depth: number;
    scoreFunc: (p: Position) => number;
    useAlphaBeta: boolean;
    useScoresCache: boolean;
};
export const botConfigs: botConfig[] = [
    {
        name: 'bot0',
        depth: 0,
        scoreFunc: getRedScoreBasic,
        useAlphaBeta: true,
        useScoresCache: false,
    },
    {
        name: 'bot1',
        depth: 1,
        scoreFunc: getRedScoreBasic,
        useAlphaBeta: true,
        useScoresCache: false,
    },
    {
        name: 'bot2',
        depth: 2,
        scoreFunc: getRedScoreBasic,
        useAlphaBeta: true,
        useScoresCache: false,
    },
    {
        name: 'bot3',
        depth: 3,
        scoreFunc: getRedScoreBasic,
        useAlphaBeta: true,
        useScoresCache: false,
    },
    {
        name: 'bot4',
        depth: 4,
        scoreFunc: getRedScoreBasic,
        useAlphaBeta: true,
        useScoresCache: false,
    },
    {
        name: 'bot5',
        depth: 5,
        scoreFunc: getRedScoreBasic,
        useAlphaBeta: true,
        useScoresCache: false,
    },
    {
        name: 'test0',
        depth: 2,
        scoreFunc: getRedScoreBasic,
        useAlphaBeta: true,
        useScoresCache: false,
    },
    {
        name: 'test1',
        depth: 2,
        scoreFunc: getRedScoreBasic,
        useAlphaBeta: true,
        useScoresCache: false,
    },
];
