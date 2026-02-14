# 👨‍💻 Developer Guide

Quick reference for developers working with the AI Task Execution Agent.

---

## 🧠 Understanding the Architecture

### Three Main Layers

```
┌─ Frontend Layer ─────────────────────────────────┐
│ React Components (Dashboard, Tasks, Feedback)   │
│ Vite build system                               │
│ Local state management                          │
└────────────────────────────────────────────────┘
                      ↓↑ HTTP
┌─ API Layer ──────────────────────────────────────┐
│ Express.js server                               │
│ Route handlers                                  │
│ Request validation                              │
└────────────────────────────────────────────────┘
                      ↓↑ Function calls
┌─ Agent Layer ────────────────────────────────────┐
│ OpenAI API integration                          │
│ Prompt engineering                              │
│ Response parsing                                │
└────────────────────────────────────────────────┘
                      ↓↑ File I/O
┌─ Storage Layer ──────────────────────────────────┐
│ JSON file operations                            │
│ CRUD operations                                 │
│ Data persistence                                │
└────────────────────────────────────────────────┘
```

---

## 📂 Backend Architecture Deep Dive

### File: `server.js` (Express Server)

**Responsibility**: HTTP server, route handling, API endpoints

**Key Sections**:
```javascript
// 1. Initialization
require('dotenv').config()
const express = require('express')
const cors = require('cors')

// 2. Middleware
app.use(cors())
app.use(express.json())

// 3. API Routes (7 endpoints)
// - POST /api/goals           (Create goal + AI plan)
// - GET /api/goals            (List all goals)
// - GET /api/goals/:goalId    (Get goal details)
// - GET /api/goals/:goalId/tasks        (List tasks)
// - PATCH /api/tasks/:taskId  (Update task)
// - POST /api/goals/:goalId/evaluate    (Get feedback)
// - POST /api/goals/:goalId/reminder    (Get reminder)
```

**Flow Example - Creating a Goal**:
```javascript
app.post('/api/goals', async (req, res) => {
  1. Extract title & durationDays from request
  2. Call aiAgent.analyzeGoal(title, durationDays)
  3. Save goal using storage.saveGoal()
  4. Save tasks using storage.saveTasks()
  5. Initialize progress
  6. Return to frontend
})
```

---

### File: `ai-agent.js` (Brain of the Agent)

**Responsibility**: All AI decision-making and prompt engineering

**Key Functions**:

#### 1. `analyzeGoal(goalText, durationDays)`
```javascript
- Input: Goal text + duration
- Creates prompt for GPT-4o-mini
- Requests: milestones, daily tasks, success metrics, challenges
- Output: Structured plan object
```

#### 2. `evaluateProgress(goal, completedTasks, totalTasks, days)`
```javascript
- Input: Goal + completion stats
- Calculates: completion rate, on-track status
- Creates evaluation prompt
- Output: Analysis, encouragement, next action, tip
```

#### 3. `generateReminder(goal, lastCompletedDay)`
```javascript
- Input: Goal + last completion timestamp
- Calculates: days since completion
- Creates reminder prompt
- Output: Personalized reminder message
```

#### 4. `generateWeeklyReport(goal, week, tasksCompleted, totalWeekTasks)`
```javascript
- Input: Goal + weekly stats
- Calculates: weekly progress percentage
- Creates weekly report prompt
- Output: Summary of week, improvements, preview
```

**Error Handling**: All functions have fallback responses if OpenAI API fails.

---

### File: `storage.js` (Data Persistence)

**Responsibility**: All file-based data operations

**Data Structure**:
```javascript
storage = {
  // Goals CRUD
  saveGoal(goal)           // Save or update goal
  getAllGoals()            // Get all goals
  getGoal(goalId)          // Get single goal
  deleteGoal(goalId)       // Delete goal

  // Tasks CRUD
  saveTasks(goalId, tasks) // Save tasks for goal
  getAllTasks()            // Get all tasks
  getTasksByGoal(goalId)   // Get tasks for specific goal
  updateTask(taskId, updates) // Update task completion

  // Progress CRUD
  saveProgress(goalId, progress)   // Save progress
  getAllProgress()                 // Get all progress records
  getProgressByGoal(goalId)        // Get progress for goal
}
```

