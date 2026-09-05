import test from 'node:test';
import assert from 'node:assert/strict';
import { createSimulation, phaseAt, voltageAt, anchors, nextAnchor, previousAnchor, readSettings } from '../lib/simulation.ts';

test('all supported rates keep conducted events ordered and within their cycles',()=>{
 for(const scenario of ['normal','delay','wenckebach']) for(let rate=50;rate<=90;rate++){
  const s=createSimulation(scenario,rate);
  for(const b of s.beats){assert.equal(phaseAt(s,b.start-15),'sinus');assert.equal(phaseAt(s,b.start+45),'atrial');assert.equal(phaseAt(s,b.start+115),'av');if(b.conducted){assert.ok(b.qrs>b.start+100);assert.ok(b.tStart>b.qrs+90);assert.ok(b.tEnd < b.start+s.cycle-20);assert.equal(phaseAt(s,b.qrs+38),'ventricular');assert.equal(phaseAt(s,b.tStart+80),'repolarisation');assert.ok(voltageAt(s,b.qrs+37)>1);}}
 }
});
test('AV delay changes QRS timing without moving atrial activity',()=>{const a=createSimulation('normal'),b=createSimulation('delay');a.beats.forEach((beat,i)=>{assert.equal(beat.start,b.beats[i].start);assert.equal(b.beats[i].qrs-beat.qrs,100);assert.equal(voltageAt(a,beat.start+50),voltageAt(b,beat.start+50));});});
test('Wenckebach has progressive PR and no ventricular event or waveform for dropped impulse',()=>{const s=createSimulation('wenckebach');assert.deepEqual(s.beats.slice(0,3).map(b=>b.pr),[160,220,260]);const b=s.beats[3];assert.equal(b.qrs,null);assert.equal(b.tStart,null);assert.equal(b.tEnd,null);assert.equal(phaseAt(s,b.start+300),'blocked');for(let t=b.start+100;t<s.duration;t+=1)assert.equal(voltageAt(s,t),0);assert.ok(voltageAt(s,b.start+50)>0);assert.equal(createSimulation('wenckebach').beats[0].pr,160);});
test('scrubbing produces deterministic events and next/previous navigation is reversible',()=>{const s=createSimulation();const a=anchors(s);for(let i=1;i<a.length-1;i++){assert.equal(nextAnchor(s,a[i]),a[i+1]);assert.equal(previousAnchor(s,a[i]),a[i-1]);const first=phaseAt(s,a[i]);phaseAt(s,a[i+1]);assert.equal(phaseAt(s,a[i]),first);}});
test('bad URL parameters cannot escape supported scenarios and rates',()=>{assert.deepEqual(readSettings('?lesson=unknown&rate=NaN'),{scenario:'normal',rate:72});assert.equal(readSettings('?rate=1000').rate,90);assert.equal(readSettings('?rate=-500').rate,50);assert.deepEqual(readSettings(''),{scenario:'normal',rate:72});assert.deepEqual(readSettings('?lesson=wenckebach&rate=60'),{scenario:'wenckebach',rate:60});});
