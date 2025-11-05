import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { plaidAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import '../styles/BankConnection.css';

function BankConnection() {
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadConnectedAccounts();
  }, []);

  const loadConnectedAccounts = async () => {
    try {
      const data = await plaidAPI.getAccounts();
      setConnectedAccounts(data);
    } catch (error) {
      console.error('Error loading accounts:', error);
      setConnectedAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectBank = async () => {
    try {
      // Step 1: Get link token from backend
      const { link_token } = await plaidAPI.createLinkToken();

      // Step 2: Initialize Plaid Link
      // TODO: Install and use react-plaid-link package
      // For now, showing a placeholder message
      alert('Plaid Link integration will be implemented here. Link token received: ' + link_token.substring(0, 20) + '...');
      
      // When Plaid Link completes successfully, the public_token will be sent to backend
      // handlePlaidSuccess(public_token);
    } catch (error) {
      console.error('Error connecting bank:', error);
      alert('Failed to connect bank. Please try again.');
    }
  };

  const handlePlaidSuccess = async (publicToken) => {
    try {
      await plaidAPI.exchangeToken(publicToken);
      await loadConnectedAccounts();
      alert('Bank account connected successfully!');
    } catch (error) {
      console.error('Error exchanging token:', error);
      alert('Failed to complete bank connection. Please try again.');
    }
  };

  const handleSyncTransactions = async () => {
    setSyncing(true);
    try {
      await plaidAPI.syncTransactions();
      alert('Transactions synced successfully!');
    } catch (error) {
      console.error('Error syncing transactions:', error);
      alert('Failed to sync transactions. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const handleDisconnect = async (accountId) => {
    if (!window.confirm('Are you sure you want to disconnect this account?')) {
      return;
    }

    try {
      await plaidAPI.disconnectAccount(accountId);
      await loadConnectedAccounts();
      alert('Account disconnected successfully.');
    } catch (error) {
      console.error('Error disconnecting account:', error);
      alert('Failed to disconnect account. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="bank-connection-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="bank-connection-container">
      <header className="bank-connection-header">
        <h1>Bank Connection</h1>
        <nav className="bank-connection-nav">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/goals" className="nav-link">Goals</Link>
          <button
            onClick={handleLogout}
            className="btn btn-secondary"
          >
            Logout
          </button>
        </nav>
      </header>

      <main className="bank-connection-main">
        <section className="connection-section">
          <div className="section-header">
            <h2>Connected Accounts</h2>
            <button
              onClick={handleConnectBank}
              className="btn btn-primary"
            >
              + Connect Bank Account
            </button>
          </div>

          {connectedAccounts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🏦</div>
              <h3>No Bank Accounts Connected</h3>
              <p>
                Connect your bank account to automatically sync transactions and track your spending.
              </p>
              <button
                onClick={handleConnectBank}
                className="btn btn-primary btn-large"
              >
                Connect Your First Bank
              </button>
              <div className="security-note">
                <p>🔒 Your bank credentials are never stored. We use Plaid, a secure, bank-level encryption service.</p>
              </div>
            </div>
          ) : (
            <div className="accounts-list">
              {connectedAccounts.map((account) => (
                <div key={account.id} className="account-card">
                  <div className="account-info">
                    <div className="account-icon">🏦</div>
                    <div className="account-details">
                      <h3>{account.institution_name}</h3>
                      <p className="account-meta">
                        Connected on {new Date(account.linked_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="account-actions">
                    <button
                      onClick={() => handleSyncTransactions()}
                      className="btn btn-secondary"
                      disabled={syncing}
                    >
                      {syncing ? 'Syncing...' : 'Sync Transactions'}
                    </button>
                    <button
                      onClick={() => handleDisconnect(account.id)}
                      className="btn btn-danger"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="info-section">
          <h3>How It Works</h3>
          <div className="info-steps">
            <div className="info-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Connect Your Bank</h4>
                <p>Click "Connect Bank Account" and select your financial institution.</p>
              </div>
            </div>
            <div className="info-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Secure Authentication</h4>
                <p>Log in securely through Plaid's encrypted connection. We never see your password.</p>
              </div>
            </div>
            <div className="info-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Automatic Sync</h4>
                <p>Your transactions are automatically synced and categorized for easy tracking.</p>
              </div>
            </div>
          </div>

          <div className="security-info">
            <h4>🔒 Security & Privacy</h4>
            <ul>
              <li>Bank-level encryption (256-bit SSL)</li>
              <li>Read-only access (we can't move your money)</li>
              <li>Your credentials are never stored</li>
              <li>FDIC-insured institutions only</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

export default BankConnection;

