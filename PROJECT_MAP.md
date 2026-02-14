# 📦 Project Structure & File Guide

## Complete File Inventory

```
ai-for-devs/
│
├── 📋 Documentation
│   ├── README.md          ← Main project documentation (READ THIS FIRST!)
│   ├── SETUP.md           ← Quick start guide (5-minute setup)
│   ├── FEATURES.md        ← Detailed agentic capabilities
│   └── PROJECT_MAP.md     ← This file
│
├── 🎨 Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    ← Reusable React components
│   │   │   ├── CreateGoal.jsx      (Goal creation form)
│   │   │   ├── Dashboard.jsx       (Main app dashboard)
│   │   │   ├── Evaluation.jsx      (AI feedback panel)
│   │   │   └── TaskList.jsx        (Task list component)
│   │   ├── App.jsx        ← Main app component
│   │   ├── App.css        ← Complete styling (400+ lines)
│   │   ├── index.css      ← Global styles
│   │   └── main.jsx       ← Vite entry point
│   ├── public/            ← Static assets
│   ├── index.html         ← HTML template
│   ├── package.json       ← Dependencies & scripts
│   ├── .env               ← Environment variables
│   ├── .env.example       ← Example env file
│   ├── vite.config.js     ← Vite configuration
│   └── eslint.config.js   ← Linting rules
│
├── 🔧 Backend (Express.js)
│   ├── server.js          ← Main server & API routes (140+ lines)
│   ├── ai-agent.js        ← OpenAI integration & agent logic (280+ lines)
│   ├── storage.js         ← JSON file-based persistence (160+ lines)
│   ├── package.json       ← Dependencies & scripts
│   ├── .env.example       ← Example env file
│   ├── .gitignore         ← Git ignore rules
│   └── data/              ← JSON storage directory
│       ├── goals.json     ← User goals
│       ├── tasks.json     ← Goal tasks
│       └── progress.json  ← Progress tracking
│
└── 🌍 Root Level
    ├── .gitignore
    └── package.json (optional, for monorepo)
```

---

## 📊 What Gets Built

### Backend Components

| File | Lines | Purpose |
|------|-------|---------|
| `server.js` | 150+ | Express server, API routes, request handling |
| `ai-agent.js` | 280+ | OpenAI API calls, agent logic, feedback generation |
| `storage.js` | 160+ | JSON file operations, CRUD for goals/tasks/progress |

### Frontend Components

| Component | Lines | Purpose |
|-----------|-------|---------|
| `App.jsx` | 120+ | Main app, state management, routing |
| `Dashboard.jsx` | 100+ | Goal details, task display, progress bar |
| `CreateGoal.jsx` | 60+ | Goal creation form |
| `Evaluation.jsx` | 90+ | AI feedback panel, reminders |
| `TaskList.jsx` | 30+ | Reusable task list component |
| `App.css` | 600+ | Complete responsive styling |

### Data Storage

| File | Type | Purpose |
|------|------|---------|
| `goals.json` | JSON | Stores user goals, plans, and metadata |
| `tasks.json` | JSON | Stores all daily tasks for all goals |
| `progress.json` | JSON | Stores completion tracking and history |

---

## 🔌 API Endpoints

### Goal Management
```
POST   /api/goals              Create a new goal (with AI planning)
GET    /api/goals              Get all goals
GET    /api/goals/:goalId      Get goal with tasks & progress
```

### Task Management
```
GET    /api/goals/:goalId/tasks         Get all tasks for a goal
PATCH  /api/tasks/:taskId               Mark task complete/incomplete
```

### Progress & Feedback
```
GET    /api/goals/:goalId/progress      Get progress history
POST   /api/goals/:goalId/evaluate      Get AI evaluation
POST   /api/goals/:goalId/reminder      Get personalized reminder
POST   /api/goals/:goalId/weekly-report Get weekly summary
```

---

## 🧠 AI Agent Capabilities

### 1. Goal Planning
```
Input:  Goal text + duration
Output: Structured plan with tasks, milestones, success metrics
Engine: GPT-4o-mini with specialized prompting
```

### 2. Progress Evaluation
```
Input:  Goal info + completion stats
Output: Analysis, encouragement, next action, tips
Engine: GPT-4o-mini with context-aware prompting
```

### 3. Reminder Generation
```
Input:  Goal info + last completion date
Output: Personalized, non-judgmental reminder
Engine: GPT-4o-mini with motivational prompting
```

### 4. Weekly Reports
```
Input:  Goal info + weekly completion data
Output: Summary, what went well, challenges, preview
Engine: GPT-4o-mini with analytical prompting
```

---

## 🎨 Frontend Features

### Dashboard Layout
```
┌─────────────────────────────────────┐
│         Header (AI Task Agent)       │
├──────────────┬──────────────────────┤
│              │                      │
│   Sidebar    │    Main Content      │
│              │                      │
│ - Goals      │  - Goal Title        │
│   List       │  - Progress Circle   │
│ - Create     │  - Today's Tasks     │
│   Button     │  - All Tasks Grid    │
│              │  - Plan Details      │
│              │  - AI Feedback       │
│              │                      │
└──────────────┴──────────────────────┘
```

