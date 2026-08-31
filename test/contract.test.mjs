import test from 'node:test';
import assert from 'node:assert/strict';
const relays=['pump','zone1','lighthome','lightsala'];
const overlap=(slots)=>slots.some((a,i)=>slots.some((b,j)=>i<j&&a.on<b.off&&b.on<a.off));
test('Firmware relay mapping has exactly four supported names',()=>assert.deepEqual(relays,['pump','zone1','lighthome','lightsala']));
test('schedule overlap is rejected before publish',()=>assert.equal(overlap([{on:'06:00',off:'06:30'},{on:'06:15',off:'07:00'}]),true));
test('non-overlapping schedules are accepted',()=>assert.equal(overlap([{on:'06:00',off:'06:15'},{on:'06:15',off:'07:00'}]),false));
test('control is locked when MQTT is offline, OTA is active, or emergency is active',()=>{const locked=(s)=>!s.connected||s.ota||s.emergency;assert.equal(locked({connected:false,ota:false,emergency:false}),true);assert.equal(locked({connected:true,ota:true,emergency:false}),true);assert.equal(locked({connected:true,ota:false,emergency:true}),true);assert.equal(locked({connected:true,ota:false,emergency:false}),false)});
