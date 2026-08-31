# Browser smoke check

ตรวจหน้า `http://localhost:4173/dashboard/` และ `#devices` จาก source ใน Repository Gaden สำเร็จใน Chromium

- เอกสาร HTML แสดงภาษาไทยและชื่อ `สวนลุงนะ · Smart Farm`
- Dashboard แสดง `รอข้อมูลจากอุปกรณ์`, `รอข้อมูล` สำหรับ DHT11/Relay/Reminder และไม่แสดงตัวเลขจำลอง
- Bottom Navigation แสดงครบ ภาพรวม, อุปกรณ์, ตั้งเวลา, บัญชี และ ตั้งค่า
- หน้า Devices แสดง Relay ทั้ง 4 ตาม mapping จริง และมีรายละเอียด Manual, Timer, Schedule, Auto และ History พร้อมข้อความอธิบายเมื่อ Firmware ยังไม่มี Event Log topic
- หน้า responsive แสดงการ์ดและ navigation แบบ mobile app ได้โดยไม่มีองค์ประกอบล้น viewport จากการตรวจด้วย screenshot
- เมื่อเปิดแบบไม่มี bridge จริง UI อยู่ในสถานะ Offline/รอข้อมูลตามที่ออกแบบ ไม่ถือว่าคำสั่งสำเร็จและไม่ใช้ mock sensor state

หมายเหตุ: การยืนยัน MQTT live ต้องตั้งค่า `.env` และเปิด bridge กับ Broker จริงก่อน เพราะ sandbox ตรวจได้เฉพาะ UI shell ในโหมด Offline
