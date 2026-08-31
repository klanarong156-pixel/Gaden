import {cp,mkdir,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});await mkdir('dist',{recursive:true});await cp('dashboard','dist/dashboard',{recursive:true});await cp('manifest.json','dist/manifest.json');await cp('service-worker.js','dist/service-worker.js');console.log('Built dashboard PWA to dist/');
