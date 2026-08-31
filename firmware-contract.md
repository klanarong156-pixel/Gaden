# SmartFarm Firmware MQTT Contract

แหล่งอ้างอิง: `Gaden/SmartFarm_V6_PRODUCTION.ino` ซึ่งตรวจสอบจากโค้ด Firmware โดยตรง

## Hardware และค่าคงที่ที่ยืนยันได้

| รายการ | ค่าจาก Firmware |
|---|---|
| MCU | ESP8266 |
| Sensor อุณหภูมิ/ความชื้น | DHT11 ที่ `D2` |
| Soil input | `A0` ถูกประกาศเป็น `SOIL_PIN` แต่ไม่พบการอ่านหรือ publish ค่า Soil ใน loop ที่ตรวจสอบ |
| RTC | DS3231 |
| Relay count | 4 |
| Relay mapping | `pump`, `zone1`, `lighthome`, `lightsala` |
| Schedule slots | สูงสุด 4 slots ต่อ relay |
| MQTT base | `smartfarm` |
| MQTT port | `8883` |
| Firmware version | `V7.1.0-FIELD-STABILITY` |

## Topics ที่ Firmware publish จริง

| Topic | Retain | รูปแบบ payload |
|---|---:|---|
| `smartfarm/relay/{relay}/status` | true | `ON` หรือ `OFF` |
| `smartfarm/relay/{relay}/timer/status` | true | JSON: `active`, `unlimited`, `remaining` |
| `smartfarm/schedule/{relay}/status` | true | JSON สถานะ schedule ของ relay |
| `smartfarm/emergency/status` | true | JSON ที่มี `active` และข้อมูล emergency |
| `smartfarm/status/online` | true | `true` เมื่อเชื่อมต่อ และ Last Will `false` เมื่อหลุด |
| `smartfarm/device/status` | true | JSON heartbeat เช่น `online`, `firmware`, `rssi`, `uptimeSec`, `emergencyLock`, `rtc`, `time`, `sensorOk` |
| `smartfarm/sensor/dht11` | false | JSON: `temperature`, `humidity` |
| `smartfarm/config/telegram/status` | true | JSON: `configured` |
| `smartfarm/reminder/status` | true | JSON: `event`, settings และข้อมูล reminder ตาม event |
| `smartfarm/ai/alert/status` | false | JSON: `status`, optional `id`, `at` |

## Topics ที่ Firmware subscribe จริง

| Topic | Payload ที่รับ |
|---|---|
| `smartfarm/relay/+/set` | `ON`, `OFF` |
| `smartfarm/relay/+/timer/set` | จำนวนวินาที, `UNLIMITED`, `CANCEL` |
| `smartfarm/schedule/+/set` | JSON `{ "slots": [...] }` หรือ `DELETE` |
| `smartfarm/emergency/set` | `STOP`, `RESET` และ aliases ที่ Firmware รองรับ |
| `smartfarm/config/telegram/set` | JSON ที่มี `botToken`, `chatId` — ห้ามเปิดเผยค่าใน Dashboard/logs |
| `smartfarm/config/telegram/test` | payload ไม่จำเป็น; สั่งทดสอบ Telegram |
| `smartfarm/reminder/set` | JSON ตาม handler ของ Firmware |
| `smartfarm/ai/alert/set` | JSON ตาม handler ของ Firmware |

## Safety rules ที่ต้องบังคับใน Dashboard

Dashboard จะส่งคำสั่ง relay ได้เฉพาะเมื่อ MQTT bridge เชื่อมต่อและสถานะอุปกรณ์ยืนยันได้เท่านั้น การกดสั่งจะอยู่ในสถานะรอยืนยันจนกว่าจะได้รับ `smartfarm/relay/{relay}/status` กลับมา จึงห้ามเปลี่ยน UI เป็นสำเร็จจากการคลิกเพียงอย่างเดียว

เมื่อ MQTT offline, emergency lock active หรือ OTA กำลังทำงาน ปุ่มควบคุม relay ต้องถูก disable และ UI ต้องแสดงสถานะจริง เช่น `Offline`, `MQTT Disconnected`, `Emergency Stop` หรือ `Updating Firmware` โดยไม่ใช้ค่าจำลอง

## Schedule validation

Firmware ตรวจสอบจำนวน slot ไม่เกิน 4, รูปแบบเวลา `HH:MM`, และเวลาซ้อนกันก่อนบันทึก หากไม่ผ่านจะไม่ใช้ตารางใหม่และส่ง status กลับ ดังนั้น Dashboard ต้องตรวจซ้ำก่อน publish และไม่ส่ง payload เมื่อเกิด overlap หรือเวลาไม่ถูกต้อง

## ช่องว่างที่พบ

`SOIL_PIN` ถูกประกาศเป็น `A0` แต่จากจุดอ่านและ publish sensor ที่ตรวจสอบ พบเฉพาะ DHT11 ที่ topic `smartfarm/sensor/dht11` ยังไม่พบ MQTT topic หรือ payload สำหรับ Soil Moisture ดังนั้น Dashboard ห้ามแสดงค่า Soil Moisture และควรแสดงว่า `ยังไม่มีข้อมูลจาก Firmware` หรือบันทึกเป็น TODO จนกว่าจะเพิ่ม contract ใน Firmware อย่างชัดเจน

## ข้อควรระวังด้านความลับ

Firmware มีค่า MQTT server อยู่ใน source แต่ `mqttUser` และ `mqttPass` ถูกเก็บเป็นค่าที่ตั้งผ่าน configuration/LittleFS การพัฒนา Dashboard จะไม่คัดลอก username, password, Telegram token, chat ID หรือ OTA password เข้า source control และจะใช้ environment variables ฝั่ง server เท่านั้น
