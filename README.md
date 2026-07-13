# MedFlow — Hospital Management System

MedFlow is a full-stack hospital workflow platform that digitizes the complete patient journey inside a clinic or hospital. It connects every role in real time from the front desk receptionist to the triage nurse, consulting doctor, dispensing pharmacist, and billing officer through a shared pipeline with live updates, role-specific dashboards, and a unified data layer.

---

## Features

### Patient Pipeline Workflow
Patients progress through a configurable stage engine: **Reception → Triage → Doctor → Laboratory → Pharmacy → Billing → Completed**. Every state transition is recorded in `QueueHistory` for full auditability.

### Role-Based Dashboards
Five distinct interfaces tailored to each staff role:

| Role | Dashboard Capabilities |
|---|---|
| **Receptionist** | Patient registration, appointment scheduling, checkout, waiting queue view |
| **Nurse** | Live triage queue, vitals entry (BP, temperature, heart rate, weight, SpO₂), urgency assignment, station activity logs |
| **Doctor** | Patient visit queue, SOAP notes forms, clinical history timeline, prescription entry, symptom and action tracking |
| **Pharmacist** | Pending fulfillment list, medication dispensation interface, allergy alerts, stock visibility |
| **Administrator** | Analytics dashboard with patient volume charts, monthly finance trends, workload breakdown, staff management table, PDF report generation |

### Real-Time Synchronization
Built on **Socket.IO** — every workflow action emits live events that instantly update all connected dashboards. Events include patient registration, triage completion, diagnosis entry, prescription creation and dispensation, billing generation, and queue stage changes.

### Clinical Documentation
- **SOAP Notes** (Subjective, Objective, Assessment, Plan) per patient visit
- **Triage Vitals** with configurable urgency levels (Low, Medium, High, Critical)
- **Prescription Management** with dosage, frequency, and duration tracking
- **Medical Records** linked to appointments with follow-up flags

### Inventory & Billing
- **Medication Inventory** with stock quantity and unit price tracking
- **Invoice Generation** with line-item detail (description, quantity, unit price)
- **Payment Status Tracking** (Paid, Unpaid, Partial)

### Authentication & Security
- **JWT-based authentication** with short-lived access tokens and secure httpOnly refresh tokens
- **Role-Based Access Control (RBAC)** — every API endpoint is protected by role middleware
- **Input validation** via Zod schemas
- **Cloudinary integration** for secure profile image uploads

### API Documentation
Interactive Swagger/OpenAPI 3.0 documentation served at `/api/docs` when the backend is running.

---

## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| **React 19** | UI component library |
| **Vite 8** | Build tool and dev server with HMR |
| **React Router DOM v7** | Client-side routing with role-based route guards |
| **Tailwind CSS 3** | Utility-first CSS framework for responsive design |
| **Autoprefixer** | Vendor prefix injection for cross-browser support |
| **Axios** | HTTP client for API communication |
| **Socket.IO Client 4** | Real-time bidirectional event communication |
| **Lucide React** | Consistent open-source icon library |
| **jsPDF** | Client-side PDF generation for reports |
| **jspdf-autotable** | Table rendering extension for jsPDF |
| **JavaScript (JSX)** | Application language |

### Backend

| Technology | Purpose |
|---|---|
| **Node.js 22** | JavaScript runtime environment |
| **TypeScript 6** | Typed language superset compiled via `tsc` |
| **Express 5** | HTTP web framework and REST API routing |
| **Socket.IO 4** | WebSocket server for real-time events |
| **Prisma 6** | Type-safe ORM with auto-generated query client and migrations |
| **PostgreSQL** | Relational database (hosted on Neon serverless) |
| **jsonwebtoken** | JWT creation and verification for access + refresh tokens |
| **bcrypt** | Password hashing and comparison |
| **Zod 4** | Runtime schema validation with TypeScript inference |
| **Cloudinary SDK** | Cloud-based image upload and transformation |
| **Multer** | Multipart form data parsing for file uploads |
| **Streamifier** | Buffer-to-stream conversion for Cloudinary uploads |
| **swagger-jsdoc** | OpenAPI 3.0 spec generation from JSDoc annotations |
| **swagger-ui-express** | Interactive Swagger UI served at `/api/docs` |
| **tsx** | TypeScript execution for development and seed scripts |
| **Nodemon** | File watcher with automatic server restart in development |

