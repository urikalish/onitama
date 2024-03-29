import './start.css';

import { Box, Button, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Radio, RadioGroup, Select, Typography } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { get5RandomCardsNames, getStartingColor } from '../game/model/card';
import { Color } from '../game/model/color';
import { g, Game, setG } from '../game/model/game';
import { PlayerType } from '../game/model/player';
import { handleProgressCallback } from '../game/ui/game-ui';
import { AnalyticsAction, AnalyticsCategory, sendAnalyticsEvent } from '../services/analytics';

const LS_ITEM_SETTINGS = 'onitama-300324';
const LS_GAME_MODE = 'gameMode';
const LS_BLUE_PLAYER = 'bluePlayer';
const LS_RED_PLAYER = 'redPlayer';

const combos: Record<string, { blue: { value: string; text: string }[]; red: { value: string; text: string }[] }> = {
    'local-vs-bot': {
        blue: [
            {
                value: 'human-local',
                text: 'Human (local)',
            },
        ],
        red: [
            {
                value: 'bot0',
                text: 'Bot 0 (easy)',
            },
            {
                value: 'bot1',
                text: 'Bot 1',
            },
            {
                value: 'bot2',
                text: 'Bot 2',
            },
            {
                value: 'bot3',
                text: 'Bot 3',
            },
            {
                value: 'bot4',
                text: 'Bot 4',
            },
            {
                value: 'bot5',
                text: 'Bot 5 (hard)',
            },
        ],
    },
    'local-vs-local': {
        blue: [
            {
                value: 'human-local',
                text: 'Human (local)',
            },
        ],
        red: [
            {
                value: 'human-local',
                text: 'Human (local)',
            },
        ],
    },
    'local-vs-remote': {
        blue: [
            {
                value: 'human-local',
                text: 'Human (local)',
            },
        ],
        red: [
            {
                value: 'human-remote',
                text: 'Human (remote)',
            },
        ],
    },
    'remote-vs-local': {
        blue: [
            {
                value: 'human-remote',
                text: 'Human (remote)',
            },
        ],
        red: [
            {
                value: 'human-local',
                text: 'Human (local)',
            },
        ],
    },
    'bot-vs-bot': {
        blue: [
            {
                value: 'bot0',
                text: 'Bot 0 (easy)',
            },
            {
                value: 'bot1',
                text: 'Bot 1',
            },
            {
                value: 'bot2',
                text: 'Bot 2',
            },
            {
                value: 'bot3',
                text: 'Bot 3',
            },
            {
                value: 'bot4',
                text: 'Bot 4',
            },
            {
                value: 'bot5',
                text: 'Bot 5 (hard)',
            },
        ],
        red: [
            {
                value: 'bot0',
                text: 'Bot 0 (easy)',
            },
            {
                value: 'bot1',
                text: 'Bot 1',
            },
            {
                value: 'bot2',
                text: 'Bot 2',
            },
            {
                value: 'bot3',
                text: 'Bot 3',
            },
            {
                value: 'bot4',
                text: 'Bot 4',
            },
            {
                value: 'bot5',
                text: 'Bot 5 (hard)',
            },
        ],
    },
};

