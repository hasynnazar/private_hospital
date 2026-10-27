# NovaMed — Private Hospital Management System 🏥

> **Diploma Thesis**: *Design and implementation of a web-based system for a private medical clinic using Spring Boot, React, and artificial intelligence elements*

---

## 📌 Project Overview
NovaMed is a modern full-stack web application for private medical clinics designed to streamline the appointment booking process, minimize reception workload, and provide 24/7 intelligent patient routing.

### 🌟 Key Features:
- **Autonomous AI Medical Assistant**: Triage agent powered by LangChain and DeepSeek LLM orchestrated in n8n. Analyzes patient symptoms in real time, deterministically queries backend REST tools (`get_doctors` and `get_free_slots`), suggests appropriate specialists, and provides legal medical disclaimers.
- **Double-Booking Prevention**: Strict business validation ensuring appointments are in 30-minute intervals (09:00–17:00), prevents past bookings, and protects against race-condition overlaps.
- **Automated Lifecycle Transitions**: Background `@Scheduled` tasks automatically transition past visits (>24h) to `COMPLETED`.
- **Role-Based Access Control (RBAC)**: Secure stateless JWT authentication with BCrypt hashing supporting `PATIENT`, `DOCTOR`, and `ADMIN` roles.
- **Doctor Daily Schedule**: Personal agenda views for doctors with upcoming patient visits and phone contacts.

---

## 🛠️ Tech Stack
- **Backend**: Java 25, Spring Boot 4, Spring Security, Spring Data JPA, Hibernate, JJWT.
- **Database**: PostgreSQL 18.
- **Frontend**: React 19, Vite, Vanilla CSS modern design system.
- **AI Engine**: n8n Workflow Automation, LangChain Agent, DeepSeek LLM, Docker.

---

## 📁 Repository Structure
```
private_hospital/
├── src/main/java/              # Spring Boot Backend source code
│   └── com/example/demo/
│       ├── controller/         # REST API endpoints (Doctors, Patients, Appointments, Auth, AI Proxy)
│       ├── model/              # JPA Entities (Doctor, Patient, Appointment)
│       ├── repository/         # Spring Data JPA Repositories
│       ├── security/           # JWT Filter, AuthUser, SecurityConfig (RBAC)
│       └── service/            # Core business & validation logic
├── src/main/resources/         # application.properties & configs
├── frontend/                   # React Frontend (Vite)
│   ├── src/
│   │   ├── auth/               # AuthContext, AuthProvider, ProtectedRoute
│   │   ├── components/         # AiChatWidget (interactive floating assistant)
│   │   └── pages/              # Doctors, BookingModal, MyAppointments, Admin, Home
│   ├── package.json
│   └── vite.config.js
├── novamed_ai_workflow.json    # n8n AI Medical Assistant Workflow export
├── pom.xml                     # Maven project configuration
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Database (PostgreSQL)
Run PostgreSQL in Docker or locally on port `5432`:
```bash
docker run -d --name clinic-postgres -p 5432:5432 -e POSTGRES_DB=clinicdb -e POSTGRES_USER=admin -e POSTGRES_PASSWORD=admin123 postgres:18-alpine
```

### 2. Backend (Spring Boot)
From the repository root:
```bash
./mvnw clean spring-boot:run
```
The REST API will be available at `http://localhost:8080`.

### 3. Frontend (React)
In another terminal:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### 4. AI Assistant (n8n + DeepSeek)
Import `novamed_ai_workflow.json` into your local n8n instance (`http://localhost:5678`) and activate the workflow.
The assistant connects seamlessly via the backend proxy `POST /api/v1/ai/chat`.