import { Box } from '@mui/material';
import React from 'react';

type coverUIProps = {
    opacity?: number;
};

export function CoverUI({ opacity }: coverUIProps) {
    return <Box className={'cover'} sx={{ opacity: `${opacity || 0.5}`, transition: 'opacity 250ms linear' }} />;
}
