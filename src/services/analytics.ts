export enum AnalyticsCategory {
    GAME_PHASE = 'game-phase',
    GAME_MODE = 'game-mode',
    GAME_RESULT = 'game-result',
    PLAYERS = 'players',
    MUSIC = 'music',
}
export enum AnalyticsAction {
    GAME_PHASE_GAME_STARTED = 'game-phase--game-started',
    GAME_PHASE_GAME_ENDED = 'game-phase--game-ended',
    MUSIC_ON = 'music--on',
}

export function sendAnalyticsEvent(event_category: AnalyticsCategory, event_action: AnalyticsAction | string, event_label = '') {
    const _window = window as any;
    _window['gtag']('event', event_action as string, {
        event_category: event_category as string,
        event_label: event_label ? event_label.trim() : (event_action as string),
    });
}
