import { Grid, Typography } from '@mui/material';
import React from 'react';

export function Footer() {
    return (
        <Grid container={true} className="footer" sx={{ justifyContent: 'flex-end' }}>
            <Typography variant="body2" sx={{ marginRight: '0.25rem', color: 'var(--color--gray--darkest)' }}>
                Uri Kalish 2024
            </Typography>
        </Grid>
    );
}
