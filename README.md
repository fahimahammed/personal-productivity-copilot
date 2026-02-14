# 🚀 AI Task Execution Agent - Personal Productivity Copilot

A truly **agentic** AI system that doesn't just chat—it **plans, decides, evaluates, and adapts** to help you achieve your goals in structured time periods.

## 🎯 What Makes This Agentic?

Unlike traditional chatbots, this agent:

✅ **Plans**: Analyzes your goal and creates a structured multi-day/week plan  
✅ **Generates Tasks**: Creates daily actionable tasks with descriptions  
✅ **Evaluates Progress**: Assesses your completion rate and milestones  
✅ **Makes Decisions**: Chooses between encouragement or gentle nudge based on progress  
✅ **Remembers Context**: Stores everything in JSON files for persistent memory  
✅ **Provides Feedback**: Weekly reports and personalized recommendations  

This is a **decision engine**, not a chatbot.

---

## 🏗️ Architecture

```
ai-for-devs/
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── components/       # Dashboard, CreateGoal, TaskList, Evaluation
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── backend/                  # Express.js
    ├── server.js             # Main server
    ├── storage.js            # JSON file storage
    ├── ai-agent.js           # OpenAI integration & agent logic
    ├── package.json
    ├── .env.example
    └── data/                 # JSON storage
        ├── goals.json
        ├── tasks.json
        └── progress.json
```

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 16+ (with npm or pnpm)
- OpenAI API key

### ⚡ Quick Setup (Single Command)

```bash
# Install all dependencies (frontend + backend)
npm run install-all

# Add your OpenAI API key
cp backend/.env.example backend/.env
# Edit backend/.env and add: OPENAI_API_KEY=sk-xxx...

# Start everything in one command
npm start
```

**Frontend**: `http://localhost:5173`  
**Backend**: `http://localhost:5000`

### Available Root Commands

```bash
npm run install-all          # Install all dependencies
npm start                    # Start both servers
npm run dev                  # Start with auto-reload
npm run start:backend        # Start only backend
npm run start:frontend       # Start only frontend
npm run build                # Build frontend for production
npm run lint                 # Lint frontend code
```

### Manual Setup (Original Method)

#### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Add your OpenAI API key to .env
# OPENAI_API_KEY=sk-xxx...

# Start the server
npm start
# or for development with auto-reload:
npm run dev
```

Backend runs on `http://localhost:5000`

#### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 📝 API Endpoints

### Goals
- `POST /api/goals` - Create new goal (triggers AI planning)
- `GET /api/goals` - Get all goals
- `GET /api/goals/:goalId` - Get goal with tasks and progress

### Tasks
- `GET /api/goals/:goalId/tasks` - Get tasks for a goal
- `PATCH /api/tasks/:taskId` - Mark task as complete/incomplete

### Progress & Feedback
- `GET /api/goals/:goalId/progress` - Get progress history
- `POST /api/goals/:goalId/evaluate` - Get AI evaluation and feedback
- `POST /api/goals/:goalId/reminder` - Get personalized reminder
- `POST /api/goals/:goalId/weekly-report` - Get weekly performance report

---

## 💡 How It Works

### 1. Create a Goal
```
User: "Ami 7 din er moddhe React basics shikhte chai"
```

### 2. AI Agent Analyzes
- Breaks down React into learning phases
- Creates 7 structured daily tasks
- Defines success metrics and challenges
- Plans motivational approach

### 3. Track Progress
- Complete daily tasks as you learn
- See real-time progress percentage
- Get AI-powered feedback when requested

### 4. Get Smart Feedback
- **Evaluation**: Performance analysis + encouragement + next steps
- **Reminder**: If you haven't completed tasks, get a caring nudge
- **Weekly Report**: Summary of week's progress + next week preview

### 5. JSON Storage
All data persists in JSON files:
```json
// goals.json
[
  {
    "id": "1707932400000",
    "title": "Learn React Basics",
    "durationDays": 7,
    "status": "active",
    "createdAt": "2026-02-14T...",
    "plan": { ... }
  }
]

// tasks.json
[
  {
    "id": "1707932400000-0-...",
    "goalId": "1707932400000",
    "day": 1,
    "title": "Foundation - Setup & Components",
    "completed": true
  }
]

// progress.json
[
  {
    "goalId": "1707932400000",
    "completedTasks": 3,
    "totalTasks": 7,
    "progressPercentage": 42.8,
    "timestamp": "2026-02-14T..."
  }
]
```

---

## 🎨 Frontend Features

- **Goal Management**: Create and manage multiple goals
- **Task Tracking**: Visual task cards with completion status
- **Progress Dashboard**: Real-time progress circle and bar
- **AI Feedback Panel**: Get evaluation, reminders, and weekly reports
- **Responsive Design**: Works on desktop and mobile
- **Clean UI**: Modern design with gradient backgrounds and smooth transitions

---

## 🧠 AI Agent Capabilities

The agent uses OpenAI's GPT-4o-mini model to:

1. **Plan Creation** - Analyzes goal and creates structured daily tasks
2. **Progress Evaluation** - Compares completed vs expected tasks, provides feedback
3. **Reminder Generation** - Creates personalized reminders based on inactivity
4. **Weekly Reports** - Summarizes progress and motivates for next week

---

## 📊 Example: 7-Day React Learning Goal

**AI Creates:**
- Milestones: Foundation → Practice → Mastery
- Daily Tasks: Components, JSX, State, Props, Hooks, Projects
- Success Metrics: Complete all tasks, understand concepts, build project
- Motivational Approach: Hands-on learning with practical examples

**User Completes:**
- Days 1-3: 100% complete
- Days 4-7: In progress (42% overall)

**AI Feedback:**
- Analysis: "Great start! You're learning JSX and components well."
- Encouragement: "Day 5 is about state management—this is where React gets powerful!"
- Next Action: "Complete today's state and hooks task"
- Tip: "Use React DevTools to inspect component state"

---

## 🚀 Future Enhancements

- [ ] Cron jobs for automatic reminders
- [ ] Email notifications for reminders
- [ ] Database migration (PostgreSQL/MongoDB)
- [ ] User authentication
- [ ] Multiple goals per user
- [ ] Team collaboration
- [ ] Mobile app
- [ ] Analytics dashboard

---

## 📄 License

MIT

---

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

Build your productivity system with AI! 🎯✨
