import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { Box, IconButton } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';

function getRandomMusicTracks(): string[] {
    const musicFiles = ['/music/taiko-drums.mp3', '/music/tokyo-sunrise.mp3', '/music/tokyo-sunset.mp3'];
    let rnd;
    let cur = musicFiles.length;
    while (cur !== 0) {
        rnd = Math.floor(Math.random() * cur);
        cur--;
        [musicFiles[cur], musicFiles[rnd]] = [musicFiles[rnd], musicFiles[cur]];
    }
    return musicFiles;
}

const musicFiles = getRandomMusicTracks();
let audioIndex = 0;

export function Audio() {
    const musicPlayerRef = useRef<HTMLAudioElement>(null);
    const [soundOn, setSoundOn] = useState<boolean>(false);

    const handleMusicEnded = useCallback(() => {
        audioIndex++;
        musicPlayerRef.current!.src = musicFiles[audioIndex % musicFiles.length];
        musicPlayerRef.current!.play().then(() => {});
    }, []);

    useEffect(() => {
        if (!musicPlayerRef.current) {
            return;
        }
        musicPlayerRef.current!.src = musicFiles[audioIndex % musicFiles.length];
        musicPlayerRef.current.addEventListener('ended', handleMusicEnded);
        return () => {
            musicPlayerRef.current!.removeEventListener('ended', handleMusicEnded);
        };
    }, [handleMusicEnded]);

    useEffect(() => {
        if (!musicPlayerRef.current) {
            return;
        }
        if (soundOn) {
            musicPlayerRef.current!.play().then(() => {});
        } else {
            musicPlayerRef.current!.pause();
        }
    }, [soundOn]);

    const handleToggleSound = useCallback(() => {
        setSoundOn((on) => !on);
    }, []);

    return (
        <Box>
            {soundOn && (
                <IconButton color="primary" aria-label="Sounds on" onClick={handleToggleSound}>
                    <VolumeUpIcon />
                </IconButton>
            )}
            {!soundOn && (
                <IconButton color="primary" aria-label="Sounds off" onClick={handleToggleSound}>
                    <VolumeOffIcon sx={{ fill: '#f55' }} />
                </IconButton>
            )}
            <audio ref={musicPlayerRef} id="musicPlayer" src="/music/epic-taiko-percussion-drums.mp3">
                <track kind="captions" />
            </audio>
        </Box>
    );
}
