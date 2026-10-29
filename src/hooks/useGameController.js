import { useEffect, useRef, useState } from 'react';
import { GameController } from '../game/GameController.js';

/**
 * Mounts a `GameController` onto `canvasRef`, keeps it synchronized with the
 * active `levelNumber` and `muted` setting, and mirrors coarse HUD snapshots
 * into React state. Strict-Mode safe: cleanup disposes the controller cleanly.
 */
export function useGameController(canvasRef, { levelNumber, muted, onWin }) {
  const controllerRef = useRef(null);
  const onWinRef = useRef(onWin);
  const [snapshot, setSnapshot] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    onWinRef.current = onWin;
  }, [onWin]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const debug = import.meta.env?.VITE_DEBUG_PHYSICS === 'true';
    let controller;
    let unsubscribe = () => {};
    try {
      controller = new GameController(canvas, {
        muted,
        debug,
        onWin: (info) => onWinRef.current?.(info),
      });
      controllerRef.current = controller;
      unsubscribe = controller.subscribeToEvents((snap) => {
        setError(null);
        setSnapshot(snap);
      });
      controller.loadLevel(levelNumber);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      queueMicrotask(() => setError(message));
      controller?.dispose();
      controllerRef.current = null;
    }
    return () => {
      unsubscribe();
      controller?.dispose();
      controllerRef.current = null;
    };
    // `muted` is updated via a dedicated effect so toggling sound does not reset the level.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasRef, levelNumber]);

  useEffect(() => {
    controllerRef.current?.setMuted(muted);
  }, [muted]);

  return {
    snapshot,
    error,
    start: () => controllerRef.current?.start(),
    pause: () => controllerRef.current?.pause(),
    resume: () => controllerRef.current?.resume(),
    retry: () => controllerRef.current?.retry(),
    undo: () => controllerRef.current?.undoStroke(),
    clear: () => controllerRef.current?.clearStrokes(),
  };
}
