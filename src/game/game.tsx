import { Box, Button, Typography } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { UnitType } from './unit-type';
import unitsDataAir from './units-data-air.json';
import unitsDataLand from './units-data-land.json';

export function Game() {
    const [unit, setUnit] = useState<UnitType | null>(null);
    const [unitOptions, setUnitOptions] = useState<UnitType[]>([]);
    const [totalQuestionCount, setTotalQuestionCount] = useState<number>(0);
    const [correctAnswerCount, setCorrectAnswerCount] = useState<number>(0);
    const [currentErrorCount, setCurrentErrorCount] = useState<number>(0);
    const tagsElmRef = useRef<HTMLDivElement | null>(null);
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const unitTypes = queryParams.get('unit-types');

    function shuffleArray(array: UnitType[]) {
        let currentIndex = array.length;
        let randomIndex;
        while (currentIndex > 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    function next() {
        let unitsData: UnitType[] = [];
        if (!unitTypes) {
            return;
        }
        if (unitTypes.includes('land')) {
            unitsData = [...unitsData, ...unitsDataLand];
        }
        if (unitTypes.includes('air')) {
            unitsData = [...unitsData, ...unitsDataAir];
        }
        unitsData = unitsData.filter((u) => u.tag !== unit?.tag);
        unitsData = shuffleArray(unitsData);
        setUnit(unitsData[0]);
        setUnitOptions(shuffleArray([unitsData[0], unitsData[1], unitsData[2], unitsData[3]]));
        setCurrentErrorCount(0);
    }

    useEffect(() => {
        next();
    }, []);

    const handleContextMenu = useCallback((event: any) => {
        event.preventDefault();
        event.stopPropagation();
    }, []);

    const handleUserGuess = useCallback(
        (event: any) => {
            const optionTag = (event.currentTarget as HTMLButtonElement).dataset.tag;
            if (optionTag === unit?.tag) {
                if (tagsElmRef?.current) {
                    tagsElmRef.current?.classList.toggle('pointer-events--none', true);
                    setTimeout(() => {
                        tagsElmRef.current?.classList.toggle('pointer-events--none', false);
                    }, 2000);
                }
                if (currentErrorCount === 0) {
                    setCorrectAnswerCount((c) => c + 1);
                }
                setTotalQuestionCount((c) => c + 1);
                next();
            } else {
                navigator.vibrate(100);
                tagsElmRef.current?.classList.toggle('red-flash', true);
                setTimeout(() => {
                    tagsElmRef.current?.classList.toggle('red-flash', false);
                }, 300);
                setCurrentErrorCount((c) => c + 1);
            }
        },
        [unit, currentErrorCount],
    );

    return (
        <Box ref={tagsElmRef} className="tags height--100" sx={{ padding: '2rem' }}>
            <Box className="height--100 position--relative">
                {unit && (
                    <Box>
                        <Typography variant="body2" sx={{ color: 'var(--color--gray--medium)' }}>
                            {unit.cat.join(', ')}
                        </Typography>
                        <Typography variant="h6">{unit.name}</Typography>
                    </Box>
                )}
                <Box className="grid" sx={{ gridTemplateColumns: 'auto auto', gridTemplateRows: 'auto auto', marginTop: '2rem', placeContent: 'center', gap: '1rem' }}>
                    {unitOptions.map((option) => (
                        <Button
                            key={option.tag}
                            data-tag={option.tag}
                            onMouseDown={handleUserGuess}
                            onKeyDown={handleUserGuess}
                            onContextMenu={handleContextMenu}
                            disableRipple
                            className="grid place-items--center cursor--pointer fade-in--filter--slow"
                            sx={{ backgroundColor: '#fff !important' }}
                        >
                            <img src={`img/tags/${option.tag}`} onContextMenu={handleContextMenu} alt="" style={{ maxWidth: 'calc(30 * var(--w))' }} />
                        </Button>
                    ))}
                </Box>
                <Box className="position--absolute" sx={{ left: '50%', transform: 'translateX(-50%)', bottom: '0' }}>
                    {totalQuestionCount > 0 && (
                        <Typography variant="body2" dir="ltr">{`${correctAnswerCount}/${totalQuestionCount} - ${((correctAnswerCount / totalQuestionCount) * 100).toFixed(
                            2,
                        )}%`}</Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