### Responsive Design
- Desktop: 2-column layout (sidebar + content)
- Tablet: Stacked layout, optimized spacing
- Mobile: Full-width, touch-friendly buttons

### Color Scheme
- Primary: Blue gradient (#3b82f6 → #6366f1)
- Success: Green (#10b981) for completed tasks
- Backgrounds: Light gray (#f9fafb)
- Text: Dark gray (#111827)

---

## 📦 Dependencies

### Backend
```
express: 4.18.2         - Web framework
openai: 4.26.0          - ChatGPT API
cors: 2.8.5             - Cross-origin requests
dotenv: 16.3.1          - Environment variables
nodemon: 3.0.2 (dev)    - Auto-reload
```

### Frontend
```
react: 19.2.0           - UI library
react-dom: 19.2.0       - React DOM rendering
vite: 7.3.1             - Build tool
@vitejs/plugin-react-swc: 4.2.2
```

---

## 🚀 How to Run

### Quick Start
```bash
# Terminal 1: Backend
cd backend
npm install
cp .env.example .env   # Add your OpenAI key
npm start              # Runs on http://localhost:5000

# Terminal 2: Frontend
cd frontend
npm install
npm run dev            # Runs on http://localhost:5173
```

### Production Build
```bash
# Frontend
npm run build          # Creates dist/ folder

# Backend
npm start              # Ready for deployment
```

---

## 📝 Environment Setup

### Backend .env
```
OPENAI_API_KEY=sk-xxx...     # Required: Your OpenAI API key
PORT=5000                     # Optional: Server port
NODE_ENV=development          # Optional: Environment
```

### Frontend .env
```
VITE_API_URL=http://localhost:5000/api    # API endpoint
```

---

## 🔐 Security Notes

- ✅ API key stored in backend .env only
- ✅ Frontend doesn't expose API keys
- ✅ CORS enabled for local development
- ✅ No authentication needed (local use)
- ✅ JSON storage is local (no cloud)

**For production:**
- [ ] Add user authentication
- [ ] Implement rate limiting
- [ ] Use HTTPS
- [ ] Add database encryption
- [ ] Set up proper CORS rules

---

## 📊 Data Flow

### Creating a Goal
```
User Input
    ↓
Frontend: POST /api/goals
    ↓
Backend: server.js receives request
    ↓
AI Agent: ai-agent.js analyzes goal
    ↓
OpenAI API: GPT-4o-mini generates plan
    ↓
Storage: storage.js saves goals & tasks
    ↓
Response: Plan + tasks back to frontend
    ↓
Frontend: Display plan and tasks
```

### Completing a Task
```
User Clicks Checkbox
    ↓
Frontend: PATCH /api/tasks/:taskId
    ↓
Backend: Updates task completion
    ↓
Storage: Updates goals.json, tasks.json, progress.json
    ↓
Response: Updated task + progress back to frontend
    ↓
Frontend: Update UI with new progress
```

### Requesting Feedback
```
User Clicks "Get Feedback"
    ↓
Frontend: POST /api/goals/:goalId/evaluate
    ↓
Backend: Gathers goal + progress data
    ↓
AI Agent: Sends context to OpenAI
    ↓
OpenAI API: Generates evaluation + feedback
    ↓
Response: Feedback back to frontend
    ↓
Frontend: Display in evaluation panel
```

---

## 🧩 Component Relationships

```
App.jsx
├── Sidebar
│   ├── CreateGoal.jsx
│   └── Goals List
│
└── MainContent
    └── Dashboard.jsx
        ├── Header
        ├── Evaluation.jsx
        ├── Progress Circle
        ├── TaskList.jsx
        └── TaskGrid
```

---

## 📈 File Statistics

| Category | Count | Lines |
|----------|-------|-------|
| Backend Files | 3 | 600+ |
| Frontend Components | 5 | 500+ |
| CSS Files | 2 | 700+ |
| Data Storage | 3 | (dynamic) |
| JSON Config | 4 | 100+ |
| **Total** | **20** | **1900+** |

---

## ✨ Key Features Summary

✅ **Goal Management** - Create and track multiple goals  
✅ **AI Planning** - Automatic structured task generation  
✅ **Progress Tracking** - Real-time completion status  
✅ **Smart Feedback** - AI-generated evaluations  
✅ **Reminders** - Personalized motivation  
✅ **Weekly Reports** - Progress summaries  
✅ **JSON Storage** - No database required  
✅ **Responsive Design** - Works on all devices  
✅ **Modern UI** - Clean, intuitive interface  
✅ **Agentic** - True decision-making, not just chat  

---

## 🎯 Next Steps

1. **Setup**: Follow [SETUP.md](./SETUP.md)
2. **Understand**: Read [README.md](./README.md)
3. **Learn Features**: Check [FEATURES.md](./FEATURES.md)
4. **Create Goals**: Start using the app!
5. **Extend**: Add your own features

---

Built with ❤️ for your productivity. 🚀✨
