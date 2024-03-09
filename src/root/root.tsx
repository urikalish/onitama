import './root.css';

import { Box } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';

import { Header } from '../header/header';

function setWidthAndHeight() {
    document.documentElement.style.setProperty('--vw', `${window.innerWidth * 0.01}px`);
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
window.addEventListener('resize', setWidthAndHeight);
setWidthAndHeight();

export function Root() {
    return (
        <Box className="root full-screen-height">
            <Header />
            <Outlet />
        </Box>
    );
}
