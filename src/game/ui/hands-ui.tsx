import './hands.css';

import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

import { Position } from '../model/position';

function fixName(name: string) {
    return name.replaceAll('_', ' ');
}

type HandsUIProps = {
    p: Position;
};

export function HandsUi({ p }: HandsUIProps) {
    const [cards, setCards] = useState<string[][]>([]);

    useEffect(() => {
        setCards([p.handsData[0].split(','), p.handsData[1].split(',')]);
    }, [p.handsData]);

    return (
        <Box className="hands">
            <Box className="hand hand--blue">
                {cards[0] && <Box className={`card card--blue ${p.armyIndex === 0 ? 'card--usable' : ''}`}>{fixName(cards[0][0])}</Box>}
                {cards[0] && <Box className={`card card--blue ${p.armyIndex === 0 ? 'card--usable' : ''}`}>{fixName(cards[0][1])}</Box>}
                {cards[0] && cards[0][2] && <Box className="card card--blue card--waiting">{fixName(cards[0][2])}</Box>}
            </Box>
            <Box className="hand hand--red">
                {cards[1] && <Box className={`card card--red ${p.armyIndex === 1 ? 'card--usable' : ''}`}>{fixName(cards[1][0])}</Box>}
                {cards[1] && <Box className={`card card--red ${p.armyIndex === 1 ? 'card--usable' : ''}`}>{fixName(cards[1][1])}</Box>}
                {cards[1] && cards[1][2] && <Box className="card card--red card--waiting">{fixName(cards[1][2])}</Box>}
            </Box>
        </Box>
    );
}
