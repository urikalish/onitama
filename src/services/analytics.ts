export enum AnalyticsCategory {
    GAME_PHASE = 'game-phase',
    GAME_RESULT = 'game-result',
    PLAYERS = 'players',
    MUSIC = 'music',
}
export enum AnalyticsAction {
    GAME_PHASE_GAME_STARTED = 'game-phase--game-started',
    GAME_PHASE_GAME_ENDED = 'game-phase--game-ended',
    GAME_RESULT_BOT_LOSS = 'game-result--bot-loss-',
    GAME_RESULT_BOT_WIN = 'game-result--bot-win-',
    PLAYER_TYPES_PREFIX = 'player-types--',
    PLAYER_STRENGTHS_PREFIX = 'player-strength--',
    MUSIC_ON = 'music--on',
}

export function sendAnalyticsEvent(event_category: AnalyticsCategory, event_action: AnalyticsAction | string, event_label = '') {
    const _window = window as any;
    _window['gtag']('event', event_action as string, {
        event_category: event_category as string,
        event_label: event_label ? event_label.trim() : (event_action as string),
    });
}
