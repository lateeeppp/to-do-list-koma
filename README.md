# To-Do List Application

Aplikasi To-Do List sederhana yang dibangun dengan arsitektur modern menggunakan React, Node.js, dan PostgreSQL, di-containerize dengan Docker untuk kemudahan deployment.

## 📋 Deskripsi

Aplikasi ini memungkinkan users untuk mengelola daftar tugas (to-do list) dengan fitur-fitur dasar:
- ✅ Menambah todo baru
- ✅ Menandai todo sebagai selesai/belum selesai (toggle)
- ✅ Menghapus todo
- ✅ Melihat semua todos

## 🏗️ Arsitektur

Aplikasi terdiri dari tiga komponen utama yang berjalan dalam Docker containers:

```
┌─────────────────────────────────────────┐
│         Docker Network                   │
│                                          │
│  ┌──────────────┐                       │
│  │ Frontend     │ React + Vite + Nginx  │
│  │ Port: 3000   │                       │
│  └──────┬───────┘                       │
│         │                                │
│  ┌──────▼───────┐                       │
│  │ Backend      │ Node.js               │
│  │ Port: 4000   │                       │
│  └──────┬───────┘                       │
│         │                                │
│  ┌──────▼───────┐                       │
│  │ Database     │ PostgreSQL 16         │
│  │ Port: 5432   │                       │
│  └──────────────┘                       │
└─────────────────────────────────────────┘
```

### Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Backend** | Node.js 20, Native HTTP Server |
| **Database** | PostgreSQL 16 Alpine |
| **Web Server** | Nginx Alpine |
| **Container** | Docker & Docker Compose |

## 🚀 Prerequisites

Pastikan sudah terinstall:
- [Docker](https://docs.docker.com/get-docker/) (version 20.x atau lebih baru)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.x atau lebih baru)

Verifikasi instalasi:
```bash
docker --version
docker-compose --version
```

## 📦 Cara Menjalankan Aplikasi

### 1. Clone Repository

```bash
git clone https://github.com/lateeeppp/to-do-list-koma.git
cd to-do-list-koma
```

### 2. Jalankan dengan Docker Compose

```bash
docker-compose up
```

Atau jalankan di background (detached mode):
```bash
docker-compose up -d
```

Untuk rebuild images (jika ada perubahan kode):
```bash
docker-compose up --build
```

### 3. Akses Aplikasi

Setelah semua container berjalan:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **Database**: localhost:5432

### 4. Stop Aplikasi

Untuk stop containers:
```bash
docker-compose down
```

Untuk stop dan hapus volumes (data akan hilang):
```bash
docker-compose down -v
```

## 🔧 Configuration

Environment variables dapat dikonfigurasi di file `docker-compose.yml`:

### Database Configuration
```yaml
POSTGRES_USER: todo_user
POSTGRES_PASSWORD: todo_password
POSTGRES_DB: todo_db
```

### Backend Configuration
```yaml
DATABASE_URL: postgres://todo_user:todo_password@todo-db:5432/todo_db
PORT: 4000
CORS_ORIGIN: http://localhost:3000
```

### Frontend Configuration
```yaml
VITE_API_URL: http://localhost:4000
```

## 📁 Struktur Project

```
to-do-list-koma/
├── backend/
│   ├── Dockerfile
│   ├── index.js           # Node.js HTTP server & API
│   └── package.json
├── frontend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── docker-compose.yml     # Orchestration config
└── README.md
```

## 🔍 Troubleshooting

### Cek Status Containers
```bash
docker-compose ps
```

### Lihat Logs
```bash
# Semua services
docker-compose logs

# Specific service
docker-compose logs todo-frontend
docker-compose logs todo-backend
docker-compose logs todo-db

# Follow logs (real-time)
docker-compose logs -f
```

### Restart Specific Service
```bash
docker-compose restart todo-backend
```

### Rebuild Specific Service
```bash
docker-compose build todo-frontend
docker-compose up -d todo-frontend
```

### Port Sudah Digunakan
Jika port 3000, 4000, atau 5432 sudah digunakan, ubah port mapping di `docker-compose.yml`:
```yaml
ports:
  - "3001:80"  # Ubah 3000 ke 3001
```

### Database Connection Error
Pastikan environment variables sudah benar dan container database sudah running:
```bash
docker-compose logs todo-db
```

## 🧪 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/todos` | Ambil semua todos |
| POST | `/todos` | Buat todo baru |
| PATCH | `/todos/:id` | Toggle status completed |
| DELETE | `/todos/:id` | Hapus todo |

### Contoh Request

**GET /todos**
```bash
curl http://localhost:4000/todos
```

**POST /todos**
```bash
curl -X POST http://localhost:4000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Belajar Docker"}'
```

**PATCH /todos/:id**
```bash
curl -X PATCH http://localhost:4000/todos/1
```

**DELETE /todos/:id**
```bash
curl -X DELETE http://localhost:4000/todos/1
```

## 📝 Database Schema

```sql
CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE
);
```

## 🔒 Security Features

- ✅ SQL Injection Prevention (Parameterized queries)
- ✅ CORS Configuration (Whitelist origins)
- ✅ Input Validation
- ✅ Environment Variables untuk credentials
- ✅ Isolated Docker Network
- ✅ Database tidak exposed ke public (production)

## 🚧 Limitasi

- Belum ada sistem autentikasi user
- Tidak ada fitur edit title todo
- Belum ada pagination untuk large dataset
- Tidak ada real-time sync antar users

## 🔮 Future Improvements

- [ ] JWT Authentication
- [ ] User registration & login
- [ ] Edit todo functionality
- [ ] Due dates & priorities
- [ ] Categories & tags
- [ ] Real-time sync dengan WebSocket
- [ ] Mobile app (React Native)
- [ ] Unit & E2E testing
- [ ] CI/CD pipeline

## 👨‍💻 Author

**lateeeppp**
- GitHub: [@lateeeppp](https://github.com/lateeeppp)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built for Cloud Computing (Komputasi Awan) course
- Semester 7 - 2025

---

**Happy Coding! 🚀**