export function Start() {
    const initialized = useRef(false);
    const [gameMode, setGameMode] = useState('local-vs-bot');
    const [blueCombo, setBlueCombo] = useState(combos['local-vs-bot'].blue);
    const [redCombo, setRedCombo] = useState(combos['local-vs-bot'].red);
    const [bluePlayer, setBluePlayer] = useState(combos['local-vs-bot'].blue[0].value);
    const [redPlayer, setRedPlayer] = useState(combos['local-vs-bot'].red[0].value);
    const [canSubmit] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (initialized.current) {
            return;
        }
        const ls = JSON.parse(localStorage.getItem(LS_ITEM_SETTINGS) || '{}');
        if (ls[LS_GAME_MODE] && ls[LS_BLUE_PLAYER] && ls[LS_RED_PLAYER]) {
            setGameMode(ls[LS_GAME_MODE]);
            setBlueCombo(combos[ls[LS_GAME_MODE]].blue);
            setRedCombo(combos[ls[LS_GAME_MODE]].red);
            setBluePlayer(ls[LS_BLUE_PLAYER]);
            setRedPlayer(ls[LS_RED_PLAYER]);
        }
        initialized.current = true;
    }, []);

    const handleChangeGameMode = useCallback((event: any) => {
        const mode = event.target.value;
        setGameMode(mode);
        setBlueCombo(combos[mode].blue);
        setRedCombo(combos[mode].red);
        setBluePlayer(combos[mode].blue[0].value);
        setRedPlayer(combos[mode].red[0].value);
    }, []);

    const handleChangeBluePlayer = useCallback((event: any) => {
        setBluePlayer(event.target.value);
    }, []);

    const handleChangeRedPlayer = useCallback((event: any) => {
        setRedPlayer(event.target.value);
    }, []);

    const handleClickHome = useCallback(() => {
        navigate(`/`);
    }, []);

    const handleClickStart = useCallback(() => {
        localStorage.setItem(
            LS_ITEM_SETTINGS,
            JSON.stringify({
                [LS_GAME_MODE]: gameMode,
                [LS_BLUE_PLAYER]: bluePlayer,
                [LS_RED_PLAYER]: redPlayer,
            }),
        );
        const decks = ['base', 'path', 'wind', 'promo'];
        const cardNames: string[] = get5RandomCardsNames(decks);
        const cardNames0: string[] = [cardNames[0], cardNames[1]];
        const cardNames1: string[] = [cardNames[2], cardNames[3]];
        let playerNames: string[];
        let playerTypes: PlayerType[];
        let fenStr = '';
        switch (gameMode) {
            case 'local-vs-bot':
                playerNames = ['Local player', redPlayer];
                playerTypes = [PlayerType.LOCAL, PlayerType.BOT];
                cardNames0.push(cardNames[4]);
                fenStr = `S3s/S3s/M3m/S3s/S3s ${cardNames0.join(',')}/${cardNames1.join(',')} 1`;
                break;
            case 'local-vs-local':
                playerNames = ['Local player 0', 'Local player 1'];
                playerTypes = [PlayerType.LOCAL, PlayerType.LOCAL];
                if (getStartingColor(cardNames[4]) === Color.BLUE) {
                    cardNames0.push(cardNames[4]);
                } else {
                    cardNames1.push(cardNames[4]);
                }
                fenStr = `S3s/S3s/M3m/S3s/S3s ${cardNames0.join(',')}/${cardNames1.join(',')} 1`;
                break;
            // case 'local-vs-remote':
            //     playerNames = ['Local player 0', 'Remote player 1'];
            //     playerTypes = [PlayerType.LOCAL, PlayerType.REMOTE];
            //     break;
            // case 'remote-vs-local':
            //     playerNames = ['Remote player 0', 'Local player 1'];
            //     playerTypes = [PlayerType.REMOTE, PlayerType.LOCAL];
            //     break;
            case 'bot-vs-bot':
                playerNames = [bluePlayer, redPlayer];
                playerTypes = [PlayerType.BOT, PlayerType.BOT];
                if (getStartingColor(cardNames[4]) === Color.BLUE) {
                    cardNames0.push(cardNames[4]);
                } else {
                    cardNames1.push(cardNames[4]);
                }
                fenStr = `S3s/S3s/M3m/S3s/S3s ${cardNames0.join(',')}/${cardNames1.join(',')} 1`;
                break;
            default:
                throw 'Unsupported game mode';
        }
        setG(new Game(playerNames[0], playerTypes[0], playerNames[1], playerTypes[1], fenStr, handleProgressCallback));
        g!.startGame(Date.now());
        sendAnalyticsEvent(AnalyticsCategory.GAME_PHASE, AnalyticsAction.GAME_PHASE_GAME_STARTED);
        sendAnalyticsEvent(AnalyticsCategory.GAME_MODE, gameMode);
        sendAnalyticsEvent(AnalyticsCategory.PLAYERS, `${playerNames[0]} vs ${playerNames[1]}`);
        navigate('/game');
    }, [gameMode, bluePlayer, redPlayer]);

    return (
        <Box className="start page">
            <Box className="page-cover" />
            <Box className="page--content-and-actions">
                <Box className="page--content">
                    <FormGroup>
                        <Typography variant="h4" className="page--section-header">
                            Game Mode
                        </Typography>
                        <FormControl>
                            <RadioGroup aria-label="Game mode" name="game-mode-radio-buttons-group" value={gameMode} onChange={handleChangeGameMode}>
                                <FormControlLabel value="local-vs-bot" control={<Radio />} label="Play vs. Bot" />
                                <FormControlLabel value="local-vs-local" control={<Radio />} label="Local Multiplayer (Single Device)" />
                                <FormControlLabel disabled={true} value="local-vs-remote" control={<Radio />} label="Remote Multiplayer - Create Game" />
                                <FormControlLabel disabled={true} value="remote-vs-local" control={<Radio />} label="Remote Multiplayer - Join Game" />
                                <FormControlLabel value="bot-vs-bot" control={<Radio />} label="Bot vs. Bot" />
                            </RadioGroup>
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <Typography variant="h4" className="page--section-header">
                            Players
                        </Typography>
                        <Box className="start--players">
                            <FormControl fullWidth>
                                <InputLabel id="blue-select-label">Blue Player</InputLabel>
                                <Select
                                    labelId="blue-select-label"
                                    id="blue-select"
                                    value={bluePlayer}
                                    label="Blue Player"
                                    disabled={blueCombo.length <= 1}
                                    onChange={handleChangeBluePlayer}
                                >
                                    {blueCombo.map((item) => (
                                        <MenuItem key={item.value} value={item.value}>
                                            {item.text}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel id="red-select-label">Red Player</InputLabel>
                                <Select
                                    labelId="red-select-label"
                                    id="red-select"
                                    value={redPlayer}
                                    label="Red Player"
                                    disabled={redCombo.length <= 1}
                                    onChange={handleChangeRedPlayer}
                                >
                                    {redCombo.map((item) => (
                                        <MenuItem key={item.value} value={item.value}>
                                            {item.text}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </FormGroup>
                </Box>
                <Box className="page--actions">
                    <Button onClick={handleClickHome} variant="outlined" className="action-button">
                        <Typography>Home</Typography>
                    </Button>
                    <Button disabled={!canSubmit} onClick={handleClickStart} variant="contained" className="action-button">
                        <Typography>Start</Typography>
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
