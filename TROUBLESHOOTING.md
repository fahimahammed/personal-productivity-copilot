# 🔧 Troubleshooting Guide

Solutions for common issues when setting up and running the AI Task Execution Agent.

---

## ❌ Backend Issues

### Issue 1: "Cannot find module 'express'"

**Symptoms**:
```
Error: Cannot find module 'express'
```

**Solutions**:
```bash
# 1. Make sure you're in backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Verify node_modules folder exists
ls -la node_modules
```

---

### Issue 2: "Port 5000 already in use"

**Symptoms**:
```
Error: listen EADDRINUSE :::5000
```

**Solutions**:
```bash
# Find what's using port 5000
lsof -i :5000

# Kill the process (replace 12345 with PID)
kill -9 12345

# Or use different port
PORT=5001 npm start

# Or on Windows
netstat -ano | findstr :5000
taskkill /PID 12345 /F
```

---

### Issue 3: "OPENAI_API_KEY is not set"

**Symptoms**:
```
Error: The OPENAI_API_KEY environment variable is not set
```

**Solutions**:
```bash
# 1. Check if .env file exists
ls -la backend/.env

# 2. If not, create it
cp backend/.env.example backend/.env

# 3. Edit .env and add your key
nano backend/.env

# Add this line:
# OPENAI_API_KEY=sk-xxx...

# 4. Save and restart server
npm start
```

