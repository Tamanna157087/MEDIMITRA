# 🏥 MediMitra – Hospital Management System

A full-stack hospital management system built with **React (Vite) + Node.js/Express + MongoDB**, with role-based access for receptionists, doctors and patients.

## 🌐 Live Demo
**Frontend:** [medimitra-kohl.vercel.app](https://medimitra-kohl.vercel.app/login)

## 👥 Team
Built as a team project, with equal contribution across the whole project (frontend, backend, database and deployment).

| Name | GitHub |
|---|---|
| Tamanna Goyal | [@Tamanna157087](https://github.com/Tamanna157087) |
| Ayushi Choudhary | [@Ayushi-Choudhary22](https://github.com/Ayushi-Choudhary22) · [original repo](https://github.com/Ayushi-Choudhary22/MediMitra) |

## 📁 Project Structure
```
medimitra/
├── backend/
│   ├── server.js
│   ├── .env
│   ├── models/          # User, Patient, History, Test, TokenCounter
│   ├── routes/          # auth, patient, doctor, test, history, queue
│   └── controllers/     # auth, patient, test, history, queue
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── context/AuthContext.jsx
        ├── utils/api.js
        └── pages/
            ├── Login.jsx
            ├── PatientRegister.jsx
            ├── PublicHistory.jsx
            ├── receptionist/   # Dashboard, RegisterPatient, TestInfo, QueueView
            ├── doctor/         # Dashboard, Patients, History, QRScanner
            └── patient/        # Dashboard
```

## 🎯 Features

### 👩‍💼 Receptionist
- Patient registration (name, age, problem, mode)
- Auto token number generation (resets daily)
- Online mode: auto-generated meeting link and time slot
- QR code generation (links to patient history)
- Test management (MRI, X-ray, blood tests, etc.)
- Live queue view with search and filter

### 🧑‍⚕️ Doctor
- Patient view filtered by specialization
- Call a patient and mark them as current
- Mark consultation complete, which moves the record to history
- QR scanner (camera) to view patient history
- History records with dates

### 🧑 Patient
- Self-registration
- View token number, mode and time slot
- Join the meeting link (for online consultations)
- View personal visit history

## 🛠️ Tech Stack
| Layer | Technologies |
|---|---|
| Frontend | React (Vite), React Router, Axios, qrcode.react, html5-qrcode |
| Backend | Node.js, Express, Mongoose, CORS, dotenv, qrcode, uuid |
| Database | MongoDB (local or Atlas) |
| Deployment | Vercel (frontend) |

## ⚙️ Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm v9+

## 🚀 Installation & Setup

**1. Clone the repository**
```bash
git clone https://github.com/Tamanna157087/MEDIMITRA.git
cd MEDIMITRA
```

**2. Set up the backend**
```bash
cd backend
npm install
```
Create a `.env` file in `backend/`:
```
MONGO_URI=mongodb://localhost:27017/medimitra
FRONTEND_URL=http://localhost:5173
PORT=5000
```

**3. Set up the frontend**
```bash
cd ../frontend
npm install
```

**4. Run both servers**

Terminal 1 (backend):
```bash
cd backend
npm run dev
```
Terminal 2 (frontend):
```bash
cd frontend
npm run dev
```
Open **http://localhost:5173**

## 🔐 Demo Login Credentials
| Role | Email | Password |
|---|---|---|
| Receptionist | receptionist@medimitra.com | rec123 |
| Doctor (Fever) | doctor.fever@medimitra.com | doc123 |
| Doctor (Heart) | doctor.heart@medimitra.com | doc123 |
| Doctor (General) | doctor.general@medimitra.com | doc123 |
| Doctor (Ortho) | doctor.ortho@medimitra.com | doc123 |

> Demo accounts are auto-seeded on first server start. For demonstration only.

## 🌐 API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Patient self-register |
| GET | `/api/auth/doctors` | List doctors |
| POST | `/api/patients/register` | Register patient |
| GET | `/api/patients` | Get all patients |
| GET | `/api/patients/stats` | Dashboard stats |
| GET | `/api/patients/:id` | Get patient by ID |
| PUT | `/api/patients/:id/status` | Update status |
| DELETE | `/api/patients/:id` | Remove patient |
| GET | `/api/queue` | Get queue |
| PUT | `/api/queue/:id/current` | Set current patient |
| GET | `/api/tests` | Get tests |
| POST | `/api/tests` | Add test |
| PUT | `/api/tests/:id` | Update test |
| DELETE | `/api/tests/:id` | Delete test |
| GET | `/api/history` | Get all history |
| GET | `/api/history/patient/:id` | Patient history |

## 📸 Screenshots
<!-- Upload images to a /screenshots folder, then uncomment and edit -->
<!-- ![Login](screenshots/login.png) -->
<!-- ![Receptionist Dashboard](screenshots/receptionist.png) -->
<!-- ![Doctor Dashboard](screenshots/doctor.png) -->
