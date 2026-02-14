import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import Evaluation from './Evaluation';

function Dashboard({ goal, onTaskComplete, apiUrl }) {
  const [tasks, setTasks] = useState([]);
  const [showEvaluation, setShowEvaluation] = useState(false);

  const API_URL = apiUrl || 'http://localhost:5000/api';

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`${API_URL}/goals/${goal.id}/tasks`);
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    if (goal?.id) {
      fetchTasks();
    }
  }, [goal?.id]);

  const completedTasks = tasks.filter(t => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const getTodayTasks = () => {
    const createdDate = new Date(goal.createdAt);
    const today = new Date();
    const daysPassed = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));
    return tasks.filter(t => t.day === daysPassed + 1 || t.day === daysPassed);
  };

  const todayTasks = getTodayTasks();

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h2>{goal.title}</h2>
          <p className="goal-meta">
            {goal.durationDays} days • {completedTasks} of {tasks.length} tasks done
          </p>
        </div>
        <button
          className="btn-secondary"
          onClick={() => setShowEvaluation(!showEvaluation)}
        >
          {showEvaluation ? 'Hide Feedback' : '📊 Get Feedback'}
        </button>
      </div>

      {/* Evaluation Panel */}
      {showEvaluation && (
        <Evaluation
          goalId={goal.id}
          goalTitle={goal.title}
          completedTasks={completedTasks}
          totalTasks={tasks.length}
          apiUrl={API_URL}
        />
      )}

      {/* Progress Overview */}
      <div className="progress-section">
        <div className="progress-overview">
          <div className="progress-circle">
            <div className="progress-number">{progressPercent}%</div>
          </div>
          <div className="progress-info">
            <h3>Overall Progress</h3>
            <p className="progress-details">
              You've completed <strong>{completedTasks}</strong> out of <strong>{tasks.length}</strong> tasks
            </p>
            <div className="progress-bar large">
              <div
                className="progress-fill"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Tasks */}
      {todayTasks.length > 0 && (
        <div className="today-section">
          <h3>Today's Tasks</h3>
          <TaskList
            tasks={todayTasks}
            onTaskComplete={onTaskComplete}
          />
        </div>
      )}

      {/* All Tasks */}
      <div className="tasks-section">
        <h3>All Tasks ({goal.durationDays} days)</h3>
        <div className="tasks-grid">
          {tasks.map(task => (
            <div
              key={task.id}
              className={`task-card ${task.completed ? 'completed' : ''}`}
            >
              <div className="task-day">Day {task.day}</div>
              <div className="task-content">
                <h4>{task.title}</h4>
                <p>{task.description}</p>
              </div>
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={task.completed || false}
                  onChange={(e) => onTaskComplete(task.id, e.target.checked)}
                />
                <span>{task.completed ? '✓ Done' : 'Mark Done'}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Overview */}
      {goal.plan && (
        <div className="plan-section">
          <h3>Your Learning Plan</h3>
          <div className="plan-grid">
            {goal.plan.milestones && (
              <div className="plan-card">
                <h4>📍 Milestones</h4>
                <ul>
                  {goal.plan.milestones.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
            {goal.plan.successMetrics && (
              <div className="plan-card">
                <h4>🎯 Success Metrics</h4>
                <ul>
                  {goal.plan.successMetrics.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
            {goal.plan.challenges && (
              <div className="plan-card">
                <h4>⚠️ Challenges</h4>
                <ul>
                  {goal.plan.challenges.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
            {goal.plan.motivationalApproach && (
              <div className="plan-card">
                <h4>💪 Approach</h4>
                <p>{goal.plan.motivationalApproach}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
