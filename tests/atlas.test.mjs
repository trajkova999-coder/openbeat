import test from 'node:test';
import assert from 'node:assert/strict';
import { atlasCases, atlasEvents, atlasVoltage, filterCases } from '../lib/atlas.ts';

test('atlas content has valid links, answers and timed annotations', () => {
  const ids = new Set(atlasCases.map(c => c.id));
  assert.equal(ids.size, 8);
  for (const c of atlasCases) {
    assert.ok(c.options[c.answer]);
    assert.ok(c.related.every(id => ids.has(id) && id !== c.id));
    assert.ok(c.findings.every(f => f.from >= 0 && f.from < f.to && f.to <= 6000));
    for (let t = 0; t <= 6000; t += 5) assert.ok(Number.isFinite(atlasVoltage(c.id, t)));
  }
  assert.equal(atlasCases.filter(c => c.lab).length, 3);
});
test('search and chapter filters combine', () => {
  assert.equal(filterCases('  fibrillation  ', 'All cases')[0].id, 'af');
  assert.equal(filterCases('', 'AV conduction').length, 3);
  assert.equal(filterCases('fibrillation', 'AV conduction').length, 0);
});
test('AV plates distinguish progressive from constant conducted PR intervals', () => {
  assert.deepEqual(atlasEvents('wenckebach').slice(0, 4).map(b => b.pr), [160,220,260,null]);
  assert.deepEqual(atlasEvents('mobitz-ii').slice(0, 3).map(b => b.pr), [160,160,null]);
  assert.ok(atlasEvents('first-degree').every(b => Math.abs(b.qrs - b.p - 260) < .001));
});
test('AF is irregular without discrete P waves; PVC is premature and broad with a pause', () => {
  const af = atlasEvents('af');
  assert.ok(af.every(b => b.p === null));
  assert.ok(new Set(af.slice(1).map((b, i) => b.qrs - af[i].qrs)).size > 3);
  const pvc = atlasEvents('pvc');
  const i = pvc.findIndex(b => b.ectopic);
  assert.equal(pvc[i].width, 160);
  assert.equal(pvc[i].p, null);
  assert.ok(pvc[i].qrs - pvc[i-1].qrs < 60000/72);
  assert.ok(Math.abs(pvc[i+1].qrs - pvc[i-1].qrs - 2*60000/72) < .001);
});
test('slow and fast sinus plates retain distinct rates', () => {
  for (const [pattern, rate] of [['brady',48],['tachy',110]]) {
    const beats = atlasEvents(pattern);
    assert.ok(Math.abs(beats[1].p - beats[0].p - 60000/rate) < .001);
  }
});
