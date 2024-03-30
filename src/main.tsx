import './css/index.css';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Create } from './create/create';
import { Credits } from './credits/credits';
import { End } from './end/end';
import { Error } from './error/error';
import { GameUI } from './game/ui/game-ui';
import { Home } from './home/home';
import { Init } from './init/init';
import { Join } from './join/join';
import { Root } from './root/root';
import { Rules } from './rules/rules';
import { myTheme } from './theme/my-theme';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <Error />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: 'credits',
                element: <Credits />,
            },
            {
                path: 'rules',
                element: <Rules />,
            },
            {
                path: 'init',
                element: <Init />,
            },
            {
                path: 'create',
                element: <Create />,
            },
            {
                path: 'join',
                element: <Join />,
            },
            {
                path: 'game',
                element: <GameUI />,
            },
            {
                path: 'end',
                element: <End />,
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
