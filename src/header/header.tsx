import './header.css';

import { AppBar, Box, Toolbar } from '@mui/material';
import React from 'react';
import { NavLink } from 'react-router-dom';

// import { NavLink } from 'react-router-dom';
import onitamaLogoTextImage from './onitama-logo-text.png';

export function Header() {
    // const midNavItems = [
    //     {
    //         text: 'Home',
    //         link: '/',
    //     },
    //     {
    //         text: 'Game',
    //         link: '/game',
    //     },
    // ];

    return (
        <AppBar color="primary" position="static" sx={{ height: '48px', userSelect: 'none' }}>
            <Box className="cover" sx={{ height: '48px', opacity: '0.25' }} />
            <Box className="position--absolute" sx={{ height: '48px' }}>
                <Toolbar variant="dense" sx={{ padding: '0 8px !important' }}>
                    <NavLink to="/" style={{ display: 'flex' }}>
                        <img src={onitamaLogoTextImage} alt="Onitama" style={{ position: 'relative', top: '2px', left: '2px', maxHeight: '32px' }} />
                    </NavLink>

                    {/*<Box sx={{ flexGrow: 1 }} />*/}
                    {/*<Box sx={{ marginRight: '1rem' }}>*/}
                    {/*    {midNavItems.map((item) => (*/}
                    {/*        <NavLink key={item.link} to={item.link} className="header--link font--hatch" style={{ margin: '0 1rem', fontSize: '1.5rem' }}>*/}
                    {/*            {item.text}*/}
                    {/*        </NavLink>*/}
                    {/*    ))}*/}
                    {/*</Box>*/}
                </Toolbar>
            </Box>
        </AppBar>
    );
}
