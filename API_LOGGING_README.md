# API Host Logging Documentation

## 📊 Backend Logging Features

ระบบ backend ได้ถูกปรับปรุงให้มีการ logging ที่แสดงข้อมูล API host ที่ใช้งาน

### 🚀 Server Startup Logging

เมื่อเริ่มต้น server จะแสดงข้อมูลดังนี้:

```
🚀 ========================================
🚀 E-Borrow System Backend Started
🚀 ========================================
🌐 Server URL: http://localhost:5000
🔧 Environment: development
📡 Port: 5000
🔒 SSL: Disabled (HTTP)
✅ CORS enabled for origins: http://localhost:5173, https://e-borrow-system.vercel.app
🔌 Socket.IO server started
📊 API Host Information:
   - Frontend should use: http://localhost:5000/api
   - Upload endpoint: http://localhost:5000/uploads
   - WebSocket endpoint: http://localhost:5000
🚀 ========================================
```

### 📝 Request Logging

ทุก request ที่เข้ามาจะถูก log ด้วยรูปแบบ:

```
[2024-01-15T10:30:45.123Z] GET /api/users - Origin: http://localhost:5173 - User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36...
```

### 🔌 Socket.IO Logging

การเชื่อมต่อ WebSocket จะแสดง:

```
🔌 Socket connected: abc123 - Origin: http://localhost:5173 - User-Agent: Mozilla/5.0...
🔌 Socket disconnected: abc123 (john_doe), reason: client disconnect
```

### 🌐 API Endpoints

#### 1. Root Endpoint (`/`)

```json
{
  "message": "E-borrow API running",
  "server": {
    "url": "http://localhost:5000",
    "environment": "development",
    "port": 5000,
    "ssl": "disabled"
  },
  "api": {
    "base_url": "http://localhost:5000/api",
    "upload_url": "http://localhost:5000/uploads",
    "websocket_url": "http://localhost:5000"
  },
  "cors": {
    "allowed_origins": ["http://localhost:5173", "https://e-borrow-system.vercel.app"],
    "configured_origins": []
  },
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

#### 2. Host Info Endpoint (`/api/host-info`)

```json
{
  "server_url": "http://localhost:5000",
  "api_base_url": "http://localhost:5000/api",
  "upload_url": "http://localhost:5000/uploads",
  "websocket_url": "http://localhost:5000",
  "environment": "development",
  "client_origin": "http://localhost:5173",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

### 🧪 Testing

ใช้ script `test-api-logging.js` เพื่อทดสอบ:

```bash
node test-api-logging.js
```

### 📋 Environment Variables

- `NODE_ENV`: กำหนด environment (development/production)
- `PORT`: กำหนด port (default: 5000)
- `HOST`: กำหนด host (default: localhost)
- `FRONTEND_URL`: URL ของ frontend
- `FRONTEND_URLS`: รายการ URL ของ frontend (comma-separated)

### 🔍 การตรวจสอบ

1. **ดู Server Logs**: ตรวจสอบ console logs เมื่อเริ่มต้น server
2. **ทดสอบ API**: เรียกใช้ `/api/host-info` endpoint
3. **ตรวจสอบ CORS**: ดู logs เมื่อมี request จาก frontend
4. **ทดสอบ WebSocket**: ดู logs เมื่อมีการเชื่อมต่อ Socket.IO

### 📊 ข้อมูลที่ Log

- **Server Information**: URL, Environment, Port, SSL Status
- **API Endpoints**: Base URL, Upload URL, WebSocket URL
- **CORS Configuration**: Allowed Origins
- **Request Details**: Method, Path, Origin, User-Agent
- **Socket Connections**: Connection/Disconnection events
- **Timestamps**: ISO format timestamps for all events
