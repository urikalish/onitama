import './hands.css';

import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

type HandsUIProps = {
    handsData: string[];
    activePlayerIndex: number;
};

export function HandsUi({ handsData, activePlayerIndex }: HandsUIProps) {
    const [cardsBlue, setCardsBlue] = useState<string[]>([]);
    const [cardsRed, setCardsRed] = useState<string[]>([]);

    useEffect(() => {
        if (!handsData) {
            return;
        }
        setCardsBlue(handsData[0].split(','));
        setCardsRed(handsData[1].split(','));
    }, [handsData]);

    return (
        handsData && (
            <Box className="hands">
                <Box className="hand hand--blue">
                    {cardsBlue[0] && <Box className={`card card--blue ${activePlayerIndex === 0 ? 'card--usable' : ''}`}>{cardsBlue[0]}</Box>}
                    {cardsBlue[1] && <Box className={`card card--blue ${activePlayerIndex === 0 ? 'card--usable' : ''}`}>{cardsBlue[1]}</Box>}
                    {cardsBlue[2] && <Box className="card card--blue card--waiting">{cardsBlue[2]}</Box>}
                </Box>
                <Box className="hand hand--red">
                    {cardsRed[0] && <Box className={`card card--red ${activePlayerIndex === 1 ? 'card--usable' : ''}`}>{cardsRed[0]}</Box>}
                    {cardsRed[1] && <Box className={`card card--red ${activePlayerIndex === 1 ? 'card--usable' : ''}`}>{cardsRed[1]}</Box>}
                    {cardsRed[2] && <Box className="card card--red card--waiting">{cardsRed[2]}</Box>}
                </Box>
            </Box>
        )
    );
}
