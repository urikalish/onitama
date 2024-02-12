import { Box, Button, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Home() {
    const [twoPlayers, setTwoPlayers] = useState(true);
    const [canSubmit, setCanSubmit] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setCanSubmit(true);
    }, [twoPlayers]);

    const handleChangeTwoPlayers = useCallback((event: any) => {
        setTwoPlayers(event.target.checked);
    }, []);

    const handleClickStart = useCallback(() => {
        navigate(`/game?players=${twoPlayers ? '2' : '1'}`);
    }, [twoPlayers]);

    return (
        <Box className="home" sx={{ padding: '2rem' }}>
            <Typography variant="h4">Onitama Game</Typography>
            {/*<Box>*/}
            {/*    <NavLink to="/tags?mode=air" className="link">*/}
            {/*        <Button variant="outlined" sx={{ width: '12rem' }}>*/}
            {/*            <Typography>חידון תגי זרוע האוויר</Typography>*/}
            {/*        </Button>*/}
            {/*    </NavLink>*/}
            {/*</Box>*/}
            {/*<Box sx={{ marginTop: '1rem' }}>*/}
            {/*    <NavLink to="/tags?mode=land" className="link">*/}
            {/*        <Button variant="outlined" sx={{ width: '12rem' }}>*/}
            {/*            <Typography>חידון תגי זרוע היבשה</Typography>*/}
            {/*        </Button>*/}
            {/*    </NavLink>*/}
            {/*</Box>*/}
            {/*<Box sx={{ marginTop: '1rem' }}>*/}
            {/*    <NavLink to="/tags?mode=all" className="link">*/}
            {/*        <Button variant="outlined" sx={{ width: '12rem' }}>*/}
            {/*            <Typography>חידון תגי אוויר ויבשה</Typography>*/}
            {/*        </Button>*/}
            {/*    </NavLink>*/}
            {/*</Box>*/}
            <Typography variant="body2" sx={{ color: 'var(--color--gray--medium)', marginTop: '1rem' }}>
                Assert your martial prowess by harnessing the power of various animal spirits.
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--color--gray--medium)', marginTop: '1rem' }}>
                Designer: Shimpei Sato
            </Typography>
            <FormGroup sx={{ marginTop: '2rem' }}>
                <FormControlLabel control={<Checkbox checked={twoPlayers} onChange={handleChangeTwoPlayers} />} label="2 Players" />
            </FormGroup>
            <Button disabled={!canSubmit} onClick={handleClickStart} variant="outlined" sx={{ marginTop: '2rem', width: '12rem' }}>
                <Typography>Start Game</Typography>
            </Button>
        </Box>
    );
}
