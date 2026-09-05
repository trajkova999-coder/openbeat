import test from 'node:test';
import assert from 'node:assert/strict';
import {timeFromFraction,measurementDelta} from '../lib/interaction.ts';

test('pointer drag maps to time within the visible window',()=>{
 assert.equal(timeFromFraction(.5,0,4000,4000),2000);
 assert.equal(timeFromFraction(.5,1000,1000,4000),1500);
 assert.equal(timeFromFraction(-1,1000,1000,4000),1000);
 assert.equal(timeFromFraction(2,1000,1000,4000),1999);
 assert.equal(timeFromFraction(1,3000,1000,4000),3999);
 assert.equal(timeFromFraction(NaN,1000,1000,4000),1000);
});
test('calipers measure absolute millisecond difference in either order',()=>{
 assert.equal(measurementDelta([]),null);
 assert.equal(measurementDelta([80]),null);
 assert.equal(measurementDelta([80,240]),160);
 assert.equal(measurementDelta([240,80]),160);
 assert.equal(measurementDelta([240,240]),0);
});
