import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { letterGeometry } from './letters';

const WORD = ['P', 'E', 'D', 'R', 'O'];
// Teintes de --balloon-1/2/3, un peu plus saturées pour compenser le tone mapping.
const COLORS = ['#0C8A50', '#FF7EC2', '#8FDDB1', '#0C8A50', '#FF7EC2'];
const GAP = 0.2;

// Réglages physiques : un ballon = ressort mou + amortissement faible.
const REST_K = 7; // rappel vers la position de repos
const REST_C = 1.6; // amortissement
const DRAG_K = 90; // force qui suit le pointeur
const DRAG_C = 11;
const ROT_K = 9;
const ROT_C = 2.2;

interface Body {
  obj: THREE.Object3D;
  width: number;
  rest: THREE.Vector3;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  quat: THREE.Quaternion;
  angVel: THREE.Vector3;
  radius: number;
  phase: number;
  wakeAt: number;
  scale: number;
  targetScale: number;
}

export class BalloonLetters {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  private bodies: Body[] = [];
  private raycaster = new THREE.Raycaster();
  private pointer = new THREE.Vector2(-10, -10);
  private pointerPrev = new THREE.Vector2(-10, -10);
  private dragPlane = new THREE.Plane();
  private dragTarget = new THREE.Vector3();
  private grabOffset = new THREE.Vector3();
  private dragged: Body | null = null;
  private hovered: Body | null = null;
  private downAt = { x: 0, y: 0, t: 0 };
  private wordWidth = 4.5;
  private wordHeight = 1.3;
  private floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.12 }));
  private time = 0;
  private running = false;
  private visible = true;
  private raf = 0;
  private clock = new THREE.Clock();
  private reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  constructor(private canvas: HTMLCanvasElement, private onFirstGrab?: () => void) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.toneMappingExposure = 0.85;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(2, 6, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.radius = 8;
    key.shadow.blurSamples = 16;
    Object.assign(key.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5 });
    this.scene.add(key, new THREE.AmbientLight(0xffffff, 0.3));

    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.y = -1.1;
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);

    this.bindEvents();
    this.resize();
  }

  init() {
    const objects = this.buildLetters();
    this.layout(objects);
    this.resize();
    this.start();
  }

  private buildLetters(): THREE.Object3D[] {
    return WORD.map((c, i) => {
      const mesh = new THREE.Mesh(
        letterGeometry(c),
        new THREE.MeshPhysicalMaterial({
          color: COLORS[i],
          roughness: 0.2,
          metalness: 0,
          clearcoat: 1,
          clearcoatRoughness: 0.06,
          sheen: 0.15,
          sheenColor: new THREE.Color('#ffffff'),
        }),
      );
      mesh.castShadow = true;
      return mesh;
    });
  }

  private layout(objects: THREE.Object3D[]) {
    // Normalise la hauteur du mot à 1.
    const boxes = objects.map((o) => new THREE.Box3().setFromObject(o));
    const maxH = Math.max(...boxes.map((b) => b.max.y - b.min.y));
    const s = 1 / maxH;
    const widths = boxes.map((b) => (b.max.x - b.min.x) * s);

    objects.forEach((obj, i) => {
      obj.scale.setScalar(s);
      const body: Body = {
        obj,
        width: widths[i],
        rest: new THREE.Vector3(),
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        quat: new THREE.Quaternion().setFromEuler(
          this.reduced ? new THREE.Euler() : new THREE.Euler(0.6, (i - 2) * 0.4, (i % 2 ? 1 : -1) * 0.5),
        ),
        angVel: new THREE.Vector3(),
        radius: Math.max(widths[i], 1) * 0.4,
        phase: i * 1.3,
        wakeAt: this.reduced ? 0 : 0.25 + i * 0.09,
        scale: s,
        targetScale: s,
      };
      obj.userData.body = body;
      obj.quaternion.copy(body.quat);
      obj.visible = this.reduced;
      this.scene.add(obj);
      this.bodies.push(body);
    });

    this.arrange();
    for (const b of this.bodies) {
      b.pos.copy(b.rest);
      if (!this.reduced) b.pos.add(new THREE.Vector3(0, -4, 1));
      b.obj.position.copy(b.pos);
    }
  }

  // Une ligne « PEDRO » en paysage, deux lignes « PED / RO » en portrait.
  private arrange() {
    if (!this.bodies.length) return;
    const n = this.bodies.length;
    const portrait = this.camera.aspect < 0.8 && n === 5;
    const rows = portrait ? [[0, 1, 2], [3, 4]] : [[...Array(n).keys()]];
    const rowY = portrait ? [0.78, -0.52] : [0.15];
    let maxW = 0;
    rows.forEach((row, r) => {
      const w = row.reduce((a, i) => a + this.bodies[i].width, 0) + GAP * (row.length - 1);
      maxW = Math.max(maxW, w);
      let x = -w / 2;
      row.forEach((i) => {
        const b = this.bodies[i];
        b.rest.set(x + b.width / 2, rowY[r], 0);
        x += b.width + GAP;
      });
    });
    this.wordWidth = maxW;
    this.wordHeight = rows.length * 1.3;
    this.floor.position.y = rowY[rowY.length - 1] - 1.25;
  }

  private bindEvents() {
    const c = this.canvas;
    c.addEventListener('pointerdown', this.onDown);
    addEventListener('pointermove', this.onMove, { passive: true });
    addEventListener('pointerup', this.onUp);
    addEventListener('pointercancel', this.onUp);
    // Sur mobile : on bloque le scroll seulement si le doigt touche une lettre.
    c.addEventListener(
      'touchstart',
      (e) => {
        const t = e.touches[0];
        this.setPointer(t.clientX, t.clientY);
        if (this.pick()) e.preventDefault();
      },
      { passive: false },
    );
    addEventListener('resize', () => this.resize());
    new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      if (this.visible) this.start();
    }).observe(c);
  }

  private setPointer(x: number, y: number) {
    const r = this.canvas.getBoundingClientRect();
    this.pointer.set(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
  }

  private pick(): Body | null {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.intersectObjects(this.bodies.map((b) => b.obj), true)[0];
    if (!hit) return null;
    let o: THREE.Object3D | null = hit.object;
    while (o && !o.userData.body) o = o.parent;
    return o ? (o.userData.body as Body) : null;
  }

  private onDown = (e: PointerEvent) => {
    this.setPointer(e.clientX, e.clientY);
    const body = this.pick();
    if (!body) return;
    this.dragged = body;
    this.canvas.setPointerCapture(e.pointerId);
    this.canvas.style.cursor = 'grabbing';
    this.downAt = { x: e.clientX, y: e.clientY, t: performance.now() };
    // Plan de glissement face caméra, passant par la lettre.
    const normal = this.camera.getWorldDirection(new THREE.Vector3()).negate();
    this.dragPlane.setFromNormalAndCoplanarPoint(normal, body.pos);
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.ray.intersectPlane(this.dragPlane, new THREE.Vector3());
    this.grabOffset.copy(hit ?? body.pos).sub(body.pos);
    this.dragTarget.copy(hit ?? body.pos);
    this.onFirstGrab?.();
    this.onFirstGrab = undefined;
  };

  private onMove = (e: PointerEvent) => {
    this.setPointer(e.clientX, e.clientY);
    if (this.dragged) {
      this.raycaster.setFromCamera(this.pointer, this.camera);
      this.raycaster.ray.intersectPlane(this.dragPlane, this.dragTarget);
    }
  };

  private onUp = (e: PointerEvent) => {
    const body = this.dragged;
    if (!body) return;
    this.dragged = null;
    this.canvas.style.cursor = '';
    const moved = Math.hypot(e.clientX - this.downAt.x, e.clientY - this.downAt.y);
    // Un simple clic : la lettre est « boopée » vers l'arrière et tourne sur elle-même.
    if (moved < 6 && performance.now() - this.downAt.t < 300) {
      body.vel.add(new THREE.Vector3(0, 1.2, -4));
      body.angVel.add(new THREE.Vector3(-3, (Math.random() - 0.5) * 14, 0));
    }
  };

  private resize() {
    const { clientWidth: w, clientHeight: h } = this.canvas;
    // Le cadrage se fait sur le hero seul ; le canvas, plus haut, prolonge juste la vue vers le bas.
    const frameH = Math.min(h, this.canvas.parentElement?.clientHeight || h);
    if (!w || !h || !frameH) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / frameH;
    this.arrange();
    // Recule la caméra pour que le mot occupe 70 % de la largeur en paysage, 80 % en portrait.
    const vFov = THREE.MathUtils.degToRad(this.camera.fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * this.camera.aspect);
    const fill = this.camera.aspect > 1 ? 0.7 : 0.8;
    const distW = this.wordWidth / fill / 2 / Math.tan(hFov / 2);
    const distH = (this.wordHeight + 0.6) / 2 / Math.tan(vFov / 2);
    const dist = Math.max(distW, distH);
    this.camera.position.set(0, 0.9, dist);
    this.camera.lookAt(0, 0.05, 0);
    // Le cadrage du hero ne bouge pas, et la scène continue dans la partie qui déborde.
    this.camera.setViewOffset(w, frameH, 0, 0, w, h);
    this.camera.updateProjectionMatrix();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.clock.getDelta();
    const loop = () => {
      if (!this.visible) {
        this.running = false;
        return;
      }
      this.step(Math.min(this.clock.getDelta(), 1 / 30));
      this.renderer.render(this.scene, this.camera);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  // Lance toutes les lettres dans une direction aléatoire.
  scatter() {
    this.bodies.forEach((b) => {
      b.vel.add(new THREE.Vector3((Math.random() - 0.5) * 14, Math.random() * 8 + 2, (Math.random() - 0.5) * 6));
      b.angVel.add(new THREE.Vector3((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 16, (Math.random() - 0.5) * 16));
    });
  }

  private tmp = new THREE.Vector3();
  private tmp2 = new THREE.Vector3();
  private dq = new THREE.Quaternion();

  private step(dt: number) {
    this.time += dt;
    const t = this.time;

    // Survol : la lettre « respire » sous le curseur.
    if (!this.dragged && matchMedia('(hover: hover)').matches) {
      const h = this.pick();
      if (h !== this.hovered) {
        this.hovered = h;
        this.canvas.style.cursor = h ? 'grab' : '';
      }
    }

    // Souffle : un mouvement rapide du pointeur pousse les lettres proches.
    const pDelta = this.pointer.clone().sub(this.pointerPrev);
    this.pointerPrev.copy(this.pointer);
    const pSpeed = pDelta.length();

    for (const b of this.bodies) {
      if (t < b.wakeAt) continue;
      b.obj.visible = true;

      const isDragged = b === this.dragged;
      const bob = this.reduced ? 0 : Math.sin(t * 1.1 + b.phase) * 0.05;
      const acc = this.tmp.set(0, 0, 0);

      if (isDragged) {
        const target = this.tmp2.copy(this.dragTarget).sub(this.grabOffset);
        acc.addScaledVector(target.sub(b.pos), DRAG_K).addScaledVector(b.vel, -DRAG_C);
        // Le point saisi tire la lettre : elle se balance comme un ballon tenu par un fil.
        const pull = this.tmp2.copy(this.dragTarget).sub(b.pos).sub(this.grabOffset);
        b.angVel.add(new THREE.Vector3().crossVectors(this.grabOffset, pull).multiplyScalar(dt * 40));
      } else {
        const target = this.tmp2.copy(b.rest);
        target.y += bob;
        acc.addScaledVector(target.sub(b.pos), REST_K).addScaledVector(b.vel, -REST_C);

        if (pSpeed > 0.01 && !this.reduced) {
          const screen = b.pos.clone().project(this.camera);
          const d = Math.hypot(screen.x - this.pointer.x, screen.y - this.pointer.y);
          if (d < 0.25) {
            const push = (0.25 - d) * pSpeed * 260;
            b.vel.x += pDelta.x * push;
            b.vel.y += pDelta.y * push;
            b.angVel.z -= pDelta.x * push * 2;
          }
        }
      }

      b.vel.addScaledVector(acc, dt);
      b.pos.addScaledVector(b.vel, dt);

      // Rotation : rappel vers l'orientation d'origine + inclinaison selon la vitesse.
      const q = b.quat;
      const sign = q.w < 0 ? -1 : 1;
      const err = this.tmp.set(q.x * sign, q.y * sign, q.z * sign).multiplyScalar(2);
      const tilt = new THREE.Vector3(b.vel.y * 0.04, 0, -b.vel.x * 0.06);
      b.angVel.addScaledVector(err.sub(tilt), -ROT_K * dt).multiplyScalar(1 - ROT_C * dt);
      const angle = b.angVel.length() * dt;
      if (angle > 1e-6) {
        this.dq.setFromAxisAngle(this.tmp.copy(b.angVel).normalize(), angle);
        q.premultiply(this.dq).normalize();
      }

      // Squash léger au survol et pendant la saisie.
      const base = b.targetScale;
      const goal = base * (isDragged ? 1.1 : b === this.hovered ? 1.05 : 1);
      b.scale += (goal - b.scale) * Math.min(1, dt * 10);

      b.obj.position.copy(b.pos);
      b.obj.quaternion.copy(q);
      b.obj.scale.setScalar(b.scale);
    }

    this.collide();
  }

  // Collisions approximées par des sphères : les ballons se repoussent et rebondissent.
  private collide() {
    const n = this.bodies.length;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const a = this.bodies[i];
        const b = this.bodies[j];
        const d = this.tmp.copy(b.pos).sub(a.pos);
        const dist = d.length();
        const min = a.radius + b.radius;
        if (dist >= min || dist < 1e-5) continue;
        d.divideScalar(dist);
        const overlap = min - dist;
        const aFixed = a === this.dragged;
        const bFixed = b === this.dragged;
        const wa = aFixed ? 0 : bFixed ? 1 : 0.5;
        const wb = bFixed ? 0 : aFixed ? 1 : 0.5;
        a.pos.addScaledVector(d, -overlap * wa);
        b.pos.addScaledVector(d, overlap * wb);
        const rel = this.tmp2.copy(b.vel).sub(a.vel).dot(d);
        if (rel < 0) {
          const impulse = -rel * 1.4;
          a.vel.addScaledVector(d, -impulse * wa);
          b.vel.addScaledVector(d, impulse * wb);
          a.angVel.z += impulse * wa * 1.5;
          b.angVel.z -= impulse * wb * 1.5;
        }
      }
    }
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    this.renderer.dispose();
  }
}
