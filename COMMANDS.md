# 🚀 Commands Cheat Sheet

Quick reference for all available commands.

---

## ⚡ One-Time Setup

```bash
# Install everything
npm run install-all
```

---

## 🎯 Start Development

### Option 1: Start Everything (Recommended)
```bash
npm start
```
Starts both backend and frontend servers simultaneously.

### Option 2: Start with Auto-Reload
```bash
npm run dev
```
Same as `npm start` but with nodemon auto-reload for backend.

### Option 3: Start Only Backend
```bash
npm run start:backend
```
Backend only on `http://localhost:5000`

### Option 4: Start Only Frontend
```bash
npm run start:frontend
```
Frontend only on `http://localhost:5173`

---

## 🏗️ Building & Deployment

```bash
# Build frontend for production
npm run build

# Preview frontend build
npm run preview
```

---

## 🔍 Code Quality

```bash
# Lint frontend code
npm run lint

# Fix linting issues
npm run lint -- --fix
```

---

## Backend-Only Commands

From `backend/` directory:

```bash
npm start                    # Start backend
npm run dev                  # Start with nodemon
npm install                  # Install dependencies
```

---

## Frontend-Only Commands

From `frontend/` directory:

```bash
npm run dev                  # Start dev server
npm run build                # Build for production
npm run preview              # Preview production build
npm run lint                 # Lint code
npm install                  # Install dependencies
```

---

## 📁 Environment Variables

### Backend (backend/.env)
```
OPENAI_API_KEY=sk-xxx...
PORT=5000
NODE_ENV=development
```

### Frontend (frontend/.env)
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🔧 Useful Commands

### View Running Ports
```bash
lsof -i :5000    # Backend
lsof -i :5173    # Frontend
```

### Kill Processes on Port
```bash
kill -9 $(lsof -t -i :5000)    # Kill backend
kill -9 $(lsof -t -i :5173)    # Kill frontend
```

### Clear Data (Reset)
```bash
rm backend/data/*.json         # Delete all data
```

### View Project Files
```bash
tree -L 2                      # Show directory tree
```

---

## 💾 Full Workflow

```bash
# First time setup
npm run install-all
npm install
cp backend/.env.example backend/.env
# Edit backend/.env and add OPENAI_API_KEY

# Start development
npm start

# Build for production
npm run build

# Run production
npm run start:backend
# In another terminal:
cd frontend && npm run preview
```

---

## 🆘 Troubleshooting Commands

```bash
# Hard refresh browser
# Windows: Ctrl+F5
# Mac: Cmd+Shift+R

# Restart backend
cd backend
npm start

# Restart frontend
cd frontend
npm run dev

# Clear all node modules and reinstall
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install-all
```

---

## 📊 Version Check

```bash
node --version       # Should be 16+
npm --version        # Should be 8+
npm list             # List all dependencies
npm outdated         # Check for updates
```

---

**Happy coding! 🚀**
