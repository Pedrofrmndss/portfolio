import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

// Lettres de secours dessinées à la main (hauteur 1), utilisées tant que
// public/models/pedro.glb n'existe pas. Chaque lettre = un contour + des trous.

type Pt = [number, number];

const arc = (cx: number, cy: number, rx: number, ry: number, a0: number, a1: number, n = 20): Pt[] => {
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const a = THREE.MathUtils.degToRad(a0 + ((a1 - a0) * i) / n);
    pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
  }
  return pts;
};

const ellipse = (cx: number, cy: number, rx: number, ry: number): Pt[] => arc(cx, cy, rx, ry, 0, 360, 48).slice(0, -1);

// Trace un polygone dont chaque angle est arrondi (rayon borné par la longueur des côtés).
function roundedPath<T extends THREE.Path>(path: T, pts: Pt[], radius: number): T {
  const v = pts.map(([x, y]) => new THREE.Vector2(x, y));
  v.forEach((p1, i) => {
    const p0 = v[(i - 1 + v.length) % v.length];
    const p2 = v[(i + 1) % v.length];
    const d0 = p0.clone().sub(p1);
    const d2 = p2.clone().sub(p1);
    const r = Math.min(radius, d0.length() / 2, d2.length() / 2);
    const a = p1.clone().add(d0.normalize().multiplyScalar(r));
    const b = p1.clone().add(d2.normalize().multiplyScalar(r));
    if (i === 0) path.moveTo(a.x, a.y);
    else path.lineTo(a.x, a.y);
    path.quadraticCurveTo(p1.x, p1.y, b.x, b.y);
  });
  path.closePath();
  return path;
}

const S = 0.24; // épaisseur du fût

const glyphs: Record<string, { outer: Pt[]; holes: Pt[][] }> = {
  P: {
    outer: [[0, 0], [0, 1], ...arc(0.4, 0.69, 0.31, 0.31, 90, -90), [S, 0.38], [S, 0]],
    holes: [[[S, 0.58], ...arc(0.4, 0.69, 0.11, 0.11, -90, 90), [S, 0.8]]],
  },
  E: {
    outer: [
      [0, 0], [0.6, 0], [0.6, 0.22], [S, 0.22], [S, 0.4], [0.54, 0.4],
      [0.54, 0.6], [S, 0.6], [S, 0.78], [0.6, 0.78], [0.6, 1], [0, 1],
    ],
    holes: [],
  },
  D: {
    outer: [[0, 0], ...arc(0.32, 0.5, 0.46, 0.5, -90, 90), [0, 1]],
    holes: [[[S, 0.22], ...arc(0.32, 0.5, 0.24, 0.28, -90, 90), [S, 0.78]]],
  },
  R: {
    outer: [
      [0, 0], [0, 1], ...arc(0.38, 0.7, 0.3, 0.3, 90, -90),
      [0.68, 0], [0.42, 0], [S, 0.24], [S, 0],
    ],
    holes: [[[S, 0.6], ...arc(0.38, 0.7, 0.1, 0.1, -90, 90), [S, 0.8]]],
  },
  O: {
    outer: ellipse(0.44, 0.5, 0.44, 0.5),
    holes: [ellipse(0.44, 0.5, 0.2, 0.26)],
  },
};

export function letterGeometry(char: string): THREE.BufferGeometry {
  const g = glyphs[char];
  const shape = roundedPath(new THREE.Shape(), g.outer, 0.07);
  shape.holes = g.holes.map((h) => roundedPath(new THREE.Path(), h, 0.04));

  let geo: THREE.BufferGeometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.12,
    bevelEnabled: true,
    bevelThickness: 0.15,
    bevelSize: 0.07,
    bevelSegments: 10,
    curveSegments: 6,
  });
  // Normales lissées entre la face et le biseau : c'est ce qui donne l'effet « gonflé ».
  geo.deleteAttribute('normal');
  geo.deleteAttribute('uv');
  geo = mergeVertices(geo, 1e-4);
  geo.computeVertexNormals();
  geo.center();
  return geo;
}
