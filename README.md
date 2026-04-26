# Employee Leave Management System

## Description
This project is a full-stack Employee Leave Management System where employees can apply for leave and managers can approve or reject requests. The system includes role-based login and dashboard features.

---

## Features
- Role-based login (Employee / Manager)
- Apply for leave
- View leave history
- Approve or reject leave requests
- Dashboard with leave details

---

## Tech Stack
- Frontend: React (Vite, Tailwind CSS)
- Backend: PHP (Laravel)
- Database: MySQL

---

## Project Structure

Leave_Management_System/
│
├── leave-frontend/      # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│
├── leave-backend/       # Laravel backend
│   ├── app/
│   ├── routes/
│   ├── database/
│   └── .env

---

## How to Run

### Frontend
cd leave-frontend  
npm install  
npm run dev  

### Backend
- Open XAMPP and start Apache & MySQL
- Place `leave-backend` folder inside `htdocs`
- Import database into phpMyAdmin
- Run backend server if needed

---

## Author
Sobhan Nayak