### Database (Prisma Schema)

**Models:** User, Patient, Appointment, MedicalRecord, Prescription, Medication, PrescriptionMedication, Invoice, InvoiceItem, Triage, Queue, QueueHistory, RefreshToken, Specialty, Role

**Enums:** RoleName (RECEPTIONIST, NURSE, DOCTOR, PHARMACIST, ADMIN), Stage (RECEPTION, TRIAGE, DOCTOR, LABORATORY, PHARMACY, BILLING, COMPLETED), AppointmentStatus, PrescriptionStatus, PaymentStatus, Urgency, Gender

### Deployment & Infrastructure

| Service | Use |
|---|---|
| **Vercel** | Frontend SPA hosting with automatic SPA rewrites |
| **Render.com** | Backend API hosting |
| **Neon** | Serverless PostgreSQL database |
| **Cloudinary** | Media storage and profile image hosting |

---

## Architecture Overview

### Backend — Layered Architecture

Routes → Controllers → Services → Repositories → Prisma ORM → PostgreSQL

- **Routes** define HTTP methods, paths, middleware chains, and JSDoc Swagger annotations
- **Controllers** handle request/response lifecycle and delegate to services
- **Services** contain business logic and orchestration
- **Repositories** encapsulate database queries (used where query complexity warrants separation)
- **Middlewares** handle JWT verification, role authorization, file upload, error handling, and 404 responses
- **Sockets** manage WebSocket authentication and event emission constants
- **Validations** define Zod schemas for request body validation

### Frontend — Component Architecture

Pages → Role-Specific Components → Shared Components → Context Providers → API Services

- **Context Providers:** AuthContext (user session), SocketContext (WebSocket connection), WorkflowContext (pipeline state)
- **API Services:** Axios-based modules for each resource (auth, patients, appointments, triage, consultation, prescriptions, medications, billing, queue)
- **Hooks:** Custom hooks for auth state, WebSocket events, medication data, toast notifications, and workflow orchestration
- **Protected Routes:** Route-level guards enforce authentication and role requirements

### Real-Time Event Flow

When a nurse completes triage, the backend emits `patient:triaged` and `queue:updated` events. The doctor dashboard receives these events instantly and updates its patient queue without a page refresh. The same pattern applies across all workflow stages registration, consultation, prescription, dispensation, and billing.

---

