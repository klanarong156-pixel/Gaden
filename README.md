# สวนลุงนะ Smart Farm

PWA ภาษาไทยสำหรับควบคุมและติดตาม Smart Farm ผ่าน ESP8266 โดยยึด `SmartFarm_V6_PRODUCTION.ino` เป็นแหล่งอ้างอิงของ MQTT contract เพียงแหล่งเดียว ระบบไม่สร้างข้อมูล sensor หรือสถานะ relay ปลอม หากยังไม่มีข้อมูลจากอุปกรณ์จะแสดง `รอข้อมูลจาก ESP8266` หรือ `Offline` แทน

## โครงสร้าง

`dashboard/` เป็น PWA mobile-first ที่มีหน้า Dashboard, Devices, Schedule, Settings และ Account ผ่าน Bottom Navigation พร้อม iPhone Safe Area ส่วน `server/index.mjs` เป็น MQTT bridge ฝั่ง server ซึ่งเก็บ retained state ในหน่วยความจำและเปิด endpoint สำหรับอ่านสถานะและส่งคำสั่งโดยไม่เปิดเผย credential ให้ browser

## วิธีรัน

ติดตั้ง Node.js 20 ขึ้นไป จากนั้นคัดลอก `.env.example` เป็น `.env` และใส่ค่า MQTT จริงของ Broker แล้วรัน `npm install` และ `npm start` เว็บ dashboard ต้องถูกเสิร์ฟผ่าน web server ที่ map `/dashboard/` และ `/api/` ไปยัง bridge เดียวกัน ทั้งนี้เมื่อไม่มี `MQTT_URL` ระบบจะทำงานเป็น Offline โดยตั้งใจและจะไม่แสดงค่าจำลอง

## ความปลอดภัย

ห้าม commit MQTT username/password, Telegram token/chat ID, OTA password หรือ API key ค่า secret ใช้ environment variables เท่านั้น และ `smartfarm/config/telegram/set` ไม่ควรถูกเปิดให้ client ที่ไม่มีสิทธิ์ผู้ดูแลเรียกใช้ ในการใช้งานจริงควรใส่ authentication/RBAC ที่ reverse proxy หรือ backend identity layer ก่อนเปิด public access

## Safety behavior

Relay command จะถูกส่งเฉพาะเมื่อ bridge เชื่อมต่อ MQTT และไม่มี Emergency หรือ OTA lock การคลิกปุ่มไม่ทำให้ UI เปลี่ยนเป็นสำเร็จทันที แต่รอสถานะจาก `smartfarm/relay/{relay}/status` ที่ Firmware publish กลับมา เมื่อ MQTT offline, Emergency Stop หรือ OTA ทำงาน ปุ่ม relay จะถูก disable

## Firmware build

GitHub Actions ใน `.github/workflows/build-firmware.yml` ติดตั้ง ESP8266 core และ dependencies แล้ว compile `SmartFarm_V6_PRODUCTION.ino` เป็น `SmartFarm.bin` พร้อม artifact ชื่อ `SmartFarm-firmware` เมื่อ push หรือเปิด pull request

## Contract

Relay mapping คือ `pump`, `zone1`, `lighthome`, `lightsala` และ schedule รองรับไม่เกิน 4 slots ต่อ relay รายละเอียด Topics, payload และข้อจำกัดที่ตรวจจาก Firmware อยู่ใน [`firmware-contract.md`](./firmware-contract.md)

## ข้อจำกัดจาก Firmware ที่ตรวจพบ

Firmware ประกาศ `SOIL_PIN A0` แต่ยังไม่พบการอ่านหรือ publish Soil Moisture ผ่าน MQTT ดังนั้น PWA จึงไม่แสดง Soil Moisture จนกว่าจะมี topic และ payload ใน Firmware อย่างชัดเจน
