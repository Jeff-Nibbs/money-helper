import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { plaidAPI, insightsAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import '../styles/Dashboard.css';

function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load accounts
      try {
        const accountsData = await plaidAPI.getAccounts();
        setAccounts(accountsData);
      } catch (error) {
        console.error('Error loading accounts:', error);
        setAccounts([]);
      }

      // TODO: Add transactions endpoint when backend is ready
      // For now, using empty array
      setTransactions([]);

      // Try to load latest insights
      try {
        const insightsData = await insightsAPI.getLatest();
        setInsights(insightsData);
      } catch (error) {
        console.error('Error loading insights:', error);
        setInsights(null);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  const handleGetInsights = async () => {
    try {
      const data = await insightsAPI.generate();
      setInsights(data);
    } catch (error) {
      console.error('Error generating insights:', error);
      alert('Failed to generate insights. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <nav className="dashboard-nav">
          <Link to="/goals" className="nav-link">Goals</Link>
          <Link to="/connect-bank" className="nav-link">Connect Bank</Link>
          <button
            onClick={handleLogout}
            className="btn btn-secondary"
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="dashboard-main">
        <section className="accounts-section">
          <h2>Connected Accounts</h2>
          {accounts.length === 0 ? (
            <div className="empty-state">
              <p>No bank accounts connected yet.</p>
              <Link to="/connect-bank" className="btn btn-primary">
                Connect Your First Bank
              </Link>
            </div>
          ) : (
            <div className="accounts-grid">
              {accounts.map((account) => (
                <div key={account.id} className="account-card">
                  <div className="account-header">
                    <h3>{account.name}</h3>
                    <span className="account-type">{account.type}</span>
                  </div>
                  <div className="account-balance">
                    ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="dashboard-grid">
          <section className="transactions-section">
            <div className="section-header">
              <h2>Recent Transactions</h2>
              <Link to="/connect-bank" className="btn btn-secondary btn-small">
                Sync Transactions
              </Link>
            </div>
            {transactions.length === 0 ? (
              <div className="empty-state">
                <p>No transactions yet. Connect your bank to get started.</p>
              </div>
            ) : (
              <div className="transactions-list">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="transaction-item">
                    <div className="transaction-info">
                      <div className="transaction-merchant">{transaction.merchant}</div>
                      <div className="transaction-date">{new Date(transaction.date).toLocaleDateString()}</div>
                      <div className="transaction-category">{transaction.category}</div>
                    </div>
                    <div className={`transaction-amount ${transaction.amount >= 0 ? 'positive' : 'negative'}`}>
                      ${Math.abs(transaction.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="insights-section">
            <div className="section-header">
              <h2>AI Insights</h2>
              <button onClick={handleGetInsights} className="btn btn-secondary btn-small">
                Refresh
              </button>
            </div>
            {!insights ? (
              <div className="empty-state">
                <p>No insights yet. Get started by connecting your bank and setting goals.</p>
                <button onClick={handleGetInsights} className="btn btn-primary">
                  Generate Insights
                </button>
              </div>
            ) : (
              <div className="insights-content">
                <div className="insight-summary">
                  <p>{insights.summary}</p>
                </div>
                {insights.recommendations && insights.recommendations.length > 0 && (
                  <div className="insight-recommendations">
                    <h3>Recommendations</h3>
                    <ul>
                      {insights.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

