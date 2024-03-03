import { Box } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

import { Move } from '../model/move';
import { Position } from '../model/position';
import { CardUI } from './card-ui';

type HandsUIProps = {
    p: Position | null;
    allPossibleMoves: Move[];
    onSelectCard: (cardName: string) => void;
};

export function HandsUi({ p, allPossibleMoves, onSelectCard }: HandsUIProps) {
    const [cards, setCards] = useState<string[][]>([]);
    const [selectableCardNames, setSelectableCardNames] = useState<Set<string>>(new Set());
    const [selectedCardName, setSelectedCardName] = useState<string>('');

    useEffect(() => {
        if (!p) {
            return;
        }
        setCards([p.handsData[0].split(','), p.handsData[1].split(',')]);
    }, [p]);

    useEffect(() => {
        const names: Set<string> = new Set();
        allPossibleMoves.forEach((m) => {
            names.add(m.cardName);
        });
        setSelectableCardNames(names);
    }, [allPossibleMoves]);

    useEffect(() => {
        if (selectableCardNames.size === 1) {
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 2; j++) {
                    if (selectableCardNames.has(cards[i][j])) {
                        handleSelectCard(cards[i][j]);
                        return;
                    }
                }
            }
        }
    }, [selectableCardNames]);

    const handleSelectCard = useCallback(
        (cardName: string) => {
            setSelectedCardName(cardName);
            onSelectCard(cardName);
        },
        [onSelectCard],
    );

    return (
        <Box className="hands position--relative">
            {cards[0] && (
                <CardUI
                    className="card-00"
                    name={cards[0][0]}
                    armyIndex={0}
                    isSelectable={selectableCardNames.has(cards[0][0])}
                    isSelected={selectedCardName === cards[0][0]}
                    onSelectCard={handleSelectCard}
                />
            )}
            {cards[0] && (
                <CardUI
                    className="card-01"
                    name={cards[0][1]}
                    armyIndex={0}
                    isSelectable={selectableCardNames.has(cards[0][1])}
                    isSelected={selectedCardName === cards[0][1]}
                    onSelectCard={handleSelectCard}
                />
            )}
            {cards[0] && cards[0][2] && <CardUI className="card-02" name={cards[0][2]} armyIndex={0} isSelectable={false} isSelected={false} />}
            {cards[1] && (
                <CardUI
                    className="card-10"
                    name={cards[1][0]}
                    armyIndex={1}
                    isSelectable={selectableCardNames.has(cards[1][0])}
                    isSelected={selectedCardName === cards[1][0]}
                    onSelectCard={handleSelectCard}
                />
            )}
            {cards[1] && (
                <CardUI
                    className="card-11"
                    name={cards[1][1]}
                    armyIndex={1}
                    isSelectable={selectableCardNames.has(cards[1][1])}
                    isSelected={selectedCardName === cards[1][1]}
                    onSelectCard={handleSelectCard}
                />
            )}
            {cards[1] && cards[1][2] && <CardUI className="card-12" name={cards[1][2]} armyIndex={1} isSelectable={false} isSelected={false} />}
        </Box>
    );
}
