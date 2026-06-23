import React from "react";
import { motion } from "framer-motion";
import {
    Brain,
    Activity,
    BarChart3,
    Shield,
    ArrowRight,
    Database,
    Cpu,
    Eye,
    KeyRound,
    IdCard,
    FileWarning,
    Radar,
} from "lucide-react";

const challenges = [
    {
        icon: KeyRound,
        title: "Phishing & OTP Scams",
        description: "Deceptive messages and links trick users into sharing passwords and one-time passwords.",
    },
    {
        icon: IdCard,
        title: "Identity Theft",
        description: "Unauthorized use of personal data to open accounts or take loans in someone else's name.",
    },
    {
        icon: FileWarning,
        title: "Fake Loan Apps",
        description: "Predatory apps designed for fraud, hidden charges, and data harvesting.",
    },
    {
        icon: Radar,
        title: "Unscalable Monitoring",
        description: "Manual reviews cannot keep pace with the volume and speed of digital payments.",
    },
];

const steps = [
    {
        icon: Database,
        title: "1. Data Collection",
        description: "The system collects transaction details: amount, time, location, device, merchant, and user history. This raw data forms the foundation for all analysis.",
        features: ["Transaction amount & type", "Timestamp & location", "Device fingerprint", "User account history"],
    },
    {
        icon: Brain,
        title: "2. ML Risk Scoring",
        description: "A Machine Learning model (Random Forest / XGBoost) processes each transaction through trained patterns. It outputs a fraud probability score from 0 (safe) to 100 (fraudulent).",
        features: ["Random Forest / XGBoost model", "Trained on historical fraud data", "Real-time inference < 50ms", "Continuous model retraining"],
    },
    {
        icon: Activity,
        title: "3. Behavioral Analysis",
        description: "The system compares the transaction against the user's established behavioral baseline. Deviations from normal patterns (spending, timing, location) increase the risk score.",
        features: ["Spending pattern tracking", "Time-of-day analysis", "Location consistency check", "Device change detection"],
    },
    {
        icon: Cpu,
        title: "4. Risk Classification",
        description: "Based on the combined ML score and behavioral analysis, each transaction is classified into Low (0-29), Medium (30-59), High (60-79), or Critical (80-100) risk levels.",
        features: ["Composite risk scoring", "Dynamic thresholds", "Multi-factor weighting", "Adaptive classification"],
    },
    {
        icon: Eye,
        title: "5. Decision & Action",
        description: "The system automatically approves low-risk transactions, flags medium/high-risk ones for review, and blocks critical-risk transactions to prevent fraud.",
        features: ["Auto-approve safe transactions", "Flag suspicious activity", "Block critical threats", "Generate detailed explanations"],
    },
    {
        icon: BarChart3,
        title: "6. Dashboard & Reporting",
        description: "All results are visualized in a real-time dashboard showing risk scores, trends, alerts, and explainable reasons for each flagged transaction.",
        features: ["Real-time monitoring", "Risk trend analysis", "Explainable AI reasons", "Alert management"],
    },
];

const HowItWorks = () => {
    return (
        <div className="space-y-6 max-w-5xl" style={{ margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>How It Works</h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    Understanding the AI-Based Adaptive Fraud Detection pipeline — from data ingestion to actionable insights
                </p>
            </div>

            {/* Challenge section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="glass-card"
                style={{ padding: '2rem', border: '1px solid rgba(99, 102, 241, 0.2)' }}
            >
                <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '4px 12px',
                    borderRadius: '99px',
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: 'var(--primary)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    marginBottom: '1rem'
                }}>
                    CHALLEGE
                </div>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        The Escalating Threat of Financial Fraud
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        The digital age has brought an explosion in financial fraud, posing a significant threat to both consumers and financial institutions.
                    </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {challenges.map((item, i) => (
                        <div key={item.title} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'rgba(99, 102, 241, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <item.icon size={20} color="var(--primary)" />
                            </div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{item.title}</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Flow */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {steps.map((step, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card"
                        style={{ padding: '1.5rem' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'start', gap: '1.5rem' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <step.icon size={24} color="#fff" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{step.title}</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{step.description}</p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                                    {step.features.map((feature, j) => (
                                        <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            <ArrowRight size={12} color="var(--primary)" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Key Advantage */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="glass-card"
                style={{ padding: '2rem', border: '1px solid rgba(99, 102, 241, 0.2)' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <Shield size={24} color="var(--primary)" />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Key Advantage: Adaptive Learning</h3>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    Unlike static rule-based systems, GuardianPay continuously adapts to each user's evolving behavior.
                    The ML model retrains on new data, behavioral baselines update automatically, and risk thresholds
                    adjust dynamically. This means the system catches new fraud patterns that traditional systems miss,
                    while reducing false positives on legitimate transactions.
                </p>
            </motion.div>
        </div>
    );
};

export default HowItWorks;
