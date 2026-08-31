export const RELAYS=['pump','zone1','lighthome','lightsala'];
export const LABELS={pump:'ปั๊มน้ำ',zone1:'โซน 1',lighthome:'ไฟบ้าน',lightsala:'ไฟศาลา'};
export const icons={pump:'🚿',zone1:'🌱',lighthome:'💡',lightsala:'🏡'};
export const state={connected:false,device:null,sensor:null,relays:Object.fromEntries(RELAYS.map(r=>[r,null])),timers:Object.fromEntries(RELAYS.map(r=>[r,null])),schedules:Object.fromEntries(RELAYS.map(r=>[r,null])),emergency:null,telegram:null,reminder:null,aiAlerts:[],pending:{},lastCommand:null,auth:{role:'viewer',authenticated:false}};
const listeners=new Set();
export function subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn)}
export function notify(){listeners.forEach(fn=>fn(state))}
export function update(patch){Object.assign(state,patch);notify()}
export function markPending(relay,desired){state.pending={...state.pending,[relay]:desired};state.lastCommand={relay,desired,status:'waiting'};notify()}
export function applyTopic(topic,payload){let data;try{data=JSON.parse(payload)}catch{data=payload}
 if(topic==='smartfarm/status/online') update({connected:data===true||data==='true'});
 else if(topic==='smartfarm/device/status'){update({device:data,connected:data?.online===true});}
 else if(topic==='smartfarm/sensor/dht11') update({sensor:data});
 else {const m=topic.match(/^smartfarm\/relay\/([^/]+)\/status$/);if(m&&RELAYS.includes(m[1])){const relay=m[1],desired=state.pending[relay];const nextPending={...state.pending};let command=state.lastCommand;if(desired!==undefined){delete nextPending[relay];command={relay,desired,status:data===desired?'confirmed':'rejected',received:data};}update({relays:{...state.relays,[relay]:data},pending:nextPending,lastCommand:command});}
 const t=topic.match(/^smartfarm\/relay\/([^/]+)\/timer\/status$/);if(t&&RELAYS.includes(t[1])) update({timers:{...state.timers,[t[1]]:data}});
 const s=topic.match(/^smartfarm\/schedule\/([^/]+)\/status$/);if(s&&RELAYS.includes(s[1])) update({schedules:{...state.schedules,[s[1]]:data}});
 if(topic==='smartfarm/emergency/status') update({emergency:data});
 else if(topic==='smartfarm/config/telegram/status') update({telegram:data});
 else if(topic==='smartfarm/reminder/status') update({reminder:data});
 else if(topic==='smartfarm/ai/alert/status') update({aiAlerts:[...state.aiAlerts.slice(-9),data]});}
}
export function relayControlLocked(){return !state.connected||Boolean(state.emergency?.active)||state.auth.role==='viewer'}
export function commandStatus(relay){return state.pending[relay]?'กำลังรอ ESP8266 ยืนยัน':state.lastCommand?.relay===relay&&state.lastCommand.status==='confirmed'?'ยืนยันแล้ว':state.lastCommand?.relay===relay&&state.lastCommand.status==='rejected'?'อุปกรณ์ปฏิเสธคำสั่ง':''}
