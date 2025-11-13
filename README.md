# DoodleHub - A Realtime Whiteboard
Team: CodeCrafters  
Members: Tanya Sharma & Udit Raj Singh

DoodleHub is a realtime collaborative whiteboard built using React, Node.js, Socket.IO, and the HTML5 Canvas API.  
Multiple users can draw, edit, and interact together on a shared canvas with live updates.  
This project is built as a major project for college and demonstrates realtime communication, frontend rendering, backend events, and full deployment.

## Features

- Live realtime drawing using Socket.IO
- Collaborative multi-user whiteboard
- Cursor sharing and movement tracking
- Add, move, resize, and update shapes
- Freehand drawing (pencil tool)
- Clear board for all users
- State synchronization when a new user joins
- Modular React component architecture
- Redux-based state management
- Node.js backend with events and broadcasting
- Ready for adding room system, brush size, and color picker

## Tech Stack

### Frontend
- React.js
- Redux Toolkit
- HTML5 Canvas API
- JavaScript (ES6+)

### Backend
- Node.js
- Express.js
- Socket.IO

### Tools and Others
- Git and GitHub
- Render (deployment)
- VS Code

## Folder Structure

project-root/  
├── my-app/ # React frontend  
│ ├── src/  
│ ├── public/  
│ ├── package-lock.json  
│ └── package.json  
│  
├── server/ # Node.js + Socket.IO backend  
│ ├── index.js  
│ ├── package-lock.json  
│ └── package.json  
│  
├── .gitignore  
└── README.md  

## How It Works

- When a user draws, edits, or moves an element, the client emits a socket event.  
- The backend receives the event and broadcasts it to all other connected clients.  
- The whiteboard updates instantly for all users.  
- When a new user joins, the server sends the current whiteboard state to them.  
- Cursor positions are shared using separate socket events for smooth real-time collaboration.

## Getting Started (Local Development)

### 1. Run the Backend
```bash
cd server
npm install
node index.js
```

### 2. Run the Frontend
```bash
cd my-app
npm install
npm start
```

Frontend: http://localhost:3000  
Backend: http://localhost:3003

## Future Enhancements

- Room creation and join-room feature
- User authentication and display names
- Brush size and color picker
- Smooth pencil tool (perfect-freehand integration)
- Undo/Redo support
- Save board as PNG / persistent sessions (MongoDB or Firebase)
- Realtime chat section

## Project status

DoodleHub is currently in active development.  
Core realtime drawing and syncing are implemented locally.  
Upcoming goals include room support, UI polish, and advanced drawing tools.