## Project Structure
```
MedFlow/
├── .gitignore
├── .vscode/
│   └── settings.json
│
├── Backend/
│   ├── .dockerignore
│   ├── .env
│   ├── DockerFile
│   ├── docker-compose.yml
│   ├── nodemon.json
│   ├── package.json
│   ├── tsconfig.json
│   ├── dist/
│   ├── generated/
│   │   └── prisma/
│   ├── node_modules/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── src/
│       ├── app.ts
│       ├── server.ts
│       ├── config/
│       │   ├── swagger.ts
│       │   └── schemas/
│       │       ├── index.ts
│       │       ├── appointment.schema.ts
│       │       ├── invoice.schema.ts
│       │       ├── invoiceItem.schema.ts
│       │       ├── medicalRecord.schema.ts
│       │       ├── patient.schema.ts
│       │       ├── queue.schema.ts
│       │       └── user.schema.ts
│       ├── controllers/
│       │   ├── authController.ts
│       │   ├── appointmentController.ts
│       │   ├── billingController.ts
│       │   ├── consultationController.ts
│       │   ├── invoiceItemController.ts
│       │   ├── medicalRecordController.ts
│       │   ├── medicationController.ts
│       │   ├── patientController.ts
│       │   ├── prescriptionController.ts
│       │   ├── queueController.ts
│       │   ├── triageController.ts
│       │   └── userController.ts
│       ├── lib/
│       │   ├── prisma.ts
│       │   ├── cloudinary.ts
│       │   └── comprehensiveSeed.ts
│       ├── middlewares/
│       │   ├── authMiddleware.ts
│       │   ├── errorMiddleware.ts
│       │   ├── notFoundMiddleware.ts
│       │   ├── roleMiddleware.ts
│       │   └── upload.ts
│       ├── repositories/
│       │   ├── consultationRepository.ts
│       │   ├── prescriptionRepository.ts
│       │   └── triageRepository.ts
│       ├── routes/
│       │   ├── authRoute.ts
│       │   ├── appointmentRoute.ts
│       │   ├── billingRoute.ts
│       │   ├── consultationRoutes.ts
│       │   ├── invoiceItemRoute.ts
│       │   ├── medicalRecordRoute.ts
│       │   ├── medicationRoutes.ts
│       │   ├── patientRoute.ts
│       │   ├── prescriptionRoutes.ts
│       │   ├── queueRoute.ts
│       │   ├── triageRoute.ts
│       │   └── userRoute.ts
│       ├── services/
│       │   ├── authService.ts
│       │   ├── appointmentService.ts
│       │   ├── billingService.ts
│       │   ├── consultationService.ts
│       │   ├── invoiceItemService.ts
│       │   ├── medicalRecordService.ts
│       │   ├── medicationService.ts
│       │   ├── patientService.ts
│       │   ├── prescriptionService.ts
│       │   ├── queueService.ts
│       │   ├── triageService.ts
│       │   └── userService.ts
│       ├── sockets/
│       │   ├── auth.ts
│       │   └── socketEvents.ts
│       ├── types/
│       │   ├── express.d.ts
│       │   └── socket.d.ts
│       ├── utils/
│       │   ├── cloudinaryUpload.ts
│       │   ├── cookieOptions.ts
│       │   ├── dataFormat.ts
│       │   ├── jwt.ts
│       │   └── passwordValidator.ts
│       └── validations/
│           ├── consultationValidation.ts
│           └── triageValidation.ts
│
└── Frontend/
    └── medflow-web/
        ├── .env
        ├── .gitignore
        ├── index.html
        ├── package.json
        ├── vite.config.js
        ├── tailwind.config.js
        ├── postcss.config.js
        ├── eslint.config.js
        ├── vercel.json
        ├── public/
        │   ├── favicon.svg
        │   └── icons.svg
        ├── src/
        │   ├── main.jsx
        │   ├── App.jsx
        │   ├── index.css
        │   ├── assets/
        │   │   ├── icon.png
        │   │   └── medflow-logo.jpg
        │   ├── components/
        │   │   ├── layout/
        │   │   │   ├── AsideLeft.jsx
        │   │   │   ├── AuthCard.jsx
        │   │   │   ├── MainLayout.jsx
        │   │   │   ├── SidebarItem.jsx
        │   │   │   └── sidebarConfig.js
        │   │   ├── admin/
        │   │   │   ├── AnalyticsMetrics.jsx
        │   │   │   ├── MonthlyFinanceChart.jsx
        │   │   │   ├── PatientVolumeChart.jsx
        │   │   │   ├── StaffOrchestrationTable.jsx
        │   │   │   └── WorkloadBreakdown.jsx
        │   │   ├── doctor/
        │   │   │   ├── ActiveConsultationHeader.jsx
        │   │   │   ├── ClinicalHistoryTimeline.jsx
        │   │   │   ├── PatientVisitQueue.jsx
        │   │   │   ├── PrescriptionOrderEntry.jsx
        │   │   │   ├── SoapNotesForm.jsx
        │   │   │   └── SymptomsAndActions.jsx
        │   │   ├── nurse/
        │   │   │   ├── ActiveTriagePanel.jsx
        │   │   │   ├── LiveQueue.jsx
        │   │   │   ├── MetricCard.jsx
        │   │   │   └── StationLogs.jsx
        │   │   ├── pharmacist/
        │   │   │   ├── AllergyBanner.jsx
        │   │   │   ├── MedicationDispensation.jsx
        │   │   │   └── PendingFulfillmentList.jsx
        │   │   ├── receptionist/
        │   │   │   ├── AppointmentsTable.jsx
        │   │   │   ├── NewPatientRegistration.jsx
        │   │   │   ├── PatientCheckout.jsx
        │   │   │   └── ReceptionSidePanel.jsx
        │   │   ├── settings/
        │   │   │   ├── NotificationSettings.jsx
        │   │   │   ├── ProfileForm.jsx
        │   │   │   ├── ProfileSummary.jsx
        │   │   │   └── SettingTabs.jsx
        │   │   ├── AddtStaffModel.jsx
        │   │   ├── Header.jsx
        │   │   ├── Loading.jsx
        │   │   ├── MedflowSupport.jsx
        │   │   ├── NotificationBell.jsx
        │   │   ├── ProtectedRoute.jsx
        │   │   ├── RoleProtection.jsx
        │   │   └── ToastContainer.jsx
        │   ├── constants/
        │   │   ├── mockData.jsx
        │   │   ├── roles.js
        │   │   ├── specialties.js
        │   │   └── types.js
        │   ├── context/
        │   │   ├── authContext.jsx
        │   │   ├── SocketContext.jsx
        │   │   ├── SocketContextCore.jsx
        │   │   ├── WorkflowContext.jsx
        │   │   └── WorkflowContextCore.jsx
        │   ├── hooks/
        │   │   ├── useAuth.js
        │   │   ├── useMedications.js
        │   │   ├── useSocket.js
        │   │   ├── useToast.js
        │   │   └── useWorkFlow.js
        │   ├── pages/
        │   │   ├── LoginPage.jsx
        │   │   ├── ReceptionistDash.jsx
        │   │   ├── NurseDash.jsx
        │   │   ├── DoctorDash.jsx
        │   │   ├── PharmacistDash.jsx
        │   │   ├── AdminDash.jsx
        │   │   └── Setting.jsx
        │   ├── services/
        │   │   ├── api.js
        │   │   ├── authAPI.js
        │   │   ├── appointmentAPI.js
        │   │   ├── billingAPI.js
        │   │   ├── consultationAPI.js
        │   │   ├── invoiceItemAPI.js
        │   │   ├── medicationAPI.js
        │   │   ├── patientAPI.js
        │   │   ├── prescriptionAPI.js
        │   │   ├── queueAPI.js
        │   │   ├── triageAPI.js
        │   │   ├── userAPI.js
        │   │   └── socket.js
        │   ├── sockets/
        │   │   └── socketEvents.js
        │   └── utils/
        │       ├── formatters.js
        │       ├── transformers.js
        │       └── validators.js
        └── dist/
```
---
 
