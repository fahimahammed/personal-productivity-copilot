import React, { useState, useEffect } from 'react';

function Evaluation({ goalId, apiUrl }) {
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reminder, setReminder] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = apiUrl || 'http://localhost:5000/api';

  const fetchEvaluation = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/goals/${goalId}/evaluate`, {
        method: 'POST',
      });
      const data = await response.json();
      setEvaluation(data);
    } catch (error) {
      console.error('Error fetching evaluation:', error);
      setError('Failed to generate evaluation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchReminder = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/goals/${goalId}/reminder`, {
        method: 'POST',
      });
      const data = await response.json();
      setReminder(data.reminder);
    } catch (error) {
      console.error('Error fetching reminder:', error);
      setError('Failed to generate reminder. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvaluation();
  }, [goalId]);

  return (
    <div className="evaluation-panel">
      <div className="evaluation-content">
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {loading && !evaluation && !reminder && (
          <div className="loading">
            <p>✨ AI Coach is analyzing your progress...</p>
          </div>
        )}

        {evaluation && (
          <div className="evaluation-card">
            <h4>📈 Performance Analysis</h4>
            <p className="analysis">{evaluation.analysis}</p>

            <h4>💪 Encouragement</h4>
            <p className="encouragement">{evaluation.encouragement}</p>

            <h4>🚀 Next Action</h4>
            <p className="next-action">{evaluation.nextAction}</p>

            <h4>💡 Weekly Tip</h4>
            <p className="tip">{evaluation.tip}</p>

            <button
              className="btn-secondary"
              onClick={fetchReminder}
              disabled={loading}
            >
              {loading ? 'Getting reminder...' : '📬 Get Reminder'}
            </button>
          </div>
        )}

        {reminder && (
          <div className="reminder-card">
            <h4>📬 Personalized Reminder</h4>
            <p className="reminder-text">{reminder}</p>
            <button
              className="btn-secondary"
              onClick={fetchReminder}
              disabled={loading}
            >
              {loading ? 'Refreshing...' : '🔄 Refresh Reminder'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Evaluation;
