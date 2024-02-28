import './card.css';

import { Box } from '@mui/material';
import { useCallback } from 'react';

function fixName(name: string) {
    return name.replaceAll('_', ' ');
}

type CardUIProps = {
    name: string;
    armyIndex: number;
    isSelectable: boolean;
    isSelected: boolean;
    onSelectCard?: (cardName: string) => void;
};

export function CardUI({ name, armyIndex, isSelectable, isSelected, onSelectCard }: CardUIProps) {
    const handleSelectCard = useCallback(() => {
        if (!isSelectable || !onSelectCard) {
            return;
        }
        onSelectCard(name);
    }, []);

    return (
        <Box
            data-name={name}
            className={`card card--${armyIndex === 0 ? 'blue' : 'red'} ${isSelectable ? 'selectable' : ''} ${isSelected ? 'selected' : ''}`}
            onClick={handleSelectCard}
        >
            {fixName(name)}
        </Box>
    );
}
