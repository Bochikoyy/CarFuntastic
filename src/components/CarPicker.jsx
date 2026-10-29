import { useEffect, useRef } from 'react';
import { CAR_CATALOG, drawCarModel } from '../game/CarCatalog.js';
import { VEHICLE } from '../game/constants.js';

function CarPreviewCanvas({ carId }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(globalThis.devicePixelRatio || 1, 2);
    const width = 180;
    const height = 90;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    // Subtle ground line
    ctx.strokeStyle = 'rgba(43, 43, 43, 0.25)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(18, 74);
    ctx.lineTo(width - 18, 74);
    ctx.stroke();

    ctx.save();
    ctx.translate(width / 2, 46);
    ctx.scale(1.85, 1.85);
    const ox = VEHICLE.wheelOffsetX;
    const oy = VEHICLE.wheelOffsetY;
    const r = VEHICLE.wheelRadius;
    drawCarModel(
      ctx,
      {
        chassis: { x: 0, y: 0, angle: 0 },
        wheels: [
          { x: -ox, y: oy, angle: 0.3, radius: r },
          { x: ox, y: oy, angle: 0.3, radius: r },
        ],
      },
      carId,
    );
    ctx.restore();
  }, [carId]);

  return <canvas ref={canvasRef} className="car-card__canvas" aria-hidden="true" />;
}

export function CarPicker({ selectedCarId, onSelectCar }) {
  return (
    <div className="car-picker" role="radiogroup" aria-label="Choose your car">
      {CAR_CATALOG.map((car) => {
        const selected = car.id === selectedCarId;
        return (
          <button
            key={car.id}
            type="button"
            role="radio"
            aria-checked={selected}
            className={`car-card ${selected ? 'car-card--selected' : ''}`.trim()}
            onClick={() => onSelectCar(car.id)}
          >
            <CarPreviewCanvas carId={car.id} />
            <div className="car-card__info">
              <div className="car-card__header">
                <span
                  className="car-card__swatch"
                  style={{ background: car.badgeColor, borderColor: car.accentColor }}
                  aria-hidden="true"
                />
                <span className="car-card__name">{car.name}</span>
              </div>
              <span className="car-card__sub">{car.subtitle}</span>
              <span className="car-card__tag">{selected ? '✓ Equipped' : 'Select'}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
