import { Grid, Typography } from '@mui/material';
import React from 'react';
import { NavLink } from 'react-router-dom';

export function ErrorPage() {
    return (
        <div className="error-page full-screen-height">
            <Grid container direction="row" justifyContent="center" alignItems="center" className="full-screen-height">
                <Typography variant="h4">
                    Oops...
                    <NavLink to="/" style={{ marginLeft: '1rem' }}>
                        Go back home
                    </NavLink>
                </Typography>
            </Grid>
        </div>
    );
}