## Getting Started
 
### Backend Setup
 
```bash
cd Backend
 
# Install dependencies
npm install
 
# Create environment file
# Copy the structure from below and save as .env
# Edit with your actual values
 
# Generate Prisma client and compile TypeScript
npm run build
 
# Run database migrations
npx prisma migrate dev
 
# Seed the database with roles, specialties, and an admin account
npm run seed
 
# Start development server (with nodemon + tsx hot reload)
npm run dev
```
 
Environment file (`Backend/.env`):
 
```env
PORT=3000
DATABASE_URL=postgresql://user:password@host:port/medflow
JWT_ACCESS_SECRET=<64-byte-hex-string>
JWT_REFRESH_SECRET=<64-byte-hex-string>
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
NODE_ENV=development
```
 
### Frontend Setup (separate terminal)
 
```bash
cd Frontend/medflow-web
 
npm install
 
# Create .env with your backend URL
# VITE_API_BASE_URL=http://localhost:3000/api
# VITE_SOCKET_URL=http://localhost:3000
# VITE_APP_NAME=MedFlow
 
npm run dev
```
 
---
 
## Contributing
 
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request
---
 
## License
 
MIT (LICENSE)

Developed by Sor Channorakpitou and Seng Dina

Cambodia Academy of Digital Technology (CADT)
