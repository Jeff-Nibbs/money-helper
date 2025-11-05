import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { goalsAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import '../styles/Goals.css';

function Goals() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    goal_type: '',
    target_amount: '',
    deadline: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await goalsAPI.getAll();
      setGoals(data);
    } catch (error) {
      console.error('Error loading goals:', error);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const goalData = {
        goal_type: formData.goal_type,
        target_amount: parseFloat(formData.target_amount),
        deadline: formData.deadline,
      };

      if (editingGoal) {
        await goalsAPI.update(editingGoal.id, goalData);
      } else {
        await goalsAPI.create(goalData);
      }

      await loadGoals();
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      goal_type: goal.goal_type,
      target_amount: goal.target_amount.toString(),
      deadline: goal.deadline.split('T')[0], // Format date for input
    });
    setShowForm(true);
  };

  const handleDelete = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) {
      return;
    }

    try {
      await goalsAPI.delete(goalId);
      await loadGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
      alert('Failed to delete goal. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const resetForm = () => {
    setFormData({
      goal_type: '',
      target_amount: '',
      deadline: '',
    });
    setEditingGoal(null);
    setShowForm(false);
    setError('');
  };

  const calculateProgress = (goal) => {
    // TODO: Calculate actual progress based on saved amount
    // For now, return mock progress
    return 35;
  };

  if (loading) {
    return (
      <div className="goals-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="goals-container">
      <header className="goals-header">
        <h1>Financial Goals</h1>
        <nav className="goals-nav">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/connect-bank" className="nav-link">Connect Bank</Link>
          <button
            onClick={handleLogout}
            className="btn btn-secondary"
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="goals-main">
        <div className="goals-header-section">
          <h2>Your Goals</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            {showForm ? 'Cancel' : '+ New Goal'}
          </button>
        </div>

        {showForm && (
          <div className="goal-form-card">
            <h3>{editingGoal ? 'Edit Goal' : 'Create New Goal'}</h3>
            <form onSubmit={handleSubmit} className="goal-form">
              <div className="form-group">
                <label htmlFor="goal_type">Goal Type</label>
                <input
                  type="text"
                  id="goal_type"
                  name="goal_type"
                  value={formData.goal_type}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Save for emergency fund, Pay off debt"
                />
              </div>

              <div className="form-group">
                <label htmlFor="target_amount">Target Amount ($)</label>
                <input
                  type="number"
                  id="target_amount"
                  name="target_amount"
                  value={formData.target_amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="5000.00"
                />
              </div>

              <div className="form-group">
                <label htmlFor="deadline">Deadline</label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </button>
                {editingGoal && (
                  <button type="button" onClick={resetForm} className="btn btn-secondary">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {goals.length === 0 ? (
          <div className="empty-state">
            <p>You haven't created any goals yet.</p>
            <p>Set your first financial goal to get started!</p>
          </div>
        ) : (
          <div className="goals-list">
            {goals.map((goal) => {
              const progress = calculateProgress(goal);
              const daysRemaining = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={goal.id} className="goal-card">
                  <div className="goal-header">
                    <h3>{goal.goal_type}</h3>
                    <div className="goal-actions">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="btn-icon"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        className="btn-icon"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <div className="goal-info">
                    <div className="goal-amount">
                      <span className="label">Target:</span>
                      <span className="value">${goal.target_amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="goal-deadline">
                      <span className="label">Deadline:</span>
                      <span className="value">{new Date(goal.deadline).toLocaleDateString()}</span>
                      {daysRemaining > 0 && (
                        <span className="days-remaining">({daysRemaining} days remaining)</span>
                      )}
                    </div>
                  </div>

                  <div className="goal-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="progress-text">{progress}% Complete</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Goals;

