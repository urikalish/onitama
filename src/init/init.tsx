import './init.css';

import { Box, Button, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Radio, RadioGroup, Select, Typography } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { get5RandomCardsNames, getStartingColor } from '../game/model/card';
import { Color } from '../game/model/color';
import { getInitialFenStr } from '../game/model/fen';
import { Game, setG } from '../game/model/game';
import { PlayerType } from '../game/model/player';
import { handleProgressCallback } from '../game/ui/game-ui';
import { AnalyticsAction, AnalyticsCategory, sendAnalyticsEvent } from '../services/analytics';
import { getRandomNumber } from '../services/utils';

const LS_ITEM_SETTINGS = 'kalish-onitama';
const LS_GAME_MODE = 'gameMode';
const LS_BLUE_PLAYER = 'bluePlayer';
const LS_RED_PLAYER = 'redPlayer';

const LOCAL_VS_BOT = 'local-vs-bot';
const LOCAL_VS_LOCAL = 'local-vs-local';
const LOCAL_VS_REMOTE = 'local-vs-remote';
const REMOTE_VS_LOCAL = 'remote-vs-local';
const BOT_VS_BOT = 'bot-vs-bot';

const combos: Record<string, { blue: { value: string; text: string }[]; red: { value: string; text: string }[] }> = {
    [LOCAL_VS_BOT]: {
        blue: [
            {
                value: 'human-local',
                text: 'Me',
            },
        ],
        red: [
            {
                value: 'bot0',
                text: 'Bot0 (easy)',
            },
            {
                value: 'bot1',
                text: 'Bot1',
            },
            {
                value: 'bot2',
                text: 'Bot2',
            },
            {
                value: 'bot3',
                text: 'Bot3',
            },
            {
                value: 'bot4',
                text: 'Bot4',
            },
            {
                value: 'bot5',
                text: 'Bot5 (hard)',
            },
        ],
    },
    [LOCAL_VS_LOCAL]: {
        blue: [
            {
                value: 'human-local',
                text: 'Local Player',
            },
        ],
        red: [
            {
                value: 'human-local',
                text: 'Local Player',
            },
        ],
    },
    [LOCAL_VS_REMOTE]: {
        blue: [
            {
                value: 'human-local',
                text: 'Me',
            },
        ],
        red: [
            {
                value: 'human-remote',
                text: 'Remote Player',
            },
        ],
    },
    [REMOTE_VS_LOCAL]: {
        blue: [
            {
                value: 'human-remote',
                text: 'Remote Player',
            },
        ],
        red: [
            {
                value: 'human-local',
                text: 'Me',
            },
        ],
    },
    [BOT_VS_BOT]: {
        blue: [
            {
                value: 'bot0',
                text: 'Bot0 (easy)',
            },
            {
                value: 'bot1',
                text: 'Bot1',
            },
            {
                value: 'bot2',
                text: 'Bot2',
            },
            {
                value: 'bot3',
                text: 'Bot3',
            },
            {
                value: 'bot4',
                text: 'Bot4',
            },
            {
                value: 'bot5',
                text: 'Bot5 (hard)',
            },
        ],
        red: [
            {
                value: 'bot0',
                text: 'Bot0 (easy)',
            },
            {
                value: 'bot1',
                text: 'Bot1',
            },
            {
                value: 'bot2',
                text: 'Bot2',
            },
            {
                value: 'bot3',
                text: 'Bot3',
            },
            {
                value: 'bot4',
                text: 'Bot4',
            },
            {
                value: 'bot5',
                text: 'Bot5 (hard)',
            },
        ],
    },
};

