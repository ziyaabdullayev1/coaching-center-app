# 🎓 Coaching Center Application

This full-stack project is designed to support the academic success of middle school students by providing a structured platform for **daily task planning, academic goal tracking, and exam performance analysis**. It also equips teachers and academic coaches with detailed analytics and reporting tools.

## 🚀 Tech Stack

- **Frontend:** React + Vite + Tailwind CSS  
- **Backend:** Node.js + Express  
- **Database & Auth:** Supabase  
- **API Testing:** Postman  
- **Deployment (Optional):** Vercel / Render / Netlify  

## 📁 Project Structure
coaching-center-app/ ├── client/ # React frontend app │ ├── pages/ # StudentsPage, GoalsPage, etc. │ └── services/ # Supabase client and APIs ├── server/ # Node.js backend with Express │ ├── routes/ # API endpoints │ ├── controllers/ │ └── services/


## ✨ Key Features

### 🧑‍🎓 Student Panel
- Daily task tracking  
- Automatic catch-up task generation  
- Manual exam result input  

### 🧑‍🏫 Teacher Panel
- Assign subject-based goals and tasks  
- Monitor student progress  
- View detailed exam analysis  

### 📊 Coach / Admin Panel
- View student rankings (class, school, general)  
- See subject-wise weaknesses and recommendations  
- Generate analytical reports  

## 📈 Exam Analysis Endpoints

- `GET /api/exams/student/:id/summary` → total correct, wrong, blank, net score  
- `GET /api/exams/student/:id/average` → average correct answers per subject  
- `GET /api/exams/student/:id/progress` → net score progress over time  

## 🧪 Developer Setup

### 1. Clone the repository

```bash
git clone https://github.com/ziyaabdullayev1/coaching-center-app.git
cd coaching-center-app

### 2. Start the backend 
cd server
npm install
npm run dev

### 3. Start the frontend
cd ../client
npm install
npm run dev

