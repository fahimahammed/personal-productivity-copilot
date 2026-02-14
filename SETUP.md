# 🚀 Quick Start Guide

Get the AI Task Execution Agent running in 5 minutes!

---

## ⚡ Option 1: Single Command Setup (Easiest)

### Step 1: Get OpenAI API Key

1. Visit [openai.com](https://platform.openai.com/api-keys)
2. Create an account or log in
3. Generate a new API key
4. Copy it

### Step 2: Setup & Run Everything

```bash
# From project root (ai-for-devs/)
npm run install-all

# Add your OpenAI API key
cp backend/.env.example backend/.env
nano backend/.env
# Add: OPENAI_API_KEY=sk-xxx...

# Install root dependencies (needed for concurrently)
npm install

# Start everything in one command
npm start
```

That's it! Both servers will start:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

**This is the fastest way! ⚡**

---

## Option 2: Manual Setup (Step-by-Step)

### Step 1: Get OpenAI API Key

1. Visit [openai.com](https://platform.openai.com/api-keys)
2. Create an account or log in
3. Generate a new API key
4. Copy it (you'll need it soon)

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your OpenAI API key
# On macOS/Linux editors:
nano .env
# Then paste: OPENAI_API_KEY=sk-your-key-here
# Save with Ctrl+X, then Y, then Enter

# Start backend server
npm start
```

You should see:
```
🚀 AI Task Agent running on http://localhost:5000
📁 Data storage: /path/to/backend/data
```

**Keep this terminal running!**

### Step 3: Frontend Setup (New Terminal)

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start frontend dev server
npm run dev
```

You should see:
```
  VITE v7.3.1  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

## Step 4: Open in Browser

Visit `http://localhost:5173` in your browser

You should see the **AI Task Execution Agent** interface!

## Step 5: Create Your First Goal

1. Click **"+ New Goal"** in the sidebar
2. Enter your goal: e.g., "Learn React basics" or "Master Python in 7 days"
3. Select duration: 3, 7, 14, 30, or 60 days
4. Click **"Create Goal"**

The AI agent will:
- ✨ Analyze your goal
- 📋 Generate daily tasks
- 🎯 Create success metrics
- 💪 Plan motivational approach

## Step 6: Start Tracking

1. You'll see your goal in the sidebar
2. Main area shows today's tasks
3. Complete tasks by clicking the checkbox
4. Watch your progress percentage grow
5. Click **"📊 Get Feedback"** for AI insights

## 📁 File Structure

Your data is stored in `backend/data/`:

```
backend/data/
├── goals.json      # Your goals
├── tasks.json      # All tasks
└── progress.json   # Progress tracking
```

(All JSON-based, no database needed!)

## 🔧 Troubleshooting

### "API Connection Failed"
- Make sure backend is running on port 5000
- Check that `.env` has `OPENAI_API_KEY` set
- Check console for error messages

### "Vite build failed"
- Delete `node_modules` and run `npm install` again
- Make sure you're in the `frontend` directory

### "OpenAI API Error"
- Double-check your API key is correct
- Make sure you have API credits
- Check rate limiting (restart server)

### Port Already in Use
- Backend: `lsof -i :5000` then `kill -9 <PID>`
- Frontend: `lsof -i :5173` then `kill -9 <PID>`

## 📚 Next Steps

1. **Create multiple goals** - Track different learning paths
2. **Use feedback** - Click "Get Feedback" for AI insights
3. **Check reminders** - Get personalized motivation
4. **Weekly reports** - See your progress summary

## 💡 Example Goals

Here are some goals you can try:

- "Learn React Hooks in 7 days"
- "Master Python basics in 14 days"
- "Build a fitness habit in 30 days"
- "Learn machine learning fundamentals in 60 days"
- "Improve English speaking in 21 days"

---

**Happy learning! 🎯✨**

Need help? Check the main [README.md](./README.md) for more details.
