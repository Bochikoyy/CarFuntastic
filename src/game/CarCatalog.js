import { VEHICLE } from './constants.js';

export const DEFAULT_CAR_ID = 'polestar-2';

export const CAR_CATALOG = Object.freeze([
  {
    id: 'polestar-2',
    name: 'Polestar 2',
    subtitle: 'Scandinavian EV Fastback',
    badgeColor: '#ffffff',
    accentColor: '#383d44',
  },
  {
    id: 'mustang-widebody',
    name: 'Mustang GT Widebody',
    subtitle: 'Nardo Grey Louvered Muscle',
    badgeColor: '#959ba3',
    accentColor: '#c1121f',
  },
  {
    id: 'm4-gt',
    name: 'BMW M4 GT',
    subtitle: 'Yas Marina Blue Track Coupe',
    badgeColor: '#1f8ef1',
    accentColor: '#1a1d21',
  },
  {
    id: 'concept-m6-gt3',
    name: 'Concept M6 GT3',
    subtitle: 'Matte White Aero Time-Attack',
    badgeColor: '#e9ecef',
    accentColor: '#adb5bd',
  },
  {
    id: 'altezza-widebody',
    name: 'IS300 / Altezza Drift',
    subtitle: 'Desert Sand Ducktail Sedan',
    badgeColor: '#cfc5aa',
    accentColor: '#c9df00',
  },
]);

export const CAR_IDS = Object.freeze(CAR_CATALOG.map((c) => c.id));

export function getCarById(carId) {
  return CAR_CATALOG.find((c) => c.id === carId) ?? CAR_CATALOG[0];
}

