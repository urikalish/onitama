import './hands.css';

import { Box } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

import { Move } from '../model/move';
import { Position } from '../model/position';
import { CardUI } from './card-ui';

type HandsUIProps = {
    p: Position;
    possibleMoves: Move[];
    selectedCard: string;
    onSelectCard: (cardName: string) => void;
};

export function HandsUi({ p, possibleMoves, selectedCard, onSelectCard }: HandsUIProps) {
    const [cards, setCards] = useState<string[][]>([]);

    function isSelectable(cardName: string): boolean {
        return !!possibleMoves.find((m) => m.cardName === cardName);
    }

    useEffect(() => {
        setCards([p.handsData[0].split(','), p.handsData[1].split(',')]);
    }, [p.handsData]);

    const handleSelectCard = useCallback((cardName: string) => {
        onSelectCard(cardName);
    }, []);

    return (
        <Box className="hands">
            <Box className="hand hand--blue">
                {cards[0] && (
                    <CardUI name={cards[0][0]} armyIndex={0} isSelectable={isSelectable(cards[0][0])} isSelected={selectedCard === cards[0][0]} onSelectCard={handleSelectCard} />
                )}
                {cards[0] && (
                    <CardUI name={cards[0][1]} armyIndex={0} isSelectable={isSelectable(cards[0][1])} isSelected={selectedCard === cards[0][1]} onSelectCard={handleSelectCard} />
                )}
                {cards[0] && cards[0][2] && <CardUI name={cards[0][2]} armyIndex={0} isSelectable={false} isSelected={false} />}
            </Box>
            <Box className="hand hand--red">
                {cards[1] && (
                    <CardUI name={cards[1][0]} armyIndex={1} isSelectable={isSelectable(cards[1][0])} isSelected={selectedCard === cards[1][0]} onSelectCard={handleSelectCard} />
                )}
                {cards[1] && (
                    <CardUI name={cards[1][1]} armyIndex={1} isSelectable={isSelectable(cards[1][1])} isSelected={selectedCard === cards[1][1]} onSelectCard={handleSelectCard} />
                )}
                {cards[1] && cards[1][2] && <CardUI name={cards[1][2]} armyIndex={1} isSelectable={false} isSelected={false} />}
            </Box>
        </Box>
    );
}
