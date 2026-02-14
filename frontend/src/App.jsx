import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import CreateGoal from './components/CreateGoal';
import './App.css';

function App() {
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Fetch all goals
  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/goals`);
      const data = await response.json();
      setGoals(data);
      if (data.length > 0 && !selectedGoal) {
        setSelectedGoal(data[0]);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new goal
  const handleCreateGoal = async (goalData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalData),
      });
      const data = await response.json();
      if (data.goal) {
        setGoals([data.goal, ...goals]);
        setSelectedGoal(data.goal);
        setShowCreateGoal(false);
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      alert('Failed to create goal. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  // Update task completion status
  const handleTaskComplete = async (taskId, completed) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
      const updatedTask = await response.json();
      
      // Refresh selected goal
      if (selectedGoal) {
        fetchGoalDetails(selectedGoal.id);
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Fetch details of a specific goal
  const fetchGoalDetails = async (goalId) => {
    try {
      const response = await fetch(`${API_URL}/goals/${goalId}`);
      const data = await response.json();
      setSelectedGoal(data.goal);
      // Update the goals list too
      setGoals(goals.map(g => g.id === goalId ? data.goal : g));
    } catch (error) {
      console.error('Error fetching goal details:', error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚀 AI Task Execution Agent</h1>
        <p>Your Personal Productivity Copilot</p>
      </header>

      <div className="app-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>Goals</h2>
            <button
              className="btn-create"
              onClick={() => setShowCreateGoal(!showCreateGoal)}
              disabled={loading}
            >
              {showCreateGoal ? '✕' : '+ New Goal'}
            </button>
          </div>

          {showCreateGoal && (
            <CreateGoal
              onSubmit={handleCreateGoal}
              loading={loading}
              onCancel={() => setShowCreateGoal(false)}
            />
          )}

          <div className="goals-list">
            {goals.length === 0 ? (
              <p className="no-goals">No goals yet. Create one to get started!</p>
            ) : (
              goals.map(goal => (
                <div
                  key={goal.id}
                  className={`goal-item ${selectedGoal?.id === goal.id ? 'active' : ''}`}
                  onClick={() => setSelectedGoal(goal)}
                >
                  <div className="goal-title">{goal.title}</div>
                  <div className="goal-duration">{goal.durationDays} days</div>
                  <div className="goal-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${goal.progress?.progressPercentage || 0}%`,
                        }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      {goal.progress?.progressPercentage || 0}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {selectedGoal ? (
            <Dashboard
              goal={selectedGoal}
              onTaskComplete={handleTaskComplete}
              onRefresh={() => fetchGoalDetails(selectedGoal.id)}
              apiUrl={API_URL}
            />
          ) : (
            <div className="empty-state">
              <h2>👋 Welcome to AI Task Agent</h2>
              <p>Create your first goal to get started on your productivity journey!</p>
              <button
                className="btn-primary"
                onClick={() => setShowCreateGoal(true)}
              >
                + Create Your First Goal
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
