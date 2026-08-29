# SIWES Logbook - Backend API

## Overview

A modular RESTful backend for the SIWES Logbook system, built with Express and MySQL. The API powers student log recording, school administration, organization placement workflows, and supervision management across multiple roles.

## Key Features

- **Modular architecture:** Each domain is isolated in its own module (Student, School, Organization, Placement, Logbook, Leave, Admin, Support, Auth)
- **Authentication flows:** Signup, signin, OTP send and verification, with role-based access control
- **School management:** Full CRUD operations for students, departments, and supervisors
- **Organization workflows:** Supervisor creation, student assignment, and placement management
- **Transactional email:** OTP and notification delivery via EmailJS
- **Media handling:** Profile images and attachments processed with Multer and stored on Cloudinary

## Technology Stack

- Node.js with Express 5
- MySQL (mysql2 driver)
- Multer (file uploads)
- Cloudinary (media storage)
- EmailJS (email delivery)
- CORS and dotenv (configuration and security)

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- MySQL database
- Cloudinary and EmailJS accounts

### Installation

```bash
git clone https://github.com/Tech-Guru19/siwes-logbook-backend-c.git
cd siwes-logbook-backend-c
npm install
cp .env.example .env   # Configure database, Cloudinary and EmailJS credentials
npm start
```

## API Modules

| Module | Responsibility |
|---|---|
| Module/Auth | OTP send and verification |
| Module/Student | Signup, signin, profile |
| Module/School | School signup, students, departments, supervisors |
| Module/Organization | Organization signup, supervisor creation and assignment |
| Module/OrganizationSupervisor | Supervisor signup, signin and CRUD operations |
| Module/Placement | Placement apply, fetch, status |
| Module/Logbook | Daily log CRUD operations |
| Module/Leave | Leave request management |
| Module/Admin | Administrative operations |
| Module/Support | Support ticket management |

## Author

[Obiasogu Esther Chizaram](https://github.com/Tech-Guru19)
