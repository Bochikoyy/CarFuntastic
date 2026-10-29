export const GAME_STATES = Object.freeze({
  LOADING: 'loading',
  READY: 'ready',
  DRAWING: 'drawing',
  RUNNING: 'running',
  PAUSED: 'paused',
  WON: 'won',
  FAILED: 'failed',
});

const ALLOWED = Object.freeze({
  [GAME_STATES.LOADING]: [GAME_STATES.READY],
  [GAME_STATES.READY]: [GAME_STATES.DRAWING, GAME_STATES.RUNNING, GAME_STATES.LOADING],
  [GAME_STATES.DRAWING]: [GAME_STATES.READY, GAME_STATES.LOADING],
  [GAME_STATES.RUNNING]: [
    GAME_STATES.PAUSED,
    GAME_STATES.WON,
    GAME_STATES.FAILED,
    GAME_STATES.READY,
    GAME_STATES.LOADING,
  ],
  [GAME_STATES.PAUSED]: [GAME_STATES.RUNNING, GAME_STATES.READY, GAME_STATES.LOADING],
  [GAME_STATES.WON]: [GAME_STATES.READY, GAME_STATES.LOADING],
  [GAME_STATES.FAILED]: [GAME_STATES.READY, GAME_STATES.LOADING],
});

/**
 * Explicit state machine so impossible combinations of booleans can never
 * occur, and terminal states (`won` / `failed`) can trigger only once per run.
 */
export class GameStateMachine {
  constructor(initial = GAME_STATES.LOADING) {
    this.state = initial;
  }

  canTransition(next) {
    return (ALLOWED[this.state] ?? []).includes(next);
  }

  transition(next) {
    if (!this.canTransition(next)) {
      throw new Error(`Invalid game state transition: "${this.state}" -> "${next}".`);
    }
    this.state = next;
    return this.state;
  }

  isTerminal() {
    return this.state === GAME_STATES.WON || this.state === GAME_STATES.FAILED;
  }
}
