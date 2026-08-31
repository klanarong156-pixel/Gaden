export const RELAYS = ['pump','zone1','lighthome','lightsala'];
export const LABELS = {pump:'ปั๊มน้ำ',zone1:'โซน 1',lighthome:'ไฟบ้าน',lightsala:'ไฟศาลา'};
export const icons = {pump:'🚿',zone1:'🌱',lighthome:'💡',lightsala:'🏡'};
export const state = { connected:false, device:null, sensor:null, relays:Object.fromEntries(RELAYS.map(r=>[r,null])), timers:Object.fromEntries(RELAYS.map(r=>[r,null])), schedules:Object.fromEntries(RELAYS.map(r=>[r,null])), emergency:null, telegram:null, reminder:null, aiAlerts:[], ota:false, pending:new Set() };
const listeners = new Set();
export function subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn)}
export function update(patch){Object.assign(state,patch);listeners.forEach(fn=>fn(state))}
export function relayControlLocked(){return !state.connected || state.ota || Boolean(state.emergency?.active)}
export function setRelay(relay,value){state.relays[relay]=value;listeners.forEach(fn=>fn(state))}
export function applyTopic(topic,payload){let data;try{data=JSON.parse(payload)}catch{data=payload}
  if(topic==='smartfarm/status/online') update({connected:data===true||data==='true'});
  else if(topic==='smartfarm/device/status') update({device:data,connected:data?.online===true});
  else if(topic==='smartfarm/sensor/dht11') update({sensor:data});
  else {const m=topic.match(/^smartfarm\/relay\/([^/]+)\/(status|timer\/status)$/); if(m&&RELAYS.includes(m[1])) m[2]==='status'?setRelay(m[1],data):update({timers:{...state.timers,[m[1]]:data}});
    const s=topic.match(/^smartfarm\/schedule\/([^/]+)\/status$/); if(s&&RELAYS.includes(s[1])) update({schedules:{...state.schedules,[s[1]]:data}});
    else if(topic==='smartfarm/emergency/status') update({emergency:data}); else if(topic==='smartfarm/config/telegram/status') update({telegram:data}); else if(topic==='smartfarm/reminder/status') update({reminder:data}); else if(topic==='smartfarm/ai/alert/status') update({aiAlerts:[...state.aiAlerts.slice(-9),data]}); }
}
