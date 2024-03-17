export enum AnalyticsCategory {
    GAME_PHASE = 'game-phase',
    GAME_TYPE = 'game-type',
    GAME_RESULT = 'game-result',
    MUSIC = 'music',
}
export enum AnalyticsAction {
    GAME_PHASE_GAME_STARTED = 'game-phase--game-started',
    GAME_PHASE_GAME_ENDED = 'game-phase--game-ended',
    GAME_TYPE_1_PLAYER = 'game-type--1-player',
    GAME_TYPE_2_PLAYERS = 'game-type--2-players',
    GAME_RESULT_BOT_LOSS = 'game-result--bot-loss-',
    GAME_RESULT_BOT_WIN = 'game-result--bot-win-',
    MUSIC_ON = 'music--on',
}

export function sendAnalyticsEvent(event_category: AnalyticsCategory, event_action: AnalyticsAction | string, event_label = '') {
    const _window = window as any;
    _window['gtag']('event', event_action as string, {
        event_category: event_category as string,
        event_label: event_label ? event_label.trim() : (event_action as string),
    });
}
