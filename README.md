# ⚙️ SIWES Logbook — Backend API

The **RESTful backend** for the SIWES Logbook system — a modular Express + MySQL API powering student logs, school administration, organization placements, and supervision workflows.

## ✨ Highlights

- 🗂️ **Modular architecture** — every domain lives in its own module (`Student`, `School`, `Organization`, `Placement`, `Logbook`, `Leave`, `Admin`, `Support`, `Auth`)
- 🔐 **Full authentication flows** — signup, signin, OTP send & verify, and role-based access
- 🏫 **School CRUD** — manage students, departments, and supervisors
- 🏢 **Organization workflows** — create supervisors, assign them to students, and manage placements
- 📩 **Transactional email** — EmailJS integration for OTP and notifications
- 🖼️ **Media uploads** — Cloudinary + Multer for profile images and attachments

## 🧱 Tech Stack

- **Node.js + Express 5**
- **MySQL 2** (mysql2 driver)
- **Multer** — file uploads
- **Cloudinary** — media storage
- **EmailJS (@emailjs/nodejs)** — email delivery
- **CORS + dotenv** — configuration & security

## 🚀 Getting Started

```bash
git clone https://github.com/Tech-Guru19/siwes-logbook-backend-c.git
cd siwes-logbook-backend-c
npm install
cp .env.example .env   # add your DB + Cloudinary + EmailJS keys
npm start
```

## 🔌 Core API Modules

| Module | Responsibility |
|---|---|
| `Module/Auth` | OTP send & verification |
| `Module/Student` | Signup, signin, profile |
| `Module/School` | School signup, students, departments, supervisors |
| `Module/Organization` | Org signup, supervisor creation & assignment |
| `Module/OrganizationSupervisor` | Supervisor signup/signin + CRUD |
| `Module/Placement` | Apply, fetch, status |
| `Module/Logbook` | Daily log CRUD |
| `Module/Leave` | Leave requests |
| `Module/Admin` | Admin operations |
| `Module/Support` | Support tickets |

## 👩‍💻 Author

**[Obiasogu Esther Chizaram](https://github.com/Tech-Guru19)**
