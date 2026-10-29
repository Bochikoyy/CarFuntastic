import { useState } from 'react';
import { Button } from '../components/Button.jsx';
import { CarPicker } from '../components/CarPicker.jsx';
import { Toggle } from '../components/Toggle.jsx';

export function SettingsScreen({ settings, onUpdateSettings, onResetProgress, onBack }) {
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <main className="screen screen--settings">
      <div className="panel">
        <header className="panel__header">
          <Button variant="ghost" onClick={onBack}>
            ← Back
          </Button>
          <h1>Settings & Garage</h1>
        </header>

        <div className="panel__section">
          <h2>Choose Your Car</h2>
          <CarPicker
            selectedCarId={settings.carId}
            onSelectCar={(carId) => onUpdateSettings({ carId })}
          />
        </div>

        <div className="panel__section">
          <Toggle
            label="Mute sound effects"
            description="Silence drawing, engine, and win/fail audio cues."
            checked={settings.muted}
            onChange={(muted) => onUpdateSettings({ muted })}
          />
          <Toggle
            label="Reduced motion"
            description="Tone down UI transitions and celebration animations."
            checked={settings.reducedMotion}
            onChange={(reducedMotion) => onUpdateSettings({ reducedMotion })}
          />
        </div>

        <div className="panel__section panel__section--danger">
          <h2>Saved Progress</h2>
          <p>Resetting locks levels 2–10 and clears all earned stars on this device.</p>
          {!confirmReset ? (
            <Button variant="danger" onClick={() => setConfirmReset(true)}>
              Reset Progress…
            </Button>
          ) : (
            <div className="confirm-row">
              <span>Are you sure?</span>
              <Button
                variant="danger"
                onClick={() => {
                  onResetProgress();
                  setConfirmReset(false);
                }}
              >
                Yes, reset everything
              </Button>
              <Button variant="secondary" onClick={() => setConfirmReset(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
