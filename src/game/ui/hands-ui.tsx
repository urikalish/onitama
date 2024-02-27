import './hands.css';

import { Box } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

import { Move } from '../model/move';
import { Position } from '../model/position';

function fixName(name: string) {
    return name.replaceAll('_', ' ');
}

type HandsUIProps = {
    p: Position;
    possibleMoves: Move[];
    onSelectCard: (cardName: string) => void;
};

export function HandsUi({ p, possibleMoves, onSelectCard }: HandsUIProps) {
    const [cards, setCards] = useState<string[][]>([]);
    const [selected, setSelected] = useState<string>('');

    function isSelectable(cardName: string): boolean {
        return !!possibleMoves.find((m) => m.cardName === cardName);
    }

    useEffect(() => {
        setCards([p.handsData[0].split(','), p.handsData[1].split(',')]);
    }, [p.handsData]);

    const handleCardClick = useCallback((event: any) => {
        const selectedCardName: string = event.target.dataset.name;
        setSelected(selectedCardName);
        onSelectCard(selectedCardName);
    }, []);

    return (
        <Box className="hands">
            <Box className="hand hand--blue">
                {cards[0] && (
                    <Box
                        data-name={cards[0][0]}
                        className={`card card--blue ${isSelectable(cards[0][0]) ? 'card--selectable' : ''} ${selected === cards[0][0] ? 'card--selected' : ''}`}
                        onClick={handleCardClick}
                    >
                        {fixName(cards[0][0])}
                    </Box>
                )}
                {cards[0] && (
                    <Box
                        data-name={cards[0][1]}
                        className={`card card--blue ${isSelectable(cards[0][1]) ? 'card--selectable' : ''} ${selected === cards[0][1] ? 'card--selected' : ''}`}
                        onClick={handleCardClick}
                    >
                        {fixName(cards[0][1])}
                    </Box>
                )}
                {cards[0] && cards[0][2] && (
                    <Box data-name={cards[0][2]} className="card card--blue">
                        {fixName(cards[0][2])}
                    </Box>
                )}
            </Box>
            <Box className="hand hand--red">
                {cards[1] && (
                    <Box
                        data-name={cards[1][0]}
                        className={`card card--red ${isSelectable(cards[1][0]) ? 'card--selectable' : ''} ${selected === cards[1][0] ? 'card--selected' : ''}`}
                        onClick={handleCardClick}
                    >
                        {fixName(cards[1][0])}
                    </Box>
                )}
                {cards[1] && (
                    <Box
                        data-name={cards[1][1]}
                        className={`card card--red ${isSelectable(cards[1][1]) ? 'card--selectable' : ''} ${selected === cards[1][1] ? 'card--selected' : ''}`}
                        onClick={handleCardClick}
                    >
                        {fixName(cards[1][1])}
                    </Box>
                )}
                {cards[1] && cards[1][2] && (
                    <Box data-name={cards[1][2]} className="card card--red">
                        {fixName(cards[1][2])}
                    </Box>
                )}
            </Box>
        </Box>
    );
}
