import { Box } from '@mui/material';
import React from 'react';

type coverUIProps = {
    opacity: number;
    className?: string;
};

export function CoverUI({ opacity, className }: coverUIProps) {
    return <Box className={`cover ${className || ''}`} sx={{ opacity, transition: 'opacity 250ms linear' }} />;
}
