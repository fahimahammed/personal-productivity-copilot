require('dotenv').config();
const express = require('express');
const cors = require('cors');
const storage = require('./storage');
const aiAgent = require('./ai-agent');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ============ GOAL ROUTES ============

// Create new goal
app.post('/api/goals', async (req, res) => {
  try {
    const { title, durationDays } = req.body;

    if (!title || !durationDays) {
      return res.status(400).json({ error: 'Title and durationDays are required' });
    }

    // Analyze goal with AI
    const plan = await aiAgent.analyzeGoal(title, durationDays);

    // Save goal
    const goal = storage.saveGoal({
      title,
      durationDays,
      plan,
      status: 'active',
    });

    // Save tasks from plan
    const tasks = storage.saveTasks(goal.id, plan.dailyTasks || []);

    // Initialize progress
    storage.saveProgress(goal.id, {
      goalId: goal.id,
      completedTasks: 0,
      totalTasks: tasks.length,
      progressPercentage: 0,
    });

    res.json({
      goal,
      tasks,
      message: 'Goal created successfully!',
    });
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all goals
app.get('/api/goals', (req, res) => {
  try {
    const goals = storage.getAllGoals();
    const goalsWithProgress = goals.map(goal => {
      const progress = storage.getProgressByGoal(goal.id) || [{}];
      const latestProgress = progress[progress.length - 1] || {};
      return {
        ...goal,
        progress: latestProgress,
      };
    });
    res.json(goalsWithProgress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single goal with tasks
app.get('/api/goals/:goalId', (req, res) => {
  try {
    const goal = storage.getGoal(req.params.goalId);
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const tasks = storage.getTasksByGoal(goal.id);
    const progress = storage.getProgressByGoal(goal.id);

    res.json({
      goal,
      tasks,
      progress,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ TASK ROUTES ============

// Get tasks for a goal
app.get('/api/goals/:goalId/tasks', (req, res) => {
  try {
    const tasks = storage.getTasksByGoal(req.params.goalId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark task as complete
app.patch('/api/tasks/:taskId', (req, res) => {
  try {
    const updated = storage.updateTask(req.params.taskId, {
      completed: req.body.completed,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update progress
    const allTasks = storage.getAllTasks();
    const goalTasks = allTasks.filter(t => t.goalId === updated.goalId);
    const completedCount = goalTasks.filter(t => t.completed).length;

    storage.saveProgress(updated.goalId, {
      goalId: updated.goalId,
      completedTasks: completedCount,
      totalTasks: goalTasks.length,
      progressPercentage: Math.round((completedCount / goalTasks.length) * 100),
      updatedAt: new Date().toISOString(),
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ PROGRESS & FEEDBACK ROUTES ============

// Get progress for a goal
app.get('/api/goals/:goalId/progress', (req, res) => {
  try {
    const progress = storage.getProgressByGoal(req.params.goalId);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate evaluation feedback
app.post('/api/goals/:goalId/evaluate', async (req, res) => {
  try {
    const goal = storage.getGoal(req.params.goalId);
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const tasks = storage.getTasksByGoal(goal.id);
    const completedCount = tasks.filter(t => t.completed).length;
    const createdDays = Math.ceil((Date.now() - new Date(goal.createdAt)) / (1000 * 60 * 60 * 24));

    const evaluation = await aiAgent.evaluateProgress(
      goal,
      completedCount,
      tasks.length,
      createdDays,
    );

    res.json(evaluation);
  } catch (error) {
    console.error('Error evaluating goal:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate reminder
app.post('/api/goals/:goalId/reminder', async (req, res) => {
  try {
    const goal = storage.getGoal(req.params.goalId);
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const tasks = storage.getTasksByGoal(goal.id);
    const completedTasks = tasks.filter(t => t.completed).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    const lastCompleted = completedTasks[0] ? new Date(completedTasks[0].updatedAt) : new Date(goal.createdAt);

    const reminder = await aiAgent.generateReminder(goal, lastCompleted);

    res.json({ reminder });
  } catch (error) {
    console.error('Error generating reminder:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate weekly report
app.post('/api/goals/:goalId/weekly-report', async (req, res) => {
  try {
    const { week } = req.body;
    const goal = storage.getGoal(req.params.goalId);
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const tasks = storage.getTasksByGoal(goal.id);
    const weekStart = (week - 1) * 7 + 1;
    const weekEnd = Math.min(week * 7, goal.durationDays);
    const weekTasks = tasks.filter(t => t.day >= weekStart && t.day <= weekEnd);
    const completedWeekTasks = weekTasks.filter(t => t.completed).length;

    const report = await aiAgent.generateWeeklyReport(
      goal,
      week,
      completedWeekTasks,
      weekTasks.length,
    );

    res.json({ report });
  } catch (error) {
    console.error('Error generating weekly report:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============ SERVER START ============

app.listen(PORT, () => {
  console.log(`🚀 AI Task Agent running on http://localhost:${PORT}`);
  console.log(`📁 Data storage: ${__dirname}/data`);
});
