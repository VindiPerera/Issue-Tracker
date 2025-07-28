# Issue Tracker

A full-stack CRUD application for managing issues with user authentication, built with Vite.js (frontend) and Express.js + MongoDB (backend).

## Live Demo
- **Frontend**:https://issue-tracker-o8tg71cue-vindipereras-projects.vercel.app

## Features
**Core Operations**  
o Create new issues with a title, description, and optional fields (e.g., 
severity, priority). 
o View a list of all issues with basic details (title, status, etc.). 
o View detailed information for a specific issue. 
o Edit and update existing issue details. 
o Mark issues as "Resolved" or "Closed." 

**User Authentication**  
- Login/Logout  
- Registration  

**Advanced Features**  
- Issue status tracking (Open/In Progress/Resolved/Closed)  
- Priority levels (Low/Medium/High/Critical)  

## Technologies
- **Frontend**: React, Vite.js, Tailwind CSS  
- **Backend**: Express.js, MongoDB (Mongoose)  
- **Authentication**: JWT  

## Setup Instructions

### 1. Backend Setup
```bash
cd server
npm install
npm start
### 2.frontend Setup
cd client
npm install
npm run dev
