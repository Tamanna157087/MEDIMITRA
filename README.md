# 🏥 MediMitra – Hospital Management System

A full-stack hospital management system with role-based access for patients, doctors and receptionists, built to streamline appointments, queues and patient records.

🔗 **Live demo:** [medimitra-kohl.vercel.app](https://medimitra-kohl.vercel.app/login)

## 👥 Team

Built as a team project by:
- **Tamanna Goyal** – [@Tamanna157087](https://github.com/Tamanna157087)
- **Ayushi Choudhary** – [@Ayushi-Choudhary22](https://github.com/Ayushi-Choudhary22) · [original repo](https://github.com/Ayushi-Choudhary22/MediMitra)

### Contributions
Both of us contributed equally across the whole project, working together on the frontend, backend, database design and deployment.

## ✨ Features
- **Role-based access** for Patient, Doctor and Receptionist
- **Appointment scheduling** and **live queue tracking**
- **Token system** to manage patient flow
- **QR-based patient history** (generate and scan with the camera)
- **Test information module**
- **Online consultation** with auto-generated meeting links

## 🛠️ Tech Stack
| Layer | Technologies |
|---|---|
| Frontend | React (Vite), React Router, Axios |
| Backend | Node.js, Express, REST APIs |
| Database | MongoDB (Mongoose) |
| Other | QR code generation and scanning |

## 📸 Screenshots
<!-- Upload images to a /screenshots folder, then uncomment and edit -->
<!-- ![Login](screenshots/login.png) -->
<!-- ![Dashboard](screenshots/dashboard.png) -->

## ⚙️ Run Locally

**Prerequisites:** Node.js v18+, MongoDB (local or Atlas), npm

```bash
git clone https://github.com/Tamanna157087/MEDIMITRA.git
cd MEDIMITRA

# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Create a `.env` file in the backend folder:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

> Replace the folder names and commands above if your repo uses different ones.

## 📄 License
For learning and portfolio purposes.
