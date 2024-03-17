import './header.css';

import { AppBar, Toolbar } from '@mui/material';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { Music } from '../music/music';

export function Header() {
    return (
        <AppBar color="primary" position="static" className="header--app-bar">
            <Toolbar variant="dense" className="header--toolbar">
                <NavLink to="/" className="flex">
                    <img alt="Onitama" className="header--logo-image" src="/img/logo/onitama-text.png" />
                </NavLink>
                <Music />
            </Toolbar>
        </AppBar>
    );
}
