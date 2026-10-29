import { LEVEL_COUNT } from '../levels/index.js';

export const SCREENS = Object.freeze({
  TITLE: 'title',
  LEVEL_SELECT: 'level-select',
  GAME: 'game',
  SETTINGS: 'settings',
  NOT_FOUND: 'not-found',
});

export function parseHash(hash = '') {
  const clean = hash.replace(/^#\/?/, '').trim();
  if (!clean || clean === 'title') return { screen: SCREENS.TITLE };
  if (clean === 'levels') return { screen: SCREENS.LEVEL_SELECT };
  if (clean === 'settings') return { screen: SCREENS.SETTINGS };
  const match = /^level\/(\d+)$/.exec(clean);
  if (match) {
    const levelNumber = Number(match[1]);
    if (levelNumber >= 1 && levelNumber <= LEVEL_COUNT) {
      return { screen: SCREENS.GAME, levelNumber };
    }
  }
  return { screen: SCREENS.NOT_FOUND };
}

export function buildHash(route) {
  switch (route.screen) {
    case SCREENS.TITLE:
      return '#/';
    case SCREENS.LEVEL_SELECT:
      return '#/levels';
    case SCREENS.SETTINGS:
      return '#/settings';
    case SCREENS.GAME:
      return `#/level/${route.levelNumber ?? 1}`;
    default:
      return '#/404';
  }
}

