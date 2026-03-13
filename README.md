# Dental Appointment Management System

A conversational AI system for managing dental appointments, powered by LangGraph . This project demonstrates a multi-agent architecture where specialized agents work together to handle different appointment-related tasks through natural language interactions.
A full-stack intelligent **Dental Appointment Booking System** that automates patient–doctor interactions, slot booking, and appointment management using **AI agents built with LangGraph**.
The system allows patients to **browse doctors, check real-time availability, book appointments, and manage bookings** through a modern web interface. AI agents handle scheduling logic and automate backend workflows.
This project demonstrates how **AI agent frameworks can be integrated into real-world healthcare workflows** using modern full-stack architecture.

---

## Overview

This system provides a chat-based interface for patients and clinic staff to:
- **Check available appointment slots** and doctor information
- **Book new appointments** with preferred doctors
- **Cancel existing appointments**
- **Reschedule appointments** to different time slots

The system uses a supervisor agent that intelligently routes user requests to the appropriate specialized agent based on the detected intent, making it an excellent educational example of multi-agent AI systems.

## Architecture

### Multi-Agent Design

The system follows a supervisor pattern where a central coordinator analyzes user messages and routes them to the most appropriate specialized agent:

```
                    ┌──────────────┐
                    │   Supervisor │ ← Intent classification & routing
                    └──────┬───────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
   ┌─────────────┐ ┌─────────────┐ ┌───────────────┐
   │ Info Agent  │ │   Booking   │ │  Cancellation │
   │             │ │    Agent    │ │    Agent      │
   └─────────────┘ └─────────────┘ └───────────────┘
          │
          ▼
   ┌───────────────┐
   │   Reschedule  │
   │    Agent      │
   └───────────────┘
```

### Agent Responsibilities

- **Supervisor**: Analyzes user input, classifies intent (get_info, book, cancel, reschedule, end), and routes to the appropriate agent
- **Info Agent**: Handles queries about available slots, doctor schedules, and patient appointment lookups
- **Booking Agent**: Collects booking details and creates new appointments
- **Cancellation Agent**: Handles appointment cancellation requests
- **Rescheduling Agent**: Manages moving appointments to different time slots

### Technology Stack

- **LangGraph**: Orchestrates the multi-agent workflow and state management
- **LangChain**: Provides the LLM integration and tool framework
- **Gemini (API)**: Powers the conversational AI capabilities
- **Pydantic**: Handles structured data validation
- **Frontend**: React, Tailwind CSS, ShadCN UI, Axios / Fetch API
- **Backend**: Flask, Python , REST API architecuture
- **Database**: MYSQL

## Demo

<img width="1442" height="372" alt="Image" src="https://github.com/user-attachments/assets/82c54074-fa1e-4da2-944d-0e4e59d3c7ab" />
<img width="900" height="811" alt="Image" src="https://github.com/user-attachments/assets/efd746c2-95b9-491c-9cfc-ba244c6b0cdb" />
<img width="953" height="158" alt="Image" src="https://github.com/user-attachments/assets/3cb9c6b0-69cb-4cf7-a425-8cfd6afa4b30" />
<img width="1906" height="908" alt="Image" src="https://github.com/user-attachments/assets/3c0c26c4-1a9a-41c7-8606-aff3066ff2b8" />
<img width="1916" height="907" alt="Image" src="https://github.com/user-attachments/assets/3b96184f-d440-43e4-884b-404fd9026abc" />

---

## Project Structure

```
dental_agent_project/
├── main.py                          # Entry point - interactive CLI
├── doctor_availability.csv          # Data store for appointments
├── requirements.txt                 # Python dependencies
├── dental_agent/
│   ├── agent.py                     # Main agent definition & tools
│   ├── config/
│   │   └── settings.py              # Configuration & environment
│   ├── models/
│   │   └── state.py                 # State schema definitions
│   ├── tools/
│   │   ├── csv_reader.py            # Read operations (query tools)
│   │   └── csv_writer.py            # Write operations (mutation tools)
│   ├── agents/
│   │   ├── supervisor.py            # Intent classification & routing
│   │   ├── info_agent.py            # Information queries
│   │   ├── booking_agent.py         # Appointment booking
│   │   ├── cancellation_agent.py    # Appointment cancellation
│   │   └── rescheduling_agent.py    # Appointment rescheduling
│   └── workflows/
│       └── graph.py                 # LangGraph workflow definition
```
---

## Available Specializations

The system supports the following dental specializations:
- General Dentist
- Oral Surgeon
- Orthodontist
- Cosmetic Dentist
- Prosthodontist
- Pediatric Dentist
- Emergency Dentist

---


# 🏗️ System Architecture

```
Frontend (React)
        │
        │ REST API
        ▼
Backend (Flask)
        │
        │ Business Logic + AI Agents
        ▼
LangGraph Agent Workflow
        │
        ▼
MySQL Database
```

### Workflow

1. User selects doctor
2. Frontend fetches available slots
3. User selects a slot
4. Backend verifies availability
5. Slot is locked in database
6. Appointment record created
7. UI updates automatically

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/Dental-Appointment-System-using-LangGraph.git
cd Dental-Appointment-System-using-LangGraph
```

---

# 🔧 Backend Setup

### Create Virtual Environment

```bash
cd backend
python -m venv venv
```

Activate environment:

**Windows**

```bash
venv\Scripts\activate
```

**Mac/Linux**

```bash
source venv/bin/activate
```

---

### Install Dependencies

```bash
pip install -r requirements.txt
```

---

### Create Environment File

Create `.env`

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=dental_system
GEMINI_AI_API_KEY=your_key
```

---

### Run Backend

```bash
python app.py
```

Server runs on

```
http://127.0.0.1:5000
```

---

# 💻 Frontend Setup

```
cd frontend
npm install
```

Run frontend:

```
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# 🗄️ Database Schema

### Doctors Table

```
doctors
--------
doctor_id
doctor_name
specialization
```

### Doctor Availability

```
doctor_availability
-------------------
slot_id
doctor_name
specialization
date_slot
is_available
patient_to_attend
```

### Appointments

```
appointments
------------
id
patient_id
doctor_name
specialization
appointment_date
appointment_time
appointment_type
status
```

---

# 🔒 Concurrency Handling

Booking uses **database transactions** to prevent double bookings.

Process:

```
1. Begin transaction
2. Check slot availability
3. Lock slot
4. Insert appointment
5. Commit transaction
```

This ensures **two users cannot book the same slot simultaneously**.

---


# 🔮 Future Improvements

Possible extensions:

* Voice-based appointment scheduling
* Email reminders
* SMS notifications
* Doctor dashboard

---

## License

This project is **proprietary** and protected by copyright © 2025 Rasika Gautam.

You are welcome to view the code for educational or evaluation purposes (e.g., portfolio review by recruiters).  
However, you may **not copy, modify, redistribute, or claim this project as your own** under any circumstances — including in interviews or job applications — without written permission.

---

# 👨‍💻 Author

**Rasika Gautam**

Mathematics & Computing
Netaji Subhas University of Technology

Interests:

* AI Agents
* Machine Learning
* Full Stack Development
* AI Automation Systems

---
