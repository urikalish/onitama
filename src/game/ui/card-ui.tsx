import './card.css';

import { Box } from '@mui/material';
import React, { useCallback, useEffect, useRef } from 'react';

import { getCardMoves } from '../model/card';
import { CoverUI } from './cover-ui';

function fixName(name: string) {
    return name.replaceAll('_', ' ');
}

type CardUIProps = {
    className?: string;
    name: string;
    armyIndex: number;
    isSelectable: boolean;
    isSelected: boolean;
    onSelectCard?: (cardName: string) => void;
};

export function CardUI({ className, name, armyIndex, isSelectable, isSelected, onSelectCard }: CardUIProps) {
    const cardGridRef = useRef<HTMLElement | null>(null);

    function drawCardGrid() {
        const cardMoves = getCardMoves(name);
        (cardGridRef.current as HTMLElement).replaceChildren();
        for (let index = 0; index < 25; index++) {
            const x = index % 5;
            const y = Math.trunc(index / 5);
            const dx = x - 2;
            const dy = y - 2;
            const squareElm = document.createElement('div');
            squareElm.setAttribute('data-index', String(index));
            squareElm.setAttribute('data-dx', String(dx));
            squareElm.setAttribute('data-dy', String(dy));
            squareElm.classList.add('card-grid-square');
            if (index === 12) {
                squareElm.classList.add('source');
            }
            for (let m = 0; m < cardMoves.length; m += 2) {
                if (cardMoves[m] === dx && cardMoves[m + 1] === dy) {
                    squareElm.classList.add('destination');
                    break;
                }
            }
            cardGridRef.current!.appendChild(squareElm);
        }
    }

    useEffect(() => {
        drawCardGrid();
    }, [name, armyIndex]);

    const handleSelectCard = useCallback(() => {
        if (!isSelectable || !onSelectCard) {
            return;
        }
        onSelectCard(name);
    }, [isSelectable, onSelectCard]);

    return (
        <Box
            key={name}
            data-name={name}
            className={`card ${armyIndex === 0 ? 'blue' : 'red'} ${isSelectable ? 'selectable' : ''} ${isSelected ? 'selected' : ''} ${className}`}
            onClick={handleSelectCard}
        >
            <CoverUI />
            <Box className="card-name ellipsis">{fixName(name)}</Box>
            <Box ref={cardGridRef} className="card-grid" />
        </Box>
    );
}