**Storage Format**:
```
backend/data/
├── goals.json      [{id, title, durationDays, plan, status, createdAt}]
├── tasks.json      [{id, goalId, day, title, description, completed}]
└── progress.json   [{goalId, completedTasks, totalTasks, progressPercentage}]
```

---

## 🎨 Frontend Architecture Deep Dive

### File: `App.jsx` (Main Component)

**Responsibility**: App-level state, API calls, routing logic

**State Management**:
```javascript
const [goals, setGoals]                    // All user goals
const [selectedGoal, setSelectedGoal]      // Currently selected goal
const [showCreateGoal, setShowCreateGoal]  // Modal visibility
const [loading, setLoading]                // Loading state
```

**Key Functions**:
```javascript
fetchGoals()                   // Load all goals from API
handleCreateGoal(goalData)     // POST new goal
handleTaskComplete(taskId)     // PATCH task completion
fetchGoalDetails(goalId)       // Load goal details
```

**Data Flow**:
```
1. Component mounts → fetchGoals()
2. User creates goal → handleCreateGoal()
3. User completes task → handleTaskComplete()
4. User selects goal → fetchGoalDetails()
```

---

### Component: `Dashboard.jsx`

**Responsibility**: Goal details, task display, progress visualization

**Props**:
```javascript
goal         // Current goal object
onTaskComplete  // Callback for task completion
onRefresh    // Callback to refresh goal data
apiUrl       // Backend API URL
```

**Key Sections**:
1. **Header**: Goal title, meta info, feedback button
2. **Evaluation Panel**: AI feedback (conditional)
3. **Progress Overview**: Circle + bar visualization
4. **Today's Tasks**: Quick access to today's tasks
5. **All Tasks Grid**: Card-based task display
6. **Plan Overview**: Goals, metrics, challenges

---

### Component: `CreateGoal.jsx`

**Responsibility**: Goal creation form

**Inputs**:
```javascript
title           // Goal description
durationDays   // Select from 3/7/14/30/60
```

**Validation**:
- Title must not be empty
- Duration must be valid

---

### Component: `Evaluation.jsx`

**Responsibility**: Display AI feedback

**API Calls**:
1. `POST /api/goals/:goalId/evaluate` → Get evaluation
2. `POST /api/goals/:goalId/reminder` → Get reminder

**Displays**:
- Analysis
- Encouragement
- Next Action
- Tips
- Reminders

---

### Component: `TaskList.jsx`

**Responsibility**: Reusable task list display

**Props**:
```javascript
tasks           // Array of tasks to display
onTaskComplete  // Callback for checkbox
```

---

## 🔌 API Integration

### Example: Creating a Goal

**Frontend Code**:
```javascript
const response = await fetch(`${API_URL}/goals`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title, durationDays }),
})
const data = await response.json()
// data = { goal, tasks, message }
```

**Backend Execution**:
```javascript
1. server.js receives POST /api/goals
2. Extracts title & durationDays
3. Calls aiAgent.analyzeGoal(title, durationDays)
4. aiAgent calls OpenAI API with prompt
5. Parses response into plan object
6. storage.saveGoal() saves to goals.json
7. storage.saveTasks() saves to tasks.json
8. Returns { goal, tasks } to frontend
```

**Response Format**:
```javascript
{
  goal: {
    id: "1234567890",
    title: "Learn React Basics",
    durationDays: 7,
    plan: { milestones, dailyTasks, successMetrics, challenges },
    status: "active",
    createdAt: "2026-02-14T..."
  },
  tasks: [
    { id: "...", day: 1, title: "...", description: "..." },
    ...
  ],
  message: "Goal created successfully!"
}
```

---

## 🎨 Styling System

### CSS Variables (App.css)
```css
:root {
  --primary: #3b82f6;         /* Main blue */
  --secondary: #6366f1;       /* Secondary purple */
  --success: #10b981;         /* Green for success */
  --gray-50 to --gray-900;    /* Gray scale */
}
```

