import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { solve, isClose, solvers } from "../src/solvers.js";
import { courseRecap } from "../src/recaps.js";
import { drawFigure } from "../src/diagrams.js";

const exercise = solver => ({ solver });

const ttc = solvers.tvaTtc({ ht: 58, tva: 17 }).values;
assert.ok(isClose(ttc.ttc, 67.86, 1e-10));

const ht = solvers.tvaHt({ ttc: 35.1, tva: 17 }).values;
assert.ok(isClose(ht.ht, 30, 1e-10));

const pct = solvers.successivePercent({ p1: 10, p2: 20 }).values;
assert.ok(isClose(pct.global, 32, 1e-12));

const heron = solvers.heronArea({ a: 18, b: 24, c: 30 }).values;
assert.equal(heron.p, 36);
assert.ok(isClose(heron.area, 216, 1e-10));

const abs = solvers.absEquation({ a: 2, b: 3 }).values;
assert.equal(abs.x1, -5);
assert.equal(abs.x2, 1);

const enc = solvers.affineBounds({ amin: -2, amax: 3, m: -3, p: 5 }).values;
assert.equal(enc.ymin, -4);
assert.equal(enc.ymax, 11);

const light = solvers.lightTime({ distMkm: 150, v: 300000 }).values;
assert.equal(light.t, 500);
assert.ok(isClose(light.minutes, 500 / 60, 1e-12));

const sci = solvers.scientificOrder({ N: 35215000 }).values;
assert.ok(isClose(sci.a, 3.5215, 1e-10));
assert.equal(sci.nExp, 7);
assert.equal(sci.order, 40000000);

const quad = solvers.quadraticSolve({ a: 4, b: 3, c: -1 }).values;
assert.equal(quad.disc, 25);
assert.equal(quad.x1, -1);
assert.equal(quad.x2, 0.25);
assert.ok(isClose(quad.sum, -0.75, 1e-12));
assert.ok(isClose(quad.prod, -0.25, 1e-12));

const res = solvers.resistors({ R: 2.5, r: 0.4 }).values;
assert.ok(isClose(res.R1, 2, 1e-12));
assert.ok(isClose(res.R2, 0.5, 1e-12));

const cyc = solvers.cyclists({ D: 132, T: 3, hMin: 33 }).values;
assert.equal(cyc.closing, 44);
assert.ok(isClose(cyc.VA, 20, 1e-10));
assert.ok(isClose(cyc.VB, 24, 1e-10));

const sq = solvers.squareDecrease({ cut: 3, dA: 12 }).values;
assert.ok(isClose(sq.x, 3.5, 1e-12));

const phi = solvers.goldenRatio({ shift: 1 }).values;
assert.ok(isClose(phi.phi, (1 + Math.sqrt(5)) / 2, 1e-12));
assert.ok(isClose(phi.phi2, phi.phi + 1, 1e-12));

assert.equal(solvers.polyEval({ a3: 1, a2: 6, a1: 12, a0: -56, x: 2 }).values.value, 0);

const cub = solvers.polyIntegerRoot({ a: 6, b: 12, c: -56 }).values;
assert.equal(cub.root, 2);
assert.equal(cub.qB, 8);
assert.equal(cub.qC, 28);

const known = solvers.polyKnownRoot({ a: -4, b: -2, c: 8, r: 4 }).values;
assert.equal(known.PofR, 0);
assert.equal(known.qB, 0);
assert.equal(known.qC, -2);

const sums = solvers.sumIntegers({ n: 10 }).values;
assert.equal(sums.s1, 55);
assert.equal(sums.s2, 385);

const eu = solvers.euclidDiv({ a: 2613, b: 8 }).values;
assert.equal(eu.q, 326);
assert.equal(eu.r, 5);

const mod8 = solvers.remainderLast3({ n: 127645264, div: 8 }).values;
assert.equal(mod8.last, 264);
assert.equal(mod8.r, 0);

