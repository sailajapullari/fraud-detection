import React from "react";
import { motion } from "framer-motion";
import { realWorldCases } from "../data/mockData";
import {
    Smartphone,
    Key,
    FileWarning,
    ShieldAlert,
    Store,
    AlertTriangle,
    Search,
    Shield,
} from "lucide-react";

const iconMap = {
    smartphone: Smartphone,
    key: Key,
    "file-warning": FileWarning,
    "shield-alert": ShieldAlert,
    store: Store,
};

const RealCases = () => {
    return (
        <div className="space-y-6 max-w-5xl" style={{ margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Real-World Fraud Cases</h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    Common fraud patterns in Indian digital payments — and how our system detects them
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {realWorldCases.map((caseItem, i) => {
                    const Icon = iconMap[caseItem.icon] || Shield;
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card-hover"
                            style={{ padding: '2rem' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'start', gap: '1.5rem' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <Icon size={24} color="#ef4444" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>{caseItem.title}</h3>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                padding: '4px 10px',
                                                borderRadius: '99px',
                                                background: 'rgba(239, 68, 68, 0.1)',
                                                color: '#ef4444',
                                                border: '1px solid rgba(239, 68, 68, 0.2)'
                                            }}>
                                                Impact: {caseItem.impact}
                                            </span>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                padding: '4px 10px',
                                                borderRadius: '99px',
                                                background: 'rgba(245, 158, 11, 0.1)',
                                                color: '#f59e0b',
                                                border: '1px solid rgba(245, 158, 11, 0.2)'
                                            }}>
                                                Freq: {caseItem.frequency}
                                            </span>
                                        </div>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                                        {caseItem.description}
                                    </p>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                                        <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <AlertTriangle size={14} color="#f59e0b" />
                                                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>How It Happens</span>
                                            </div>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>{caseItem.how}</p>
                                        </div>
                                        <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)', borderRadius: '12px', padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                                <Search size={14} color="#10b981" />
                                                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>How We Detect It</span>
                                            </div>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>{caseItem.detection}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default RealCases;