### Component Classes
```
.sidebar              /* Left sidebar */
.goal-item            /* Goal in sidebar */
.dashboard            /* Main content area */
.task-card            /* Task display */
.progress-circle      /* Progress visualization */
.btn-primary          /* Primary buttons */
.evaluation-panel     /* AI feedback panel */
```

---

## 🔐 Error Handling

### Backend Error Handling
```javascript
try {
  // API call
  const response = await client.chat.completions.create(...)
} catch (error) {
  // Log error
  console.error('Error:', error)
  // Return fallback response
  return { fallback: "Default response" }
}
```

### Frontend Error Handling
```javascript
try {
  const response = await fetch(url)
  const data = await response.json()
} catch (error) {
  console.error('Error:', error)
  alert('Failed to fetch. Check console.')
}
```

---

## 🚀 How to Extend

### Add New Goal Type

1. **Backend**: Update `ai-agent.js` with new prompt
2. **Add API endpoint** in `server.js`
3. **Frontend**: Create new component
4. **Connect**: Wire up in `App.jsx`

### Add New Feedback Type

1. **Backend**: Add function to `ai-agent.js`
2. **Create endpoint** in `server.js`
3. **Frontend**: Add to `Evaluation.jsx`
4. **Test**: Verify with API

### Change AI Model

```javascript
// In ai-agent.js
const response = await client.chat.completions.create({
  model: 'gpt-4',  // Change from gpt-4o-mini
  messages: [...]
})
```

---

## 🧪 Testing Tips

### Test With curl
```bash
# Create goal
curl -X POST http://localhost:5000/api/goals \
  -H "Content-Type: application/json" \
  -d '{"title":"Learn Node.js","durationDays":7}'

# Get goals
curl http://localhost:5000/api/goals

# Evaluate
curl -X POST http://localhost:5000/api/goals/GOAL_ID/evaluate
```

### Test Frontend Locally
1. Open DevTools (F12)
2. Check Network tab for API calls
3. Check Console for errors
4. Use React DevTools for component debugging

---

## 📚 Key Concepts

### Agentic vs Chatbot
- **Chatbot**: Responds to user input
- **Agent**: Proactively plans, evaluates, and adapts

### Prompt Engineering
- Each AI call uses specialized prompts
- See `ai-agent.js` for prompt examples
- Modify prompts to change AI behavior

### State Persistence
- Data stored in JSON files
- No database needed
- Easy to debug and inspect

### From Stateless Chat to Stateful Agent
The agent **remembers context** across API calls because data is persisted and fetched with each evaluation.

---

## 🐛 Debugging

### Enable Verbose Logging
```javascript
// In server.js
console.log('Received request:', req.body)
console.log('AI response:', response)
console.log('Saved data:', storage.getGoal(goalId))
```

### Check Data Files
```bash
# View goals.json
cat backend/data/goals.json | jq

# View tasks.json
cat backend/data/tasks.json | jq

# View progress.json
cat backend/data/progress.json | jq
```

### Network Debugging
1. Open DevTools Network tab
2. Sort by request type (XHR)
3. Click each request to see payload
4. Check response for errors

---

## 📖 Useful Commands

```bash
# Backend
npm start              # Start server
npm run dev            # Start with nodemon
npm install            # Install deps

# Frontend
npm run dev            # Start dev server
npm run build          # Build for production
npm run lint           # Run eslint

# Debugging
node server.js --inspect  # Debug backend
# Then open chrome://inspect

# Data Management
rm backend/data/*.json     # Clear all data
git checkout backend/data  # Restore data
```

---

## 🎯 Best Practices

1. **Keep prompts focused** - AI works better with specific, clear prompts
2. **Always validate user input** - Check title, duration, etc.
3. **Handle errors gracefully** - Provide fallback responses
4. **Log important events** - Track goal creation, evaluations
5. **Test before deploying** - Verify API calls and data persistence
6. **Comment complex logic** - Help future developers understand
7. **Use meaningful variable names** - `completedCount` vs `cc`
8. **Keep components small** - Each component has one job

---

**Happy coding! 🚀✨**
