export enum AnalyticsCategory {
	GAME_PHASE = 'game-phase',
	GAME_TYPE = 'game-type',
}
export enum AnalyticsAction {
	GAME_PHASE_GAME_STARTED = 'game-phase--game-started',
	GAME_PHASE_GAME_ENDED = 'game-phase--game-ended',
	GAME_TYPE_1_PLAYER = 'game-type--1-player',
	GAME_TYPE_2_PLAYERS = 'game-type--2-players',
}

export class Analytics {
	static sendEvent(event_category: AnalyticsCategory, event_action: AnalyticsAction, event_label = '') {
		window['gtag']('event', event_action as string, {
			event_category: event_category as string,
			event_label: event_label ? event_label.trim() : (event_action as string),
		});
	}
}
