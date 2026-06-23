import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart3,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Plus,
  AlertTriangle,
  Zap,
  Globe,
  Monitor,
  Search,
  Cpu,
  UserCheck,
  Flag,
  Lock,
  Smartphone,
  CreditCard,
  UserPlus,
  BookOpen,
  LayoutDashboard,
  FileSearch,
  Moon,
  Sun,
  LayoutGrid,
  Users,
  LineChart,
  Shield,
  ChevronRight,
  Clock
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import HowItWorks from './components/HowItWorks';
import RealCases from './components/RealCases';
import Analytics from './components/Analytics';
import Behaviors from './components/Behaviors';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const API_BASE = 'http://localhost:8000/api/fraud';
const PAYMENT_REVIEW_URL = `${API_BASE}/payment-review/`;

function App() {
  const [stats, setStats] = useState({
    total_transactions: 0,
    flagged_transactions: 0,
    blocked_transactions: 0,
    avg_risk_score: 0,
    risk_distribution: {},
    volume_data: []
  });
  const [recentTx, setRecentTx] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [simForm, setSimForm] = useState({
    amount: 5000,
    device: 'iPhone 15 Pro',
    location: 'Mumbai',
    time: 14 // 2 PM default
  });
  const [loading, setLoading] = useState(false);
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [activeView, setActiveView] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [time, setTime] = useState(new Date());

  const fetchData = async () => {
    try {
      const [statsRes, txRes] = await Promise.all([
        axios.get(`${API_BASE}/dashboard-stats/`),
        axios.get(`${API_BASE}/recent-transactions/`)
      ]);
      setStats(statsRes.data);
      setRecentTx(txRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    const clockInterval = setInterval(() => setTime(new Date()), 1000);
    return () => {
      clearInterval(interval);
      clearInterval(clockInterval);
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('light-mode');
  };

  const handleSimulate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLatestAnalysis(null);
    setPipelineStep(1);

    try {
      const res = await axios.post(`${API_BASE}/simulate-transaction/`, simForm);
      await new Promise(r => setTimeout(r, 600));
      setPipelineStep(2);
      await new Promise(r => setTimeout(r, 600));
      setPipelineStep(3);
      await new Promise(r => setTimeout(r, 600));
      setPipelineStep(4);
      setLatestAnalysis(res.data);
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      alert("Simulation failed. Make sure backend is running.");
      setPipelineStep(0);
    } finally {
      setLoading(false);
    }
  };

  const riskChartData = {
    labels: ['Low', 'Medium', 'High', 'Critical'],
    datasets: [{
      data: [
        stats.risk_distribution.LOW || 0,
        stats.risk_distribution.MEDIUM || 0,
        stats.risk_distribution.HIGH || 0,
        stats.risk_distribution.CRITICAL || 0,
      ],
      backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#dc2626'],
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 2,
    }]
  };

  const lineChartData = {
    labels: Array.from({ length: 12 }, (_, i) => `${i * 2}:00`),
    datasets: [{
      label: 'Volume',
      data: [12, 19, 15, 8, 22, 30, 45, 38, 52, 40, 35, 28],
      borderColor: '#6366f1',
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
        return gradient;
      },
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: '#6366f1',
    }]
  };

  const formatTime = (h) => {
    const period = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour} ${period}`;
  };

  return (
    <div className="app-container">
      {/* Top Header Navigation */}
      <header className="navbar">
        <div className="nav-container">
          <div className="nav-logo" onClick={() => setActiveView('dashboard')}>
            <div className="logo-box">
              <ShieldCheck color="white" size={24} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>AI FRAUD DETECTION SYSYTEM</h2>
              <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1 }}>AI Fraud Detection</p>
            </div>
          </div>

          <nav className="nav-links">
            <NavButton
              active={activeView === 'dashboard'}
              onClick={() => setActiveView('dashboard')}
              icon={<LayoutGrid size={18} />}
              label="Dashboard"
            />
            <NavButton
              active={activeView === 'behavior'}
              onClick={() => setActiveView('behavior')}
              icon={<Users size={18} />}
              label="Behavior"
            />
            <NavButton
              active={activeView === 'analytics'}
              onClick={() => setActiveView('analytics')}
              icon={<LineChart size={18} />}
              label="Analytics"
            />
            <NavButton
              active={activeView === 'real-cases'}
              onClick={() => setActiveView('real-cases')}
              icon={<Shield size={18} />}
              label="Cases"
            />
            <NavButton
              active={activeView === 'how-it-works'}
              onClick={() => setActiveView('how-it-works')}
              icon={<BookOpen size={18} />}
              label="Pipeline"
            />
          </nav>

          <div className="nav-actions">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '1rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={14} color="var(--primary)" />
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{time.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
            </div>

            <button
              onClick={toggleTheme}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                width: '40px', height: '40px', borderRadius: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--text-main)',
              }}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <a
              href={PAYMENT_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-btn"
              style={{ borderRadius: '10px', padding: '0.6rem 1.2rem', fontSize: '0.9rem', textDecoration: 'none', color: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <CreditCard size={18} />
              Pay with Razorpay
            </a>
            <button
              className="glow-btn"
              style={{ borderRadius: '10px', padding: '0.6rem 1.2rem', fontSize: '0.9rem', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
              onClick={() => setIsModalOpen(true)}
            >
              Simulator
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">

        <AnimatePresence mode="wait">
          {activeView === 'dashboard' ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="dashboard-layout"
            >
              {/* Stats and workflow sections... */}
              {pipelineStep > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card"
                  style={{ border: '1px solid var(--primary-glow)', background: 'rgba(99, 102, 241, 0.05)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0 }}>System Workflow: Real-Time Analysis</h3>
                    {latestAnalysis && (
                      <span className={`status-badge status-${latestAnalysis.level.toLowerCase()}`}>
                        Final Decision: {latestAnalysis.level}
                      </span>
                    )}
                  </div>

                  <div className="analysis-pipeline">
                    <Step icon={<Smartphone />} label="User Initiates" active={pipelineStep >= 1} complete={pipelineStep > 1} />
                    <div className="pipeline-arrow" />
                    <Step icon={<Search />} label="Feature Extract" active={pipelineStep >= 2} complete={pipelineStep > 2} />
                    <div className="pipeline-arrow" />
                    <Step icon={<Cpu />} label="ML Risk Score" active={pipelineStep >= 3} complete={pipelineStep > 3} />
                    <div className="pipeline-arrow" />
                    <Step icon={<UserCheck />} label="Behavior Analysis" active={pipelineStep >= 4} complete={pipelineStep > 4} />
                    <div className="pipeline-arrow" />
                    <Step icon={<Flag />} label="Alert Decision" active={pipelineStep >= 4} complete={pipelineStep > 4} color={latestAnalysis?.score > 60 ? 'var(--danger)' : 'var(--success)'} />
                  </div>

                  {latestAnalysis && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="result-card"
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${getRiskColor(latestAnalysis.level)}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ShieldAlert color={getRiskColor(latestAnalysis.level)} size={24} />
                          </div>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Simulator Result</h4>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                              Risk Level: <span style={{ color: getRiskColor(latestAnalysis.level), fontWeight: 700 }}>{latestAnalysis.level}</span> • Status: {latestAnalysis.score > 60 ? 'Blocked' : 'Approved'}
                            </p>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: getRiskColor(latestAnalysis.level) }}>{latestAnalysis.score}%</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Risk Score</div>
                        </div>
                      </div>

                      <div className="result-footer-bar" style={{
                        color: getRiskColor(latestAnalysis.level),
                        borderColor: `${getRiskColor(latestAnalysis.level)}33`,
                        background: `${getRiskColor(latestAnalysis.level)}05`
                      }}>
                        {latestAnalysis.score > 60 ? <Lock size={18} /> : <ShieldCheck size={18} />}
                        <span>
                          {latestAnalysis.breakdown.reasons.length > 0
                            ? `${latestAnalysis.breakdown.reasons.join(', ')} detected — caution advised`
                            : 'No risk factors detected — transaction appears safe'}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              <div className="stats-grid">
                <StatCard icon={<Activity color="#6366f1" />} label="Total Transactions" value={stats.total_transactions} />
                <StatCard icon={<ShieldAlert color="#f59e0b" />} label="Flagged High Risk" value={stats.flagged_transactions} color="var(--warning)" />
                <StatCard icon={<Lock color="#ef4444" />} label="Blocked (Fraud)" value={stats.blocked_transactions} color="var(--danger)" />
                <StatCard icon={<Zap color="#8b5cf6" />} label="Avg System Risk" value={`${stats.avg_risk_score}%`} />
              </div>

              <div className="charts-grid">
                <div className="glass-card">
                  <h3 style={{ marginBottom: '2rem' }}>Transaction Velocity (24h)</h3>
                  <div style={{ height: '300px' }}>
                    <Line data={lineChartData} options={{
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' } }, x: { grid: { display: false } } }
                    }} />
                  </div>
                </div>

                <div className="glass-card">
                  <h3 style={{ marginBottom: '1.5rem' }}>Risk Sentiment</h3>
                  <div style={{ height: '250px', display: 'flex', justifyContent: 'center' }}>
                    <Doughnut data={riskChartData} options={{ cutout: '75%', maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                  </div>
                </div>
              </div>

              <div className="glass-card">
                <h3>Live Monitoring Feed</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className="monitoring-table">
                    <thead>
                      <tr><th>Order ID</th><th>Amount</th><th>Source</th><th>Risk Engine</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {recentTx.map(tx => (
                          <motion.tr key={tx.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                            <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>{tx.razorpay_order_id}</td>
                            <td style={{ fontWeight: 700 }}>₹{parseFloat(tx.amount).toLocaleString()}</td>
                            <td><div style={{ fontSize: '0.75rem' }}><div>{tx.device}</div><div style={{ color: 'var(--text-muted)' }}>{tx.location}</div></div></td>
                            <td>
                              {tx.risk_analysis ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                                    <div style={{ width: `${tx.risk_analysis.risk_score}%`, height: '100%', background: getRiskColor(tx.risk_analysis.risk_level), borderRadius: '2px' }} />
                                  </div>
                                  <span className={`status-badge status-${tx.risk_analysis.risk_level.toLowerCase()}`}>{tx.risk_analysis.risk_level}</span>
                                </div>
                              ) : '-'}
                            </td>
                            <td><span className={`status-badge ${tx.status === 'BLOCKED' ? 'status-critical' : 'status-success'}`}>{tx.status}</span></td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ) : activeView === 'how-it-works' ? (
            <motion.div key="how-it-works" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <HowItWorks />
            </motion.div>
          ) : activeView === 'analytics' ? (
            <motion.div key="analytics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Analytics />
            </motion.div>
          ) : activeView === 'behavior' ? (
            <motion.div key="behavior" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Behaviors />
            </motion.div>
          ) : (
            <motion.div key="real-cases" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <RealCases />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Simulation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <motion.div className="glass-card" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ width: '450px', zIndex: 1100 }} onClick={e => e.stopPropagation()}>
              <h2 style={{ marginBottom: '1.5rem' }}>Simulate Gateway Entry</h2>
              <form onSubmit={handleSimulate}>
                <Input label="Amount (INR)" type="number" value={simForm.amount} onChange={v => setSimForm({ ...simForm, amount: v })} />

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Source Device</label>
                  <select className="custom-input" value={simForm.device} onChange={e => setSimForm({ ...simForm, device: e.target.value })}>
                    <option>iPhone 15 Pro</option>
                    <option>MacBook Pro M3</option>
                    <option>Windows 11 / Chrome</option>
                    <option>Unknown Tor Node</option>
                    <option>Insecure API Client</option>
                  </select>
                </div>

                <Input label="Geo Location" value={simForm.location} onChange={v => setSimForm({ ...simForm, location: v })} />

                <div className="range-slider-container">
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Time of Transaction (Hour)</label>
                  <input
                    type="range"
                    min="0" max="23"
                    value={simForm.time}
                    className="custom-slider"
                    onChange={e => setSimForm({ ...simForm, time: parseInt(e.target.value) })}
                  />
                  <div className="slider-labels">
                    <span>12 AM</span>
                    <span className="active-time-label">{formatTime(simForm.time)}</span>
                    <span>11 PM</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button type="submit" className="glow-btn" style={{ flex: 1 }} disabled={loading}>{loading ? 'Analyzing...' : 'Execute Analysis'}</button>
                  <button type="button" className="glow-btn" style={{ flex: 1, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-main)' }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .modal-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center; z-index: 1000;
        }
        .custom-input {
          width: 100%; background: var(--surface); border: 1px solid var(--border);
          color: var(--text-main); padding: 0.8rem; border-radius: 12px; outline: none; font-family: inherit;
        }
      `}</style>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }) {
  return (
    <button className={`nav-button ${active ? 'active' : ''}`} onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function Step({ icon, label, active, complete, color }) {
  return (
    <div className="pipeline-step">
      <div className={`step-icon ${active ? 'active' : ''} ${complete ? 'complete' : ''}`} style={complete && color ? { background: color, borderColor: color } : {}}>
        {icon}
      </div>
      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: active ? 'var(--text-main)' : 'var(--text-muted)' }}>{label}</span>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '10px', width: 'fit-content' }}>{icon}</div>
      <div style={{ marginTop: '1.25rem' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{label}</div>
        <div className="stat-val" style={{ color: color }}>{value}</div>
      </div>
    </div>
  );
}

function Input({ label, type = "text", value, onChange }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{label}</label>
      <input className="custom-input" type={type} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

const getRiskColor = (lvl) => {
  switch (lvl) {
    case 'CRITICAL': return '#dc2626';
    case 'HIGH': return '#ef4444';
    case 'MEDIUM': return '#f59e0b';
    default: return '#10b981';
  }
};

export default App;
