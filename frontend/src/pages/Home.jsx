import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <h1 className="logo">💰 Money Helper</h1>
          <nav className="header-nav">
            <Link to="/auth" className="nav-link">Login</Link>
            <Link to="/auth" className="nav-link btn-primary">Get Started</Link>
          </nav>
        </div>
      </header>

      <main className="home-main">
        <section className="hero">
          <h1 className="hero-title">Take Control of Your Finances</h1>
          <p className="hero-subtitle">
            Set goals, track spending, and get AI-powered insights to achieve your financial dreams.
          </p>
          <div className="hero-actions">
            <Link to="/auth" className="btn btn-large btn-primary">Get Started Free</Link>
            <Link to="/auth" className="btn btn-large btn-secondary">Sign In</Link>
          </div>
        </section>

        <section className="features">
          <h2 className="section-title">Why Choose Money Helper?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Smart Goal Setting</h3>
              <p>Set and track financial goals with personalized timelines and progress tracking.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏦</div>
              <h3>Bank Integration</h3>
              <p>Securely connect your bank accounts and automatically sync transactions.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Insights</h3>
              <p>Get personalized financial advice powered by advanced AI analysis of your spending patterns.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Real-time Tracking</h3>
              <p>Monitor your spending, income, and progress toward your goals in real-time.</p>
            </div>
          </div>
        </section>

        <section className="cta">
          <h2>Ready to Transform Your Financial Future?</h2>
          <p>Join thousands of users who are taking control of their finances today.</p>
          <Link to="/auth" className="btn btn-large btn-primary">Start Your Journey</Link>
        </section>
      </main>

      <footer className="home-footer">
        <p>&copy; {new Date().getFullYear()} Money Helper. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;

