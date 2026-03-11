# Task Manager Dashboard (Frontend Assignment)

## Overview

This project is a **Task Management Dashboard** built using **React.js**.
It allows users to log in, create tasks, manage tasks, and view analytics.

The application demonstrates **component-based architecture, state management, filtering, and local storage persistence**.

---

## Features

### Authentication

* Mock login page
* Login state stored in **LocalStorage**
* Protected dashboard route
* Logout functionality

### Task Management

* Add new task
* Delete task
* Mark task as completed
* Task includes:

  * Title
  * Description
  * Due Date
  * Priority (Low / Medium / High)
  * Status (Pending / Completed)

### Filters

* Search tasks by title
* Filter by task status
* Filter by priority

### Analytics

* Total number of tasks
* Completed tasks
* Pending tasks
* Completion percentage

### Persistence

* Tasks stored in **LocalStorage**
* Tasks remain after page refresh

---

## Technologies Used

* React.js
* React Router
* JavaScript (ES6)
* React Hooks
* LocalStorage
* Vite
* Basic CSS

---

## Project Structure

src/
components/
TaskForm.jsx

pages/
Login.jsx
Dashboard.jsx

services/

hooks/

utils/

App.jsx
main.jsx

---

## Setup Instructions

1. Clone the repository

```
git clone <repository-link>
```

2. Navigate to the project folder

```
cd task-manager
```

3. Install dependencies

```
npm install
```

4. Run the development server

```
npm run dev
```

5. Open in browser

```
http://localhost:5173
```

---

## Assumptions

* Authentication is simulated using LocalStorage
* No backend API is required for this assignment

---

## Future Improvements

* Edit task feature
* Drag-and-drop task management