const mod9 = solvers.remainderDigits({ n: 1963, div: 9 }).values;
assert.equal(mod9.sum, 19);
assert.equal(mod9.r, 1);

const ean = solvers.barcodeCheck({ prefix: 619220260141 }).values;
assert.equal(ean.odd, 23);
assert.equal(ean.even, 11);
assert.equal(ean.check, 4);

const box = solvers.gcd3({ a: 120, b: 200, c: 180 }).values;
assert.equal(box.g, 20);
assert.equal(box.nBoxes, 540);

const ab = solvers.vectorAB({ xA: -2, yA: 0.75, xB: 0, yB: -1 }).values;
assert.equal(ab.x, 2);
assert.equal(ab.y, -1.75);

assert.equal(solvers.detColinear({ x: 2, y: 3, xp: 4, yp: 6 }).values.det, 0);
assert.equal(solvers.dotOrtho({ x: 3, y: 4, xp: 4, yp: -3 }).values.dot, 0);

const para = solvers.parallelogramD({ xA: -2, yA: 0.75, xB: 0, yB: -1, xC: 3, yC: 4 }).values;
assert.equal(para.xD, 1);
assert.equal(para.yD, 5.75);

const g1 = solvers.bary1d({ xA: 0, xB: 10, alpha: 3, beta: -4 }).values;
assert.equal(g1.g, 40);
assert.equal(g1.k, 4);

const g2 = solvers.bary2d({ xA: 0, yA: 0, xB: 6, yB: 0, xC: 0, yC: 6, alpha: 1, beta: 1, gamma: 1 }).values;
assert.equal(g2.xG, 2);
assert.equal(g2.yG, 2);

const tr = solvers.translation({ x: 1, y: 2, vx: 3, vy: -1 }).values;
assert.equal(tr.xM, 4);
assert.equal(tr.yM, 1);

const hom = solvers.homothety({ xO: 0, yO: 0, k: 3, x: 2, y: 1 }).values;
assert.equal(hom.xM, 6);
assert.equal(hom.yM, 3);

const scale = solvers.homothetyScale({ k: 0.5, p: 12, a: 6 }).values;
assert.equal(scale.perim, 6);
assert.equal(scale.area, 1.5);

const q90 = solvers.rotation90({ xO: 0, yO: 0, x: 1, y: 0 }).values;
assert.equal(q90.xM, 0);
assert.equal(q90.yM, 1);

const rot = solve(exercise("rotationAngle"), { xO: 0, yO: 0, x: 2, y: 0, angle: 90 }).values;
assert.ok(isClose(rot.xM, 0, 1e-10));
assert.ok(isClose(rot.yM, 2, 1e-10));
assert.equal(rot.om, 2);

const catalog = JSON.parse(readFileSync(new URL("../data/exercises.json", import.meta.url)));
const batch14 = JSON.parse(readFileSync(new URL("../data/exercises-ch1-ch4.json", import.meta.url)));
const batch59 = JSON.parse(readFileSync(new URL("../data/exercises-ch5-ch9.json", import.meta.url)));
const all = [...catalog.exercises, ...batch14, ...batch59];
const ids = new Set();
for (const item of all) {
  assert.ok(solvers[item.solver], `solveur manquant : ${item.solver} (${item.id})`);
  assert.notEqual(courseRecap(item.solver).title, "Rappel de cours", `rappel fallback : ${item.id}`);
  const figure = drawFigure(item.solver, Object.fromEntries(item.variables.map(v => [v.key, v.value])));
  assert.ok(figure.svg.includes("<svg") && !figure.svg.includes("non disponible"), `schéma manquant : ${item.id}`);
  assert.ok(!ids.has(item.id), `id dupliqué : ${item.id}`);
  ids.add(item.id);
  const result = solve(item, Object.fromEntries(item.variables.map(v => [v.key, v.value])));
  for (const q of item.questions) {
    assert.ok(Number.isFinite(result.values[q.key]), `réponse non finie : ${item.id}.${q.key}`);
  }
}
assert.equal(catalog.chapters.length, 9);
