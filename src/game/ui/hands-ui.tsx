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
        const names: Set<string> = new Set();
        allPossibleMoves.forEach((m) => {
            names.add(m.cardName);
        });
        setSelectableCardNames(names);
        setSelectedCardName('');
    }, [p, allPossibleMoves]);

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

    function getCardsDataByName(): { name: string; armyIndex: number; cardIndex: number }[] {
        const cd: { name: string; armyIndex: number; cardIndex: number }[] = [];
        cards.forEach((cs, armyIndex) => {
            cs.forEach((cn, ci) => {
                cd.push({
                    name: cn,
                    armyIndex,
                    cardIndex: ci,
                });
            });
        });
        return cd.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
    }

    console.log(selectedCardName);

    return (
        <Box className="hands position--relative">
            {getCardsDataByName().map((cd) => (
                <CardUI
                    className={`card-${cd.armyIndex}-${cd.cardIndex}`}
                    key={cd.name}
                    name={cd.name}
                    armyIndex={cd.armyIndex}
                    isSelectable={selectableCardNames.has(cd.name)}
                    isSelected={selectedCardName === cd.name}
                    onSelectCard={handleSelectCard}
                />
            ))}
        </Box>
    );
}
