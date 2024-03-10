import './css/index.css';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { About } from './about/about';
import { ErrorPage } from './error-page/error-page';
import { GameUI } from './game/ui/game-ui';
import { Home } from './home/home';
import { Play } from './play/play';
import { Root } from './root/root';
import { Rules } from './rules/rules';
import { myTheme } from './theme/my-theme';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: 'rules',
                element: <Rules />,
            },
            {
                path: 'about',
                element: <About />,
            },
            {
                path: 'play',
                element: <Play />,
            },
            {
                path: 'game',
                element: <GameUI />,
            },
        ],
    },
]);

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(
    <React.StrictMode>
        <ThemeProvider theme={myTheme}>
            <CssBaseline />
            <RouterProvider router={router} />
        </ThemeProvider>
    </React.StrictMode>,
);
