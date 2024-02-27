import './hands-ui.css';
import {Box} from "@mui/material";
import {useEffect, useState} from "react";

type HandsUIProps = {
    hd: string[];
};

export function HandsUi({ hd }: HandsUIProps) {
    const [cardsBlue, setCardsBlue] = useState<string[]>([]);
    const [cardsRed, setCardsRed] = useState<string[]>([]);

    useEffect(() => {
        if (!hd) {
            return;
        }
        setCardsBlue(hd[0].split(','));
        setCardsRed(hd[1].split(','));
    }, [hd]);

    return hd && <Box className="hands">
        <Box className="hand--blue">
            {cardsBlue[0] && <Box className="card card--blue card--usable">{cardsBlue[0]}</Box>}
            {cardsBlue[1] && <Box className="card card--blue card--usable">{cardsBlue[1]}</Box>}
            {cardsBlue[2] && <Box className="card card--blue card--waiting">{cardsBlue[2]}</Box>}
        </Box>
        <Box className="hand--red">
            {cardsRed[0] && <Box className="card card--red card--usable">{cardsRed[0]}</Box>}
            {cardsRed[1] && <Box className="card card--red card--usable">{cardsRed[1]}</Box>}
            {cardsRed[2] && <Box className="card card--red card--waiting">{cardsRed[2]}</Box>}
        </Box>
    </Box>;
}
