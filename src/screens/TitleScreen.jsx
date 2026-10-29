import { useState } from 'react';
import { Button } from '../components/Button.jsx';
import { CarPicker } from '../components/CarPicker.jsx';
import { Modal } from '../components/Modal.jsx';
import { getCarById } from '../game/CarCatalog.js';

const VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '1.0.0';

export function TitleScreen({
  progress,
  settings,
  onSelectCar,
  onPlay,
  onContinue,
  onLevelSelect,
  onSettings,
}) {
  const [showGarage, setShowGarage] = useState(false);
  const hasProgress = progress.unlockedLevel > 1 || progress.completedLevels.length > 0;
  const currentCar = getCarById(settings?.carId);
  return (
    <main className="screen screen--title">
      <div className="title-card">
        <img
          src={`${import.meta.env.BASE_URL}assets/images/logo.svg`}
          alt="Carfuntastic"
          className="title-card__logo"
        />
        <p className="title-card__tagline">
          Make every line a little experiment: draw it, test it, learn from it, and get the car
          home.
        </p>

        <div className="title-card__actions">
          <Button variant="primary" size="lg" onClick={onPlay}>
            {hasProgress ? 'Play Level 1' : 'Play'}
          </Button>
          {hasProgress && (
            <Button variant="accent" size="lg" onClick={onContinue}>
              Continue (Level {progress.unlockedLevel})
            </Button>
          )}
          <Button variant="secondary" size="lg" onClick={onLevelSelect}>
            Level Select
          </Button>
          <Button variant="secondary" size="md" onClick={() => setShowGarage(true)}>
            🚗 Garage: {currentCar.name}
          </Button>
          <Button variant="ghost" size="md" onClick={onSettings}>
            Settings
          </Button>
        </div>

        <footer className="title-card__footer">
          <span>Draw with mouse, pen, or touch</span>
          <span>•</span>
          <span>v{VERSION}</span>
        </footer>
      </div>

      {showGarage && (
        <Modal title="Garage — Choose Your Car">
          <CarPicker
            selectedCarId={currentCar.id}
            onSelectCar={(id) => {
              onSelectCar?.(id);
            }}
          />
          <div className="modal__actions">
            <Button variant="primary" onClick={() => setShowGarage(false)}>
              Done
            </Button>
          </div>
        </Modal>
      )}
    </main>
  );
}
