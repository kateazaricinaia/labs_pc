const MODEL_ROOT = '/home/runner/work/labs_pc/labs_pc/models';

const models = {
  sand: null,
  grass: null,
  chest: null,
  ship: null,
  towerBase: null,
  towerMiddle: null,
  towerTop: null,
  rocks: [],
  palms: []
};

const fallbackNames = {
  rocks: ['rocks-1.obj', 'rocks-2.obj', 'rocks-3.obj'],
  palms: ['palm-1.obj', 'palm-2.obj', 'palm-3.obj']
};

const state = {
  time: 0,
  shipPos: { x: -260, z: 120 },
  towerPos: { x: 200, z: -40 },
  projectile: null,
  shotCount: 0,
  towerDamageStage: 0,
  fragments: []
};

function safeLoadModel(file, onDone) {
  return loadModel(
    `${MODEL_ROOT}/${file}`,
    true,
    (m) => onDone(m),
    () => onDone(null)
  );
}

function preload() {
  safeLoadModel('patch-sand.obj', (m) => (models.sand = m));
  safeLoadModel('grass.obj', (m) => (models.grass = m));
  safeLoadModel('chest.obj', (m) => (models.chest = m));
  safeLoadModel('ship.obj', (m) => (models.ship = m));

  safeLoadModel('tower-base.obj', (m) => (models.towerBase = m));
  safeLoadModel('tower-middle.obj', (m) => (models.towerMiddle = m));
  safeLoadModel('tower-top.obj', (m) => (models.towerTop = m));

  fallbackNames.rocks.forEach((name, i) => {
    safeLoadModel(name, (m) => {
      models.rocks[i] = m;
    });
  });

  fallbackNames.palms.forEach((name, i) => {
    safeLoadModel(name, (m) => {
      models.palms[i] = m;
    });
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1);
  frameRate(30);
  noStroke();
  document.oncontextmenu = () => false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  state.time += deltaTime * 0.001;

  background(18, 42, 73);

  const camX = 0;
  const camY = -120;
  const camZ = 560;
  camera(camX, camY, camZ, 0, 0, 0, 0, 1, 0);

  ambientLight(90);
  directionalLight(255, 240, 220, -0.4, -1, -0.3);
  directionalLight(110, 130, 170, 0.4, -0.6, 0.3);

  drawSea();
  drawIsland();
  drawShip();
  updateProjectile();
  drawProjectile();
  updateFragments();
  drawFragments();
  draw2DOverlay();
}

function waveHeight(x, z, t) {
  return (
    sin(x * 0.018 + t * 1.4) * 10 +
    cos(z * 0.023 + t * 1.1) * 7 +
    sin((x + z) * 0.012 + t * 0.8) * 4
  );
}

function drawSea() {
  push();
  rotateX(HALF_PI);
  translate(0, 0, 30);
  ambientMaterial(35, 104, 170);
  plane(2200, 2200, 24, 24);
  pop();
}

function drawIsland() {
  push();
  const y = -20;

  if (models.sand) {
    push();
    translate(160, y, -10);
    scale(45);
    ambientMaterial(220, 193, 132);
    model(models.sand);
    pop();
  } else {
    push();
    translate(160, y + 10, -10);
    ambientMaterial(220, 193, 132);
    cylinder(160, 40, 24, 1);
    pop();
  }

  if (models.grass) {
    push();
    translate(160, y - 12, -20);
    scale(42);
    ambientMaterial(80, 150, 82);
    model(models.grass);
    pop();
  }

  drawDecorRocks();
  drawDecorPalmsAndChest();
  drawTower();
  pop();
}

function drawDecorRocks() {
  const rockPositions = [
    { x: 90, y: -12, z: -70, s: 14 },
    { x: 228, y: -12, z: -102, s: 11 },
    { x: 250, y: -12, z: 20, s: 10 }
  ];

  rockPositions.forEach((p, i) => {
    push();
    translate(p.x, p.y, p.z);
    rotateY(i * 0.8);
    ambientMaterial(120, 120, 126);

    const m = models.rocks[i % models.rocks.length];
    if (m) {
      scale(p.s);
      model(m);
    } else {
      sphere(p.s * 0.7, 8, 8);
    }
    pop();
  });
}

function drawDecorPalmsAndChest() {
  const palmPositions = [
    { x: 112, y: -13, z: -22, s: 22 },
    { x: 210, y: -13, z: -24, s: 19 },
    { x: 170, y: -13, z: 58, s: 20 }
  ];

  palmPositions.forEach((p, i) => {
    push();
    translate(p.x, p.y, p.z);
    rotateY(0.3 + i * 0.75);

    const m = models.palms[i % models.palms.length];
    if (m) {
      ambientMaterial(95, 155, 90);
      scale(p.s);
      model(m);
    } else {
      ambientMaterial(114, 84, 43);
      cylinder(3, 38, 7, 1);
      translate(0, -22, 0);
      ambientMaterial(79, 135, 70);
      cone(24, 26, 9, 1);
    }
    pop();
  });

  push();
  translate(120, -10, -18);
  rotateY(0.35);
  ambientMaterial(151, 106, 58);
  if (models.chest) {
    scale(10);
    model(models.chest);
  } else {
    box(16, 10, 11);
  }
  pop();
}

function drawTower() {
  const { x, z } = state.towerPos;
  const baseY = -10;

  const baseVisible = state.towerDamageStage < 2;
  const middleVisible = state.towerDamageStage < 1 || random() > 0.55;
  const topVisible = state.towerDamageStage < 1 || random() > 0.8;

  if (baseVisible) {
    push();
    translate(x, baseY - 10, z);
    ambientMaterial(166, 164, 168);
    if (models.towerBase) {
      scale(18);
      model(models.towerBase);
    } else {
      cylinder(24, 50, 16, 1);
    }
    pop();
  }

  if (middleVisible) {
    push();
    translate(x, baseY - 52, z);
    rotateZ(state.towerDamageStage >= 1 ? -0.15 : 0);
    ambientMaterial(176, 174, 179);
    if (models.towerMiddle) {
      scale(16);
      model(models.towerMiddle);
    } else {
      cylinder(18, 40, 12, 1);
    }
    pop();
  }

  if (topVisible) {
    push();
    translate(x, baseY - 85, z);
    rotateZ(state.towerDamageStage >= 1 ? -0.28 : 0);
    ambientMaterial(186, 184, 189);
    if (models.towerTop) {
      scale(14);
      model(models.towerTop);
    } else {
      cone(17, 35, 12, 1);
    }
    pop();
  }

  if (state.towerDamageStage >= 2) {
    push();
    translate(x, baseY - 8, z);
    ambientMaterial(162, 160, 164);
    cylinder(15, 18, 12, 1);
    pop();
  }
}

function drawShip() {
  const { x, z } = state.shipPos;
  const y = waveHeight(x, z, state.time) - 24;
  const roll = sin(state.time * 1.4) * 0.14;
  const pitch = cos(state.time * 1.2) * 0.08;

  push();
  translate(x, y, z);
  rotateY(-0.45);
  rotateZ(roll);
  rotateX(pitch);

  ambientMaterial(150, 91, 54);
  if (models.ship) {
    push();
    scale(24);
    model(models.ship);
    pop();
  } else {
    push();
    scale(1.3, 0.65, 2.6);
    box(90, 26, 36);
    pop();
  }

  push();
  translate(0, -58, 0);
  ambientMaterial(132, 98, 58);
  cylinder(3.5, 95, 10, 1);
  pop();

  drawFlag(y);
  pop();
}

function drawFlag(shipY) {
  const flagOrigin = { x: 0, y: -98, z: 0 };
  const cols = 14;
  const rows = 6;
  const w = 66;
  const h = 30;

  push();
  translate(flagOrigin.x + 32, flagOrigin.y, flagOrigin.z);
  rotateY(0.25);
  ambientMaterial(208, 37, 37);

  for (let yi = 0; yi < rows; yi++) {
    beginShape(TRIANGLE_STRIP);
    for (let xi = 0; xi <= cols; xi++) {
      const x = (xi / cols) * w;
      const y0 = (yi / rows) * h;
      const y1 = ((yi + 1) / rows) * h;
      const wave0 = sin(state.time * 5 + xi * 0.7 + yi * 0.25) * 4 + cos(state.time * 2.3 + xi * 0.3) * 2;
      const wave1 = sin(state.time * 5 + xi * 0.7 + (yi + 1) * 0.25) * 4 + cos(state.time * 2.3 + xi * 0.3) * 2;
      vertex(x, y0, wave0);
      vertex(x, y1, wave1);
    }
    endShape();
  }

  pop();
}

function mousePressed() {
  if (mouseButton !== RIGHT) return;
  if (state.projectile) return;

  state.shotCount += 1;

  const from = createVector(state.shipPos.x + 42, waveHeight(state.shipPos.x, state.shipPos.z, state.time) - 48, state.shipPos.z);
  const isSecond = state.shotCount >= 2;
  const to = isSecond
    ? createVector(state.towerPos.x, -12, state.towerPos.z)
    : createVector(state.towerPos.x, -56, state.towerPos.z);

  state.projectile = {
    from,
    to,
    t: 0,
    arc: isSecond ? 85 : 65,
    impactStage: isSecond ? 2 : 1
  };
}

function updateProjectile() {
  if (!state.projectile) return;
  const p = state.projectile;
  p.t += deltaTime * 0.001 * 0.75;

  if (p.t >= 1) {
    p.t = 1;
    triggerTowerHit(p.impactStage);
    state.projectile = null;
  }
}

function projectilePosition() {
  const p = state.projectile;
  if (!p) return null;

  const t = p.t;
  const x = lerp(p.from.x, p.to.x, t);
  const y = lerp(p.from.y, p.to.y, t) - sin(PI * t) * p.arc;
  const z = lerp(p.from.z, p.to.z, t);
  return createVector(x, y, z);
}

function drawProjectile() {
  const pos = projectilePosition();
  if (!pos) return;

  push();
  translate(pos.x, pos.y, pos.z);
  ambientMaterial(50);
  sphere(6, 10, 10);
  pop();
}

function triggerTowerHit(stage) {
  if (stage <= state.towerDamageStage) return;
  state.towerDamageStage = stage;

  const n = stage === 1 ? 22 : 34;
  for (let i = 0; i < n; i++) {
    const highHit = stage === 1;
    const originY = highHit ? -52 + random(-10, 14) : -18 + random(-8, 10);
    const dir = p5.Vector.random3D();
    dir.y = highHit ? random(-0.3, 0.5) : random(-0.2, 0.9);
    dir.mult(random(1.8, 4.4) * (stage === 2 ? 1.25 : 1));

    state.fragments.push({
      pos: createVector(state.towerPos.x + random(-18, 18), originY, state.towerPos.z + random(-12, 12)),
      vel: dir,
      rot: createVector(random(TWO_PI), random(TWO_PI), random(TWO_PI)),
      rotVel: createVector(random(-0.06, 0.06), random(-0.06, 0.06), random(-0.06, 0.06)),
      size: random(5, 12),
      life: 3.2
    });
  }
}

function updateFragments() {
  const dt = deltaTime * 0.001;
  state.fragments = state.fragments.filter((f) => {
    f.life -= dt;
    f.vel.y += 3.6 * dt;
    f.pos.add(p5.Vector.mult(f.vel, dt * 60));
    f.rot.add(p5.Vector.mult(f.rotVel, dt * 60));

    if (f.pos.y > 6) {
      f.pos.y = 6;
      f.vel.y *= -0.32;
      f.vel.x *= 0.78;
      f.vel.z *= 0.78;
    }

    return f.life > 0;
  });

  if (state.fragments.length > 140) {
    state.fragments.splice(0, state.fragments.length - 140);
  }
}

function drawFragments() {
  ambientMaterial(165, 163, 168);
  state.fragments.forEach((f) => {
    push();
    translate(f.pos.x, f.pos.y, f.pos.z);
    rotateX(f.rot.x);
    rotateY(f.rot.y);
    rotateZ(f.rot.z);
    box(f.size, f.size * 0.85, f.size);
    pop();
  });
}

function draw2DOverlay() {
  push();
  resetMatrix();
  translate(-width / 2, -height / 2);

  noStroke();
  fill(255, 255, 255, 220);
  textSize(16);
  text('ПКМ: выстрел с корабля', 20, 30);
  text('1-й выстрел: частичное разрушение выше середины', 20, 52);
  text('2-й выстрел: удар в основание и окончательное разрушение', 20, 74);

  stroke(179, 220, 255, 130);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let x = 0; x <= width; x += 12) {
    const y = height - 70 + sin(x * 0.02 + state.time * 3.2) * 10 + cos(x * 0.01 + state.time * 1.4) * 4;
    vertex(x, y);
  }
  endShape();

  noStroke();
  fill(30, 30, 35, 130);
  rect(width - 250, 20, 220, 70, 8);
  fill(255);
  textSize(14);
  text(`Выстрелов: ${state.shotCount}`, width - 230, 45);
  text(`Стадия разрушения: ${state.towerDamageStage}/2`, width - 230, 65);

  pop();
}