function drawWheelArches(ctx, ox, archR, flareColor = null) {
  for (const wx of [-ox, ox]) {
    if (flareColor) {
      ctx.fillStyle = flareColor;
      ctx.strokeStyle = '#2b2b2b';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(wx, 9.5, archR + 3, Math.PI * 1.04, -Math.PI * 0.04, false);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.fillStyle = '#141414';
    ctx.beginPath();
    ctx.arc(wx, 10, archR, Math.PI, 0, false);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#262626';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(wx, 10, archR, Math.PI * 1.02, -Math.PI * 0.02, false);
    ctx.stroke();
  }
}

/* -------------------------------------------------------------------------- */
/* 1. Polestar 2 (White Fastback Sedan)                                       */
/* -------------------------------------------------------------------------- */
function drawPolestarBody(ctx, ox, archR) {
  // Shark-fin roof antenna
  ctx.fillStyle = '#262626';
  ctx.beginPath();
  ctx.moveTo(-11, -17);
  ctx.lineTo(-7, -20);
  ctx.lineTo(-5, -17);
  ctx.closePath();
  ctx.fill();

  // Main body silhouette
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#2b2b2b';
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(-31, 9);
  ctx.lineTo(-32, 3);
  ctx.lineTo(-30, -5);
  ctx.lineTo(-27, -7);
  ctx.quadraticCurveTo(-17, -17, -9, -17.5);
  ctx.quadraticCurveTo(2, -18, 9, -15.5);
  ctx.lineTo(18, -7);
  ctx.quadraticCurveTo(25, -5.5, 31, -3);
  ctx.lineTo(32, 4);
  ctx.lineTo(33, 9);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Lower dark rocker panel / splitter / diffuser
  ctx.fillStyle = '#262626';
  ctx.beginPath();
  ctx.moveTo(-31, 9);
  ctx.lineTo(-32, 5.5);
  ctx.lineTo(-26, 6.5);
  ctx.lineTo(27, 6.5);
  ctx.lineTo(33, 6.5);
  ctx.lineTo(33, 9);
  ctx.closePath();
  ctx.fill();

  drawWheelArches(ctx, ox, archR);

  // Greenhouse window frame & glass
  ctx.fillStyle = '#262626';
  ctx.beginPath();
  ctx.moveTo(-19, -7.5);
  ctx.quadraticCurveTo(-13, -15, -7, -15.5);
  ctx.quadraticCurveTo(2, -16, 8, -14);
  ctx.lineTo(16, -7.5);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#383d44';
  ctx.beginPath();
  ctx.moveTo(-17.5, -8);
  ctx.quadraticCurveTo(-12.5, -14, -7, -14.4);
  ctx.lineTo(-2.5, -14.4);
  ctx.lineTo(-3.2, -8);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#525860';
  ctx.beginPath();
  ctx.moveTo(-1.2, -14.4);
  ctx.quadraticCurveTo(3, -14.5, 7.2, -13);
  ctx.lineTo(14.2, -8);
  ctx.lineTo(-1.8, -8);
  ctx.closePath();
  ctx.fill();

  // Beltline, B-pillar & door handles
  ctx.strokeStyle = 'rgba(43, 43, 43, 0.35)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-26, -4.5);
  ctx.lineTo(27, -3.5);
  ctx.moveTo(-2, -7.5);
  ctx.lineTo(-2, 5.5);
  ctx.stroke();

  ctx.strokeStyle = '#2b2b2b';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-11, -3.2);
  ctx.lineTo(-7.5, -3.2);
  ctx.moveTo(1, -3.2);
  ctx.lineTo(4.5, -3.2);
  ctx.stroke();

  // Mirror
  ctx.fillStyle = '#262626';
  ctx.fillRect(10.5, -8, 2.2, 2.5);
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#2b2b2b';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.ellipse(11.8, -8.5, 2.6, 1.6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Headlight + intake
  ctx.fillStyle = '#e8f1f8';
  ctx.beginPath();
  ctx.moveTo(23.5, -4.2);
  ctx.lineTo(30.8, -2.8);
  ctx.lineTo(29.8, -0.8);
  ctx.lineTo(25, -1.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#262626';
  ctx.beginPath();
  ctx.moveTo(27.5, 0.5);
  ctx.lineTo(31, 0.8);
  ctx.lineTo(30.8, 5);
  ctx.lineTo(26.5, 4.5);
  ctx.closePath();
  ctx.fill();

  // Taillight
  ctx.fillStyle = '#d62828';
  ctx.beginPath();
  ctx.moveTo(-30.2, -5);
  ctx.lineTo(-24.5, -4.8);
  ctx.lineTo(-25.5, -1.5);
  ctx.lineTo(-30.6, -1.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

/* -------------------------------------------------------------------------- */
/* 2. Mustang GT Widebody (Nardo Grey + Rear Louvers + Chin Splitter)         */
/* -------------------------------------------------------------------------- */
function drawMustangBody(ctx, ox, archR) {
  const body = '#959ba3';
  const dark = '#1f2226';

  // Rear window louvers (stepped black fins along the fastback slope)
  ctx.fillStyle = dark;
  for (let i = 0; i < 5; i += 1) {
    const lx = -13 - i * 3.1;
    const ly = -15.5 + i * 1.65;
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(lx - 2.6, ly - 1.3);
    ctx.lineTo(lx - 1.2, ly + 1.1);
    ctx.closePath();
    ctx.fill();
  }

  // Main coupe silhouette with kicked-up ducktail and extended front chin splitter
  ctx.fillStyle = body;
  ctx.strokeStyle = '#2b2b2b';
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(-33, 9);
  ctx.lineTo(-34, 4);
  ctx.lineTo(-31.5, -4.5);
  ctx.lineTo(-32.8, -8.5); // ducktail kick
  ctx.lineTo(-29.5, -7);
  ctx.lineTo(-14, -15.8);
  ctx.quadraticCurveTo(-3, -17.5, 5, -15);
  ctx.lineTo(15, -7.2);
  ctx.quadraticCurveTo(25, -6.5, 32, -3.5);
  ctx.lineTo(31, 4.5);
  ctx.lineTo(35.5, 8.8); // low front chin splitter
  ctx.lineTo(35.5, 9.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Hood extractor vent
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.moveTo(19, -6.4);
  ctx.lineTo(24.5, -5.6);
  ctx.lineTo(23.5, -4.5);
  ctx.lineTo(18.5, -5.3);
  ctx.closePath();
  ctx.fill();

  // Lower splitter & side skirt lip
  ctx.fillStyle = dark;
  ctx.fillRect(-33, 7.2, 68.5, 2.2);

  // Bolt-on widebody flares & wheel arches
  drawWheelArches(ctx, ox, archR, '#8a9098');
  ctx.fillStyle = dark;
  for (const wx of [-ox, ox]) {
    for (let i = 0; i < 5; i += 1) {
      const a = Math.PI * (0.18 + i * 0.16);
      ctx.beginPath();
      ctx.arc(
        wx - Math.cos(a) * (archR + 1.7),
        9.5 - Math.sin(a) * (archR + 1.7),
        0.7,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }

  // Coupe window + quarter window
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.moveTo(-18, -7.5);
  ctx.lineTo(-11, -14.2);
  ctx.quadraticCurveTo(-2, -15.8, 4.5, -13.6);
  ctx.lineTo(13.5, -7.2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#4f565e';
  ctx.beginPath();
  ctx.moveTo(-9, -7.8);
  ctx.lineTo(-8, -13.6);
  ctx.quadraticCurveTo(-1, -14.6, 4, -12.8);
  ctx.lineTo(11.8, -7.8);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#373c42';
  ctx.beginPath();
  ctx.moveTo(-16.2, -8);
  ctx.lineTo(-10.5, -13.2);
  ctx.lineTo(-9.5, -8);
  ctx.closePath();
  ctx.fill();

  // Fuel filler cap + door handle + character crease
  ctx.strokeStyle = 'rgba(30,30,30,0.5)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(-24.5, -2.5, 1.8, 0, Math.PI * 2);
  ctx.moveTo(-6, -3.5);
  ctx.lineTo(10, -2.5);
  ctx.stroke();

  // Tri-bar Mustang headlight & front fog pocket
  ctx.fillStyle = '#e8eff5';
  ctx.strokeStyle = '#2b2b2b';
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(24.5, -4);
  ctx.lineTo(31.2, -2.8);
  ctx.lineTo(29.8, -0.8);
  ctx.lineTo(23.5, -1.8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.moveTo(27.5, 2.5);
  ctx.lineTo(32, 2.8);
  ctx.lineTo(31.2, 6.2);
  ctx.lineTo(26.5, 5.8);
  ctx.closePath();
  ctx.fill();

  // Slanted red tri-bar taillight
  ctx.fillStyle = '#c1121f';
  ctx.beginPath();
  ctx.moveTo(-31.5, -4.5);
  ctx.lineTo(-29, -4.2);
  ctx.lineTo(-30.5, -0.5);
  ctx.lineTo(-33, -0.8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

/* -------------------------------------------------------------------------- */
/* 3. BMW M4 GT (Yas Marina Blue + Swan-Neck GT Wing + Side Gill)             */
/* -------------------------------------------------------------------------- */
function drawM4Body(ctx, ox, archR) {
  const blue = '#1f8ef1';
  const dark = '#181b20';

  // Rear swan-neck GT wing (stanchions + blue endplate)
  ctx.strokeStyle = dark;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-27, -6);
  ctx.lineTo(-29, -12.5);
  ctx.stroke();

  ctx.fillStyle = blue;
  ctx.strokeStyle = '#2b2b2b';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(-33.5, -13.5);
  ctx.lineTo(-25, -11.8);
  ctx.lineTo(-26, -9.8);
  ctx.lineTo(-34, -11.2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Main coupe body
  ctx.fillStyle = blue;
  ctx.strokeStyle = '#2b2b2b';
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(-32, 8.5);
  ctx.lineTo(-33, 2);
  ctx.lineTo(-31, -5.5);
  ctx.lineTo(-25, -6.5);
  ctx.quadraticCurveTo(-15, -16, -7, -16.8);
  ctx.quadraticCurveTo(3, -17.2, 10, -14.5);
  ctx.lineTo(18, -7);
  ctx.quadraticCurveTo(26, -5.8, 32, -2.8);
  ctx.lineTo(32.5, 5);
  ctx.lineTo(34.5, 8.8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Carbon-black roof cap + lower carbon side skirt & front lip
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.moveTo(-12, -15.8);
  ctx.quadraticCurveTo(-2, -17.5, 9, -14.8);
  ctx.lineTo(7, -14);
  ctx.lineTo(-10, -14.5);
  ctx.closePath();
  ctx.fill();

  ctx.fillRect(-32, 6.8, 66.5, 2.2);

  drawWheelArches(ctx, ox, archR);

  // Hofmeister-kink coupe window
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.moveTo(-18.5, -7.2);
  ctx.quadraticCurveTo(-12, -14.8, -6, -15.2);
  ctx.quadraticCurveTo(3, -15.5, 8.5, -13.5);
  ctx.lineTo(15.5, -7.2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#404854';
  ctx.beginPath();
  ctx.moveTo(-16.5, -7.8);
  ctx.quadraticCurveTo(-11, -13.8, -5.5, -14.2);
  ctx.quadraticCurveTo(2.5, -14.4, 7.8, -12.6);
  ctx.lineTo(13.8, -7.8);
  ctx.closePath();
  ctx.fill();

  // B-pillar
  ctx.strokeStyle = dark;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-2.5, -14.5);
  ctx.lineTo(-4, -7.5);
  ctx.stroke();

  // Signature M front fender breather gill
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.moveTo(9.5, -4.5);
  ctx.lineTo(12.2, -4.5);
  ctx.lineTo(10.5, -0.5);
  ctx.lineTo(8.2, -0.5);
  ctx.closePath();
  ctx.fill();

  // Black M mirror
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.ellipse(12, -8.2, 2.6, 1.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Twin-halo LED headlight + tall vertical corner intake
  ctx.fillStyle = '#dceefb';
  ctx.strokeStyle = '#2b2b2b';
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  ctx.moveTo(24, -4);
  ctx.lineTo(31.2, -2.4);
  ctx.lineTo(30, -0.4);
  ctx.lineTo(23.5, -1.6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = dark;
  ctx.fillRect(29.5, 0.8, 2.2, 5.2);

  // L-shaped red LED taillight
  ctx.fillStyle = '#d90429';
  ctx.beginPath();
  ctx.moveTo(-31.2, -4.5);
  ctx.lineTo(-24.5, -4);
  ctx.lineTo(-25.5, -1.5);
  ctx.lineTo(-31.8, -1.8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

/* -------------------------------------------------------------------------- */
/* 4. Concept M6 GT3 (Matte White Widebody + Giant GT Wing + Side Exhaust)    */
/* -------------------------------------------------------------------------- */
function drawM6ConceptBody(ctx, ox, archR) {
  const body = '#eceff1';
  const shadow = '#cfd5dc';
  const dark = '#2b2f36';

  // Roof dual telemetry antennas
  ctx.strokeStyle = dark;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-8, -16.5);
  ctx.lineTo(-8.5, -20.5);
  ctx.moveTo(1, -16.5);
  ctx.lineTo(0.8, -20);
  ctx.stroke();

  // Huge rear GT3 wing on twin swept swan-neck pylons
  ctx.fillStyle = shadow;
  ctx.strokeStyle = '#2b2b2b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-24, -6.5);
  ctx.lineTo(-31, -14.5);
  ctx.lineTo(-27.5, -14.5);
  ctx.lineTo(-21, -6.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(-35.5, -16.5);
  ctx.lineTo(-25, -13.5);
  ctx.lineTo(-26, -11);
  ctx.lineTo(-36, -13.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Aggressive widebody silhouette with front splitter & tie-rods
  ctx.fillStyle = body;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(-32.5, 9);
  ctx.lineTo(-33, 1);
  ctx.lineTo(-30.5, -6);
  ctx.lineTo(-23, -7);
  ctx.quadraticCurveTo(-14, -16, -6, -16.5);
  ctx.quadraticCurveTo(3, -16.8, 10, -14.2);
  ctx.lineTo(18, -7);
  ctx.quadraticCurveTo(26, -5.8, 32, -2.5);
  ctx.lineTo(33, 5);
  ctx.lineTo(36, 9);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Aero rocker cut & side-exit exhaust recess (signature detail from image 3)
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.moveTo(-11, 4.5);
  ctx.lineTo(11, 3.5);
  ctx.lineTo(9, 8.5);
  ctx.lineTo(-11, 8.5);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.roundRect(-8.5, 0.2, 6.8, 3.6, 1.8);
  ctx.fill();
  ctx.fillStyle = '#e9ecef';
  ctx.strokeStyle = dark;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(-6.2, 2, 1.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  drawWheelArches(ctx, ox, archR, shadow);

  // Greenhouse with visible white internal roll-cage bars
  ctx.fillStyle = '#495057';
  ctx.strokeStyle = '#2b2b2b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-17.5, -7.5);
  ctx.quadraticCurveTo(-11.5, -14.5, -5.5, -15);
  ctx.quadraticCurveTo(3, -15.2, 8.5, -13.2);
  ctx.lineTo(15, -7.5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Roll-cage diagonal & B-pillar
  ctx.strokeStyle = '#dee2e6';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(-13, -8);
  ctx.lineTo(-4, -14.2);
  ctx.moveTo(-3, -14.5);
  ctx.lineTo(-1, -8);
  ctx.stroke();

  // Front mesh air intake + splitter support struts
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.moveTo(26, 1.5);
  ctx.lineTo(31.8, 2);
  ctx.lineTo(31.5, 6.5);
  ctx.lineTo(25.5, 6);
  ctx.closePath();
  ctx.fill();

  // Sleek dark-tinted race headlight & grey taillight
  ctx.fillStyle = '#343a40';
  ctx.beginPath();
  ctx.moveTo(24, -4);
  ctx.lineTo(31, -2.5);
  ctx.lineTo(29.8, -0.5);
  ctx.lineTo(23.5, -1.8);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#6c757d';
  ctx.beginPath();
  ctx.moveTo(-30.5, -4.8);
  ctx.lineTo(-25, -4.2);
  ctx.lineTo(-26, -1.5);
  ctx.lineTo(-31, -2);
  ctx.closePath();
  ctx.fill();
}

/* -------------------------------------------------------------------------- */
/* 5. IS300 / Altezza Widebody (Desert Sand + Ducktail + Deep-Dish 6-Spoke)   */
/* -------------------------------------------------------------------------- */
function drawAltezzaBody(ctx, ox, archR) {
  const sand = '#cfc5aa';
  const flare = '#c2b79a';
  const dark = '#1d1f21';

  // Main 4-door box-sedan body with tall integrated ducktail & low drift skirts
  ctx.fillStyle = sand;
  ctx.strokeStyle = '#2b2b2b';
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(-33, 9.2);
  ctx.lineTo(-32, 3);
  ctx.lineTo(-30.5, -4.5);
  ctx.lineTo(-31.8, -10.5); // tall vertical ducktail lip
  ctx.lineTo(-28.5, -6.5);
  ctx.lineTo(-21, -7.2);
  ctx.lineTo(-13.5, -16.2);
  ctx.quadraticCurveTo(-2, -17.2, 7.5, -15.5);
  ctx.lineTo(16.5, -7.2);
  ctx.quadraticCurveTo(25, -6.2, 31.5, -3.5);
  ctx.lineTo(32, 4.5);
  ctx.lineTo(34.5, 9.2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Extended ground-effect skirt line
  ctx.strokeStyle = 'rgba(43,43,43,0.45)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(-32.5, 7);
  ctx.lineTo(33.5, 7);
  ctx.stroke();

  // Riveted overfenders
  drawWheelArches(ctx, ox, archR, flare);

  // 4-door upright sedan greenhouse
  ctx.fillStyle = dark;
  ctx.beginPath();
  ctx.moveTo(-19.5, -7.5);
  ctx.lineTo(-12.5, -15);
  ctx.quadraticCurveTo(-2, -16, 6.8, -14.4);
  ctx.lineTo(15, -7.5);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#383d42';
  ctx.beginPath();
  ctx.moveTo(-17.8, -8);
  ctx.lineTo(-11.8, -14.2);
  ctx.lineTo(-2.5, -14.5);
  ctx.lineTo(-3, -8);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#4c5258';
  ctx.beginPath();
  ctx.moveTo(-1, -14.5);
  ctx.lineTo(6.2, -13.6);
  ctx.lineTo(13.2, -8);
  ctx.lineTo(-1.5, -8);
  ctx.closePath();
  ctx.fill();

  // Door seam + two pull handles
  ctx.strokeStyle = 'rgba(43,43,43,0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-2, -7.5);
  ctx.lineTo(-2, 6.5);
  ctx.moveTo(-11.5, -3.2);
  ctx.lineTo(-8, -3.2);
  ctx.moveTo(0.5, -3.2);
  ctx.lineTo(4, -3.2);
  ctx.stroke();

  // Sand-colored side mirror
  ctx.fillStyle = sand;
  ctx.strokeStyle = '#2b2b2b';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.ellipse(11.5, -8.4, 2.4, 1.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Clear-lens headlight + lower intercooler opening
  ctx.fillStyle = '#e9f1f7';
  ctx.beginPath();
  ctx.moveTo(25, -4.2);
  ctx.lineTo(31.2, -2.8);
  ctx.lineTo(30.4, -0.4);
  ctx.lineTo(24.5, -1.2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = dark;
  ctx.fillRect(27.5, 2.2, 4, 3.8);

  // Iconic Altezza clear/chrome housing with twin red roundels
  ctx.fillStyle = '#ced4da';
  ctx.beginPath();
  ctx.moveTo(-30.5, -4.8);
  ctx.lineTo(-25.5, -4.2);
  ctx.lineTo(-26.2, -0.6);
  ctx.lineTo(-31.2, -0.8);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#d90429';
  ctx.beginPath();
  ctx.arc(-28.4, -2.6, 1.5, 0, Math.PI * 2);
  ctx.fill();
}

/* -------------------------------------------------------------------------- */
/* Wheel Renderer (per-car rim & tire styling)                                */
/* -------------------------------------------------------------------------- */
function drawWheel(ctx, wheel, carId) {
  const r = wheel.radius;
  ctx.save();
  ctx.translate(wheel.x, wheel.y);
  ctx.rotate(wheel.angle);

  // Rubber tire
  ctx.fillStyle = '#1b1b1b';
  ctx.strokeStyle = '#2b2b2b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Yellow sidewall lettering on the Altezza drift car
  if (carId === 'altezza-widebody') {
    ctx.strokeStyle = '#d4e100';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.88, -0.7, 0.7);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.88, Math.PI - 0.7, Math.PI + 0.7);
    ctx.stroke();
  }

  const rimR = r * 0.76;

  // Inner barrel
  ctx.fillStyle = carId === 'm4-gt' ? '#16191d' : '#2b2f35';
  ctx.beginPath();
  ctx.arc(0, 0, rimR, 0, Math.PI * 2);
  ctx.fill();

  // Blue brake caliper peek on M4
  if (carId === 'm4-gt') {
    ctx.fillStyle = '#1f8ef1';
    ctx.beginPath();
    ctx.arc(-rimR * 0.45, 0, r * 0.22, 0, Math.PI * 2);
    ctx.fill();
  }

  // Outer lip (deep polished dish on Altezza, Mustang, M6)
  const lipColor =
    carId === 'altezza-widebody' ? '#f8f9fa' : carId === 'm4-gt' ? '#495057' : '#d4d8dd';
  ctx.strokeStyle = lipColor;
  ctx.lineWidth = carId === 'altezza-widebody' ? 2 : 1.4;
  ctx.beginPath();
  ctx.arc(0, 0, rimR, 0, Math.PI * 2);
  ctx.stroke();

  if (carId === 'mustang-widebody') {
    // 5 split twin-spokes (gunmetal)
    ctx.strokeStyle = '#adb5bd';
    ctx.lineWidth = 1.3;
    for (let i = 0; i < 5; i += 1) {
      const a = (i * Math.PI * 2) / 5;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a - 0.12) * (r * 0.2), Math.sin(a - 0.12) * (r * 0.2));
      ctx.lineTo(Math.cos(a - 0.18) * rimR, Math.sin(a - 0.18) * rimR);
      ctx.moveTo(Math.cos(a + 0.12) * (r * 0.2), Math.sin(a + 0.12) * (r * 0.2));
      ctx.lineTo(Math.cos(a + 0.18) * rimR, Math.sin(a + 0.18) * rimR);
      ctx.stroke();
    }
  } else if (carId === 'altezza-widebody') {
    // Thick white 6-spoke TE37-style drift wheel
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.1;
    for (let i = 0; i < 6; i += 1) {
      const a = (i * Math.PI * 2) / 6;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * (r * 0.2), Math.sin(a) * (r * 0.2));
      ctx.lineTo(Math.cos(a) * (rimR * 0.92), Math.sin(a) * (rimR * 0.92));
      ctx.stroke();
    }
  } else {
    // Y-spoke / GT3 mesh (Polestar 2, M4 GT, Concept M6 GT3)
    const count = carId === 'concept-m6-gt3' ? 7 : 5;
    ctx.strokeStyle =
      carId === 'm4-gt' ? '#6c757d' : carId === 'concept-m6-gt3' ? '#adb5bd' : '#d4d8dd';
    ctx.lineWidth = 1.4;
    ctx.lineCap = 'round';
    for (let i = 0; i < count; i += 1) {
      const a = (i * Math.PI * 2) / count;
      const splitR = rimR * 0.45;
      const sx = Math.cos(a) * splitR;
      const sy = Math.sin(a) * splitR;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * (r * 0.18), Math.sin(a) * (r * 0.18));
      ctx.lineTo(sx, sy);
      ctx.moveTo(sx, sy);
      ctx.lineTo(Math.cos(a - 0.24) * rimR, Math.sin(a - 0.24) * rimR);
      ctx.moveTo(sx, sy);
      ctx.lineTo(Math.cos(a + 0.24) * rimR, Math.sin(a + 0.24) * rimR);
      ctx.stroke();
    }
  }

  // Center cap
  ctx.fillStyle = '#1b1b1b';
  ctx.strokeStyle = lipColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

/**
 * Draw the selected vehicle (`chassis` + `wheels`) onto a 2D canvas context.
 * Also used by the Garage selector cards to render live miniature previews.
 */
export function drawCarModel(ctx, { chassis, wheels }, carId = DEFAULT_CAR_ID) {
  const ox = VEHICLE.wheelOffsetX;
  const archR = VEHICLE.wheelRadius + 3;

  ctx.save();
  ctx.translate(chassis.x, chassis.y);
  ctx.rotate(chassis.angle);

  switch (carId) {
    case 'mustang-widebody':
      drawMustangBody(ctx, ox, archR);
      break;
    case 'm4-gt':
      drawM4Body(ctx, ox, archR);
      break;
    case 'concept-m6-gt3':
      drawM6ConceptBody(ctx, ox, archR);
      break;
    case 'altezza-widebody':
      drawAltezzaBody(ctx, ox, archR);
      break;
    case 'polestar-2':
    default:
      drawPolestarBody(ctx, ox, archR);
      break;
  }

  ctx.restore();

  for (const wheel of wheels) {
    drawWheel(ctx, wheel, carId);
  }
}
