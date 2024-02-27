import './hands.css';

import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

function fixName(name: string) {
    return name.replaceAll('_', ' ');
}

type HandsUIProps = {
    handsData: string[];
    activePlayerIndex: number;
};

export function HandsUi({ handsData, activePlayerIndex }: HandsUIProps) {
    const [cards, setCards] = useState<string[][]>([]);

    useEffect(() => {
        setCards([handsData[0].split(','), handsData[1].split(',')]);
    }, [handsData]);

    return (
        handsData && (
            <Box className="hands">
                {
                    [[0,'blue'],[1,'red']].map(h => (
                        <Box key={h[0]} className={`hand hand--${h[1]}`}>
                            {cards[h[0]] && cards[h[0]][0] && <Box className={`card card--${h[1]} ${activePlayerIndex === h[0] ? 'card--usable' : ''}`}>{fixName(cards[h[0]][0])}</Box>}
                            {cards[h[0]] && cards[h[0]][1] && <Box className={`card card--${h[1]} ${activePlayerIndex === h[0] ? 'card--usable' : ''}`}>{fixName(cards[h[0]][1])}</Box>}
                            {cards[h[0]] && cards[h[0]][2] && <Box className={`card card--${h[1]}`}>{fixName(cards[h[0]][2])}</Box>}
                        </Box>
                    ))
                }
            </Box>
        )
    );
}