**Finding Your API Key**:
1. Go to https://platform.openai.com/api-keys
2. Login with your OpenAI account
3. Click "Create new secret key"
4. Copy it immediately (you won't see it again!)

---

### Issue 4: "Invalid API key"

**Symptoms**:
```
Error: Incorrect API key provided
```

**Solutions**:
1. Double-check your API key has no extra spaces or characters
2. Verify it starts with `sk-`
3. Make sure you didn't accidentally commit it to git
4. Regenerate a new key if unsure
5. Check API key is for the right organization

```bash
# Verify key format
cat backend/.env | grep OPENAI_API_KEY
# Should show: OPENAI_API_KEY=sk-xxxxxxx (no quotes)
```

---

### Issue 5: "data folder not found"

**Symptoms**:
```
Error: ENOENT: no such file or directory, open '/.../backend/data/goals.json'
```

**Solutions**:
```bash
# Create and navigate to backend
cd backend

# Create data folder
mkdir -p data

# Verify it was created
ls -la data

# Or let the app create it by restarting
npm start
```

---

### Issue 6: "CORS error" (from frontend)

**Symptoms**:
```
Access to XMLHttpRequest at 'http://localhost:5000/...' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solutions**:
```bash
# 1. Verify server is running
curl http://localhost:5000/api/goals

# 2. Check CORS is enabled in server.js
# Should have: app.use(cors())

# 3. Restart both servers
# Backend: Ctrl+C then npm start
# Frontend: Ctrl+C then npm run dev

# 4. In development, ensure:
# - Backend on port 5000
# - Frontend on port 5173
# - .env has VITE_API_URL=http://localhost:5000/api
```

---

### Issue 7: "API response parsing error"

**Symptoms**:
```
Error parsing AI response: SyntaxError: Unexpected token
```

**Solutions**:
1. Check OpenAI API status at status.openai.com
2. Verify your API key has correct permissions
3. Check rate limiting

```bash
# Add debug logging in ai-agent.js
console.log('AI Response:', response.choices[0].message.content)

# Then restart and check console output
npm start
```

---

## ❌ Frontend Issues

### Issue 1: "Cannot find module 'react'"

**Symptoms**:
```
Error: Cannot find module 'react'
```

**Solutions**:
```bash
# 1. Make sure you're in frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Verify node_modules exists
ls -la node_modules/react
```

---

### Issue 2: "Port 5173 already in use"

**Symptoms**:
```
error when starting dev server:
Error: listen EADDRINUSE: address already in use :::5173
```

**Solutions**:
```bash
# Find and kill the process
lsof -i :5173
kill -9 <PID>

# Or let Vite use a different port
npm run dev
# It will auto-use 5174, 5175, etc.
```

---

### Issue 3: "Blank page, nothing shows up"

**Symptoms**:
- Page loads but appears blank
- No error in console
- No content visible

**Solutions**:
```bash
# 1. Check if app is actually running
curl http://localhost:5173

# 2. Check browser console (F12)
# Look for any error messages

# 3. Hard refresh the page
# Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

# 4. Clear browser cache
# Settings → Privacy → Clear browsing data

# 5. Restart dev server
# Ctrl+C then npm run dev

# 6. Check network in DevTools
# Make sure API calls are being made
# Should see requests to http://localhost:5000/api
```

---

### Issue 4: "Cannot connect to backend"

**Symptoms**:
```
Error fetching goals: Failed to fetch
API Connection Failed
```

**Solutions**:
```bash
# 1. Verify backend is running
curl http://localhost:5000/api/goals
# Should return: []

# 2. Check API URL in frontend
# Frontend/.env should have:
# VITE_API_URL=http://localhost:5000/api

# 3. Check frontend App.jsx
# Should have: const API_URL = import.meta.env.VITE_API_URL || '...'

# 4. Verify both are on localhost (not 127.0.0.1 or IPs)

# 5. Check CORS is enabled in backend
# server.js should have: app.use(cors())

# 6. Restart both servers
```

---

### Issue 5: "Tasks not updating"

**Symptoms**:
- Click checkbox but task doesn't mark as complete
- Progress bar doesn't update
- No error messages

**Solutions**:
```bash
# 1. Check DevTools Network tab
# Click checkbox and watch Network tab
# Should see PATCH request to /api/tasks/:id
# Response should be 200 OK

# 2. Verify backend is writing to files
cat backend/data/tasks.json | jq '.[0]'
# Should show completed: true/false

# 3. Restart both servers
# Sometimes state gets out of sync

# 4. Clear browser cache
# Ctrl+F5 or Cmd+Shift+R
```

---

### Issue 6: "Vite build errors"

**Symptoms**:
```
SyntaxError: Unexpected token '}'
Failed to compile
```

**Solutions**:
```bash
# 1. Check for syntax errors in your files
# Look at the error line number

# 2. Clear node_modules and reinstall
rm -rf node_modules
npm install

# 3. Check for conflicting imports
# Ensure all imports are correct

# 4. Verify file names match imports
# JavaScript is case-sensitive!
# If file is "MyComponent.jsx", import should be "./MyComponent"
# Not "./mycomponent"

# 5. Restart dev server
npm run dev
```

---

### Issue 7: "API returns 500 error"

**Symptoms**:
```
Error: 500 Internal Server Error
```

**Solutions**:
```bash
# 1. Check backend console for error
# It should show the exact error message

# 2. Common causes:
# - OpenAI API error (invalid key)
# - File system error (no write permission)
# - Invalid JSON parsing

# 3. Check backend logs
# Run with debug flag:
NODE_DEBUG=* npm start

# 4. Test API manually with curl
curl -X POST http://localhost:5000/api/goals \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","durationDays":7}'

# 5. Check permissions on data folder
chmod 755 backend/data
```

---

## ❌ Data Issues

### Issue 1: "Goals not persisting"

**Symptoms**:
- Create goal, refresh page, goal is gone
- Data doesn't save

**Solutions**:
```bash
# 1. Check if data folder exists and is writable
ls -la backend/data
chmod 755 backend/data

# 2. Check permissions on JSON files
chmod 644 backend/data/*.json

# 3. Verify data is being saved
cat backend/data/goals.json
# Should see your goal data

# 4. Check for errors in console
# Look for file system errors

# 5. Ensure backend has write access to data folder
# On Mac/Linux: chmod -R 755 backend/data
```

---

### Issue 2: "Corrupted JSON files"

**Symptoms**:
```
SyntaxError: Unexpected token in JSON
Invalid JSON in goals.json
```

**Solutions**:
```bash
# 1. View the corrupted file
cat backend/data/goals.json

# 2. Fix manually if small
# Edit and ensure valid JSON

# 3. Or reset all data
rm backend/data/*.json
# Restart server to regenerate

# 4. Validate JSON is correct
cat backend/data/goals.json | jq
# If valid, will pretty-print the JSON
# If invalid, will show error

# 5. Backup before attempting recovery
cp backend/data/goals.json backend/data/goals.json.bak
```

---

### Issue 3: "Progress not updating"

**Symptoms**:
- Complete tasks but progress % doesn't change
- Progress circles shows 0%

**Solutions**:
```bash
# 1. Check progress.json file
cat backend/data/progress.json | jq

# 2. Manually update if needed
# Edit backend/data/progress.json

# 3. Verify task completion is saved
cat backend/data/tasks.json | jq '.[] | select(.completed == true)'

# 4. Restart backend to recalculate
npm start

# 5. Hard refresh frontend
# Ctrl+F5 or Cmd+Shift+R
```

---

## ❌ Network Issues

### Issue 1: "localhost not resolving"

**Symptoms**:
```
getaddrinfo ENOTFOUND localhost
Network request failed
```

**Solutions**:
```bash
# 1. Verify localhost is in /etc/hosts
cat /etc/hosts | grep localhost
# Should show: 127.0.0.1 localhost

# 2. On Mac/Linux, add if missing
sudo nano /etc/hosts
# Add: 127.0.0.1 localhost

# 3. Try 127.0.0.1 instead
# In .env: VITE_API_URL=http://127.0.0.1:5000/api

# 4. Restart your machine (nuclear option)
```

---

### Issue 2: "API timeouts"

**Symptoms**:
```
Timeout: requests taking too long
Connection timeout
```

**Solutions**:
```bash
# 1. Check network speed
# API calls should complete in 2-5 seconds

# 2. Check OpenAI API status
# Go to status.openai.com

# 3. Verify internet connection
ping google.com

# 4. Increase timeout in frontend
// In App.jsx
const response = await fetch(url, {
  signal: AbortSignal.timeout(10000) // 10 seconds
})

# 5. Check if rate limited
// OpenAI has rate limits
// Wait a few minutes and retry
```

---

## ✅ Verification Checklist

Use this to verify everything is working:

### Backend
- [ ] `npm install` completed without errors
- [ ] `.env` file exists with `OPENAI_API_KEY`
- [ ] `backend/data/` folder exists
- [ ] `npm start` shows "🚀 AI Task Agent running"
- [ ] `curl http://localhost:5000/api/goals` returns `[]`
- [ ] No errors in console

### Frontend
- [ ] `npm install` completed without errors
- [ ] `.env` file has `VITE_API_URL`
- [ ] `npm run dev` shows "Local: http://localhost:5173"
- [ ] Browser shows "AI Task Execution Agent" title
- [ ] No errors in DevTools console
- [ ] Can see "Welcome" message

### Integration
- [ ] Create goal button is clickable
- [ ] Form shows title input and duration select
- [ ] Can type in goal title
- [ ] Submit button creates goal
- [ ] Goal appears in sidebar
- [ ] Dashboard shows goal details
- [ ] Network tab shows successful POST to `/api/goals`
- [ ] Backend console shows no errors

---

## 🆘 Still Stuck?

### Debug Steps

1. **Check browser console** (F12)
   - Look for red errors
   - Check Network tab for failed requests

2. **Check backend console**
   - Stop server (Ctrl+C)
   - Restart: `npm start`
   - Look for error messages

3. **Verify file permissions**
   ```bash
   ls -la backend/data/
   ls -la backend/.env
   ls -la frontend/.env
   ```

4. **Test manually**
   ```bash
   # Test backend
   curl http://localhost:5000/api/goals
   
   # Test with body
   curl -X POST http://localhost:5000/api/goals \
     -H "Content-Type: application/json" \
     -d '{"title":"Test","durationDays":7}'
   ```

5. **Check system resources**
   ```bash
   # See if ports are actually open
   lsof -i :5000
   lsof -i :5173
   
   # Check disk space
   df -h
   
   # Check memory
   free -h  # Linux
   vm_stat  # Mac
   ```

---

## 📞 Getting Help

1. **Check error message carefully** - often contains the solution
2. **Google the error text** - usually someone else had it
3. **Check OpenAI status** - might be an API issue
4. **Review SETUP.md** - might have missed a step
5. **Check DEVELOPER_GUIDE.md** - for architecture details

### Common Phrases to Google
- "EADDRINUSE" + your port number
- "Cannot find module" + module name
- "CORS error" + your API endpoint
- "SyntaxError" + your file name

---

**Good luck! You've got this! 🚀**

If all else fails, restart everything:
```bash
# Terminal 1: Stop and restart backend
Ctrl+C
rm -rf node_modules
npm install
npm start

# Terminal 2: Stop and restart frontend
Ctrl+C
rm -rf node_modules
npm install
npm run dev

# Browser: Hard refresh
Ctrl+F5 / Cmd+Shift+R
```
