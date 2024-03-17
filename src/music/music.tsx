import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { Box, IconButton } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { AnalyticsAction, AnalyticsCategory, sendAnalyticsEvent } from '../services/analytics';
import { shuffleArray } from '../services/utils';

function getRandomMusicTracks(): string[] {
    const musicFiles = ['/music/taiko-drums.mp3', '/music/tokyo-sunrise.mp3', '/music/tokyo-sunset.mp3'];
    shuffleArray(musicFiles);
    return musicFiles;
}

const musicFiles = getRandomMusicTracks();
let audioIndex = 0;

export function Music() {
    const musicPlayerRef = useRef<HTMLAudioElement>(null);
    const [musicOn, setMusicOn] = useState<boolean>(false);

    const playNextSong = useCallback(() => {
        audioIndex++;
        musicPlayerRef.current!.src = musicFiles[audioIndex % musicFiles.length];
        musicPlayerRef.current!.play().then(() => {});
    }, []);

    const handleMusicEnded = useCallback(() => {
        playNextSong();
    }, [playNextSong]);

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
        if (musicOn) {
            playNextSong();
            sendAnalyticsEvent(AnalyticsCategory.MUSIC, AnalyticsAction.MUSIC_ON);
        } else {
            musicPlayerRef.current!.pause();
        }
    }, [musicOn]);

    const handleToggleSound = useCallback(() => {
        setMusicOn((on) => !on);
    }, []);

    return (
        <Box>
            {musicOn && (
                <IconButton aria-label="Sounds on" onClick={handleToggleSound}>
                    <VolumeUpIcon sx={{ fill: '#000' }} />
                </IconButton>
            )}
            {!musicOn && (
                <IconButton aria-label="Sounds off" onClick={handleToggleSound}>
                    <VolumeOffIcon sx={{ fill: '#000' }} />
                </IconButton>
            )}
            <audio ref={musicPlayerRef} id="musicPlayer" src="/music/epic-taiko-percussion-drums.mp3">
                <track kind="captions" />
            </audio>
        </Box>
    );
}