export function Init() {
    const initialized = useRef(false);
    const [gameMode, setGameMode] = useState(LOCAL_VS_BOT);
    const [blueCombo, setBlueCombo] = useState(combos[LOCAL_VS_BOT].blue);
    const [redCombo, setRedCombo] = useState(combos[LOCAL_VS_BOT].red);
    const [bluePlayer, setBluePlayer] = useState(combos[LOCAL_VS_BOT].blue[0].value);
    const [redPlayer, setRedPlayer] = useState(combos[LOCAL_VS_BOT].red[0].value);
    const [canStart, setCanStart] = useState(true);
    const [canCreate, setCanCreate] = useState(false);
    const [canJoin, setCanJoin] = useState(true);
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

    useEffect(() => {
        setCanStart([LOCAL_VS_BOT, LOCAL_VS_LOCAL, BOT_VS_BOT].includes(gameMode));
        setCanCreate([LOCAL_VS_REMOTE].includes(gameMode));
        setCanJoin([REMOTE_VS_LOCAL].includes(gameMode));
    }, [gameMode]);

    const saveToLocalStorage = useCallback(() => {
        localStorage.clear();
        localStorage.setItem(
            LS_ITEM_SETTINGS,
            JSON.stringify({
                [LS_GAME_MODE]: gameMode,
                [LS_BLUE_PLAYER]: bluePlayer,
                [LS_RED_PLAYER]: redPlayer,
            }),
        );
    }, [gameMode, bluePlayer, redPlayer]);

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
        const cardNames: string[] = get5RandomCardsNames(['base', 'path', 'wind', 'promo']);
        const cardNames0: string[] = [cardNames[0], cardNames[1]];
        const cardNames1: string[] = [cardNames[2], cardNames[3]];
        let playerNames: string[];
        let playerTypes: PlayerType[];
        switch (gameMode) {
            case LOCAL_VS_BOT:
                playerNames = ['local', redPlayer];
                playerTypes = [PlayerType.LOCAL, PlayerType.BOT];
                cardNames0.push(cardNames[4]);
                break;
            case LOCAL_VS_LOCAL:
                playerNames = ['local0', 'local1'];
                playerTypes = [PlayerType.LOCAL, PlayerType.LOCAL];
                if (getStartingColor(cardNames[4]) === Color.BLUE) {
                    cardNames0.push(cardNames[4]);
                } else {
                    cardNames1.push(cardNames[4]);
                }
                break;
            case BOT_VS_BOT:
                playerNames = [bluePlayer, redPlayer];
                playerTypes = [PlayerType.BOT, PlayerType.BOT];
                if (getStartingColor(cardNames[4]) === Color.BLUE) {
                    cardNames0.push(cardNames[4]);
                } else {
                    cardNames1.push(cardNames[4]);
                }
                break;
            default:
                alert('Unsupported game mode!');
                throw 'Unsupported game mode!';
        }
        const gameId = getRandomNumber(5);
        const fenStr = getInitialFenStr(cardNames0, cardNames1);
        const game = new Game(gameId, playerNames[0], playerTypes[0], playerNames[1], playerTypes[1], fenStr, handleProgressCallback);
        setG(game);
        saveToLocalStorage();
        sendAnalyticsEvent(AnalyticsCategory.GAME_PHASE, AnalyticsAction.GAME_PHASE_GAME_STARTED);
        sendAnalyticsEvent(AnalyticsCategory.PLAYERS, `${playerNames[0]} vs ${playerNames[1]}`);
        game.startGame();
        navigate('/game');
    }, [gameMode, bluePlayer, redPlayer, saveToLocalStorage]);

    const handleClickCreate = useCallback(() => {
        saveToLocalStorage();
        navigate(`/create`);
    }, [saveToLocalStorage]);

    const handleClickJoin = useCallback(() => {
        saveToLocalStorage();
        navigate(`/join`);
    }, [saveToLocalStorage]);

    return (
        <Box className="init page">
            <Box className="page-cover" />
            <Box className="page--content-and-actions">
                <Box className="page--content">
                    <FormGroup>
                        <Typography variant="h4" className="page--section-header">
                            Game Mode
                        </Typography>
                        <FormControl>
                            <RadioGroup aria-label="Game mode" name="game-mode-radio-buttons-group" value={gameMode} onChange={handleChangeGameMode}>
                                <FormControlLabel value={LOCAL_VS_BOT} control={<Radio />} label="Play vs. Bot" />
                                <FormControlLabel value={LOCAL_VS_LOCAL} control={<Radio />} label="Local Multiplayer (Single Device)" />
                                <FormControlLabel value={LOCAL_VS_REMOTE} control={<Radio />} label="Remote Multiplayer - Create Game" />
                                <FormControlLabel value={REMOTE_VS_LOCAL} control={<Radio />} label="Remote Multiplayer - Join Game" />
                                <FormControlLabel value={BOT_VS_BOT} control={<Radio />} label="Bot vs. Bot" />
                            </RadioGroup>
                        </FormControl>
                    </FormGroup>
                    <FormGroup>
                        <Box className="init--players">
                            <FormControl fullWidth>
                                <InputLabel id="blue-select-label">Blue</InputLabel>
                                <Select
                                    labelId="blue-select-label"
                                    id="blue-select"
                                    value={bluePlayer}
                                    label="Blue"
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
                                <InputLabel id="red-select-label">Red</InputLabel>
                                <Select labelId="red-select-label" id="red-select" value={redPlayer} label="Red" disabled={redCombo.length <= 1} onChange={handleChangeRedPlayer}>
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
                    {canStart && (
                        <Button onClick={handleClickStart} variant="contained" className="action-button">
                            <Typography>Start</Typography>
                        </Button>
                    )}
                    {canCreate && (
                        <Button onClick={handleClickCreate} variant="contained" className="action-button">
                            <Typography>Create</Typography>
                        </Button>
                    )}
                    {canJoin && (
                        <Button onClick={handleClickJoin} variant="contained" className="action-button">
                            <Typography>Join</Typography>
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
