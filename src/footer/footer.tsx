import { Grid, Typography } from '@mui/material';
import React from 'react';

export function Footer() {
    return (
        <Grid container={true} className="footer">
            <Typography variant="body2" sx={{ marginLeft: '0.25rem', color: 'var(--color--gray--darker)' }}>
                Uri Kalish 2024
            </Typography>
        </Grid>
    );
}
