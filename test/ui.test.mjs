import {describe,expect,it} from 'vitest';
import {readFileSync} from 'node:fs';
const html=readFileSync(new URL('../dashboard/index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../dashboard/js/app.js',import.meta.url),'utf8');
const state=readFileSync(new URL('../dashboard/js/state.js',import.meta.url),'utf8');
describe('PWA UI safety contract',()=>{it('has Thai document and all required routes',()=>{expect(html).toContain('lang="th"');for(const route of ['dashboard','devices','schedule','account','settings'])expect(html).toContain(`data-route="${route}"`)});it('uses firmware topics and no demo numeric sensor values',()=>{expect(app).toContain('smartfarm/relay/');expect(app).toContain('smartfarm/emergency/set');expect(app).toContain('รอข้อมูลจาก ESP8266');expect(app).not.toContain('24.6');expect(app).not.toContain('82%')});it('locks relay controls on offline, emergency or viewer role and documents OTA limitation',()=>{expect(state).toContain('!state.connected');expect(state).not.toContain('state.ota===true');expect(state).toContain('state.emergency?.active');expect(state).toContain("state.auth.role==='viewer'")})});
