# Dashboard Application

This is a full-stack dashboard application built with **React (Vite)** for the frontend and **Django (Django REST Framework)** for the backend.

## Prerequisites

Before running the project, ensure you have the following installed:
*   [Python 3.10+](https://www.python.org/downloads/)
*   [Node.js 16+](https://nodejs.org/)

## Project Structure

*   `backend/`: Django project serving the API.
*   `frontend/`: React application (Vite).
*   `api/`: Django app containing models and views.

---

## 🚀 How to Run the Application

You will need **two separate terminals** to run the full application.

### 1. Start the Backend (Django)

1.  Open a terminal.
2.  Navigate to the `backend` directory (or root where `manage.py` is):
    ```bash
    # If you are in the root folder (dashboard-1)
    python manage.py runserver 0.0.0.0:8000
    ```
    *The API will be available at `http://localhost:8000/api/`*

### 2. Start the Frontend (React)

1.  Open a **second** terminal.
2.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    npm run dev -- --host
    ```
    *The UI will be available at `http://localhost:5173/` (or `5174` if `5173` is busy)*

---

## 🔑 Accessing the App

*   **Frontend Dashboard:** [http://localhost:5173/](http://localhost:5173/)
*   **Backend API:** [http://localhost:8000/api/](http://localhost:8000/api/)
*   **Django Admin Panel:** [http://localhost:8000/admin/](http://localhost:8000/admin/)

### Login Credentials (Admin)

*   **Username:** `admin`
*   **Password:** `admin`

---

## 🛠️ Setup (First Time Only)

If you are setting this up on a new machine, follow these steps before running:

**Backend:**
```bash
# Install dependencies
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt

# Run migrations
python manage.py migrate

# Seed data (optional)
python seed_data.py
```

**Frontend:**
```bash
cd frontend
npm install
```
