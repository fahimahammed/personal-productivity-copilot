import React, { useState } from 'react';

function CreateGoal({ onSubmit, loading, onCancel }) {
  const [title, setTitle] = useState('');
  const [durationDays, setDurationDays] = useState('7');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a goal');
      return;
    }
    onSubmit({
      title: title.trim(),
      durationDays: parseInt(durationDays),
    });
    setTitle('');
    setDurationDays('7');
  };

  return (
    <form className="create-goal-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="goal-title">What do you want to achieve?</label>
        <input
          id="goal-title"
          type="text"
          placeholder="e.g., Learn React basics, Master Python, Fitness Goal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="goal-duration">Duration (days)</label>
        <select
          id="goal-duration"
          value={durationDays}
          onChange={(e) => setDurationDays(e.target.value)}
          disabled={loading}
        >
          <option value="3">3 Days</option>
          <option value="7">7 Days</option>
          <option value="14">2 Weeks</option>
          <option value="30">1 Month</option>
          <option value="60">2 Months</option>
        </select>
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn-primary"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Goal'}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default CreateGoal;
