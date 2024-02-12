import { Box } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';

import { Footer } from '../footer/footer';
import { Header } from '../header/header';

function setWidthAndHeight() {
    document.documentElement.style.setProperty('--w', `${window.innerWidth * 0.01}px`);
    document.documentElement.style.setProperty('--h', `${window.innerHeight * 0.01}px`);
}
window.addEventListener('resize', setWidthAndHeight);
setWidthAndHeight();

export function Root() {
    return (
        <Box className="root full-screen-height grid" sx={{ gridTemplateColumns: '1fr', gridTemplateRows: 'auto 1fr auto' }}>
            <Header />
            <Outlet />
            <Footer />
        </Box>
    );
}
