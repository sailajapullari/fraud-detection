import React from "react";
import { motion } from "framer-motion";
import { sampleBehaviors } from "../data/mockData";
import {
    User,
    MapPin,
    Smartphone,
    Clock,
    TrendingUp,
    AlertTriangle,
} from "lucide-react";

const Behaviors = () => {
    return (
        <div className="analytics-container">
            <div className="section-header">
                <h1 className="section-title">User Behavior Analysis</h1>
                <p className="section-desc">Heuristic behavioral profiling and anomaly detection</p>
            </div>

            <div className="behavior-cards-grid">
                {sampleBehaviors.map((user, i) => (
                    <motion.div
                        key={user.userId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="glass-card-hover behavior-card"
                    >
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User className="text-primary" size={20} />
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{user.userName}</p>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{user.userId}</p>
                                </div>
                            </div>
                            <span className={`risk-tag risk-${user.riskProfile}`}>
                                {user.riskProfile} risk
                            </span>
                        </div>

                        {/* Behavior Details */}
                        <div className="behavior-grid">
                            <div className="behavior-item">
                                <TrendingUp size={16} />
                                <span>₹{user.avgSpending.toLocaleString()} / day</span>
                            </div>
                            <div className="behavior-item">
                                <Clock size={16} />
                                <span>{user.typicalTime}</span>
                            </div>
                            <div className="behavior-item">
                                <MapPin size={16} />
                                <span>{user.commonLocation}</span>
                            </div>
                            <div className="behavior-item">
                                <Smartphone size={16} />
                                <span>{user.usualDevice}</span>
                            </div>
                        </div>

                        {/* Stats Summary */}
                        <div className="behavior-stats-bar">
                            <div className="behavior-stat">
                                <p className="stat-num">{user.txFrequency}</p>
                                <p className="stat-label">Tx/Day</p>
                            </div>
                            <div className="behavior-stat">
                                <p className={`stat-num ${user.anomalyCount > 0 ? "text-danger" : "text-success"}`}>
                                    {user.anomalyCount}
                                </p>
                                <p className="stat-label">Anomalies</p>
                            </div>
                            <div className="behavior-stat">
                                <p className="stat-label">Last Active</p>
                                <p className="stat-subnum">
                                    {new Date(user.lastActive).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                                </p>
                            </div>
                        </div>

                        {user.anomalyCount > 0 && (
                            <div className="anomaly-alert">
                                <AlertTriangle size={14} />
                                {user.anomalyCount} behavioral anomalies detected
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Behaviors;
