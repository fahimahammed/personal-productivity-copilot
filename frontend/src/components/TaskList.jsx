import React from 'react';

function TaskList({ tasks, onTaskComplete }) {
  return (
    <div className="task-list">
      {tasks.map(task => (
        <div
          key={task.id}
          className={`task-item ${task.completed ? 'completed' : ''}`}
        >
          <label className="task-checkbox">
            <input
              type="checkbox"
              checked={task.completed || false}
              onChange={(e) => onTaskComplete(task.id, e.target.checked)}
            />
            <span className="checkmark"></span>
          </label>
          <div className="task-details">
            <div className="task-title">{task.title}</div>
            {task.description && (
              <div className="task-description">{task.description}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
