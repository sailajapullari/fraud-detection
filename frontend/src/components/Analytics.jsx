import React from 'react';
import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    Radar,
    CartesianGrid,
} from "recharts";
import { Shield, Brain, Activity, TrendingUp } from "lucide-react";

const typeData = [
    { type: "UPI", count: 45, color: "hsl(217, 91%, 60%)" },
    { type: "Card", count: 32, color: "hsl(160, 84%, 39%)" },
    { type: "NetBanking", count: 15, color: "hsl(38, 92%, 50%)" },
    { type: "Wallet", count: 8, color: "hsl(262, 83%, 58%)" },
];

const scoreDistribution = [
    { range: "0-20", count: 120 },
    { range: "21-40", count: 80 },
    { range: "41-60", count: 45 },
    { range: "61-80", count: 25 },
    { range: "81-100", count: 12 },
];

const hourlyRiskData = [
    { hour: "00:00", risk: 24 },
    { hour: "04:00", risk: 65 },
    { hour: "08:00", risk: 40 },
    { hour: "12:00", risk: 32 },
    { hour: "16:00", risk: 45 },
    { hour: "20:00", risk: 58 },
    { hour: "23:59", risk: 78 },
];

const riskFactors = [
    { factor: "Velocity", value: 85 },
    { factor: "Geo-Shift", value: 65 },
    { factor: "Device ID", value: 90 },
    { factor: "Amount", value: 45 },
    { factor: "History", value: 70 },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

const Analytics = () => {
    return (
        <motion.div
            className="analytics-container"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="section-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div className="logo-box" style={{ width: '48px', height: '48px' }}>
                        <Brain color="white" size={28} />
                    </div>
                    <div>
                        <h1 className="section-title">Cognitive Analytics</h1>
                        <p className="section-desc">Advanced fraud pattern detection and heuristic analysis</p>
                    </div>
                </div>
            </div>

            <div className="stats-grid">
                <motion.div variants={itemVariants} className="glass-card-hover stats-card">
                    <Shield className="text-primary mb-2" size={24} />
                    <div className="text-2xl font-bold">99.8%</div>
                    <div className="text-xs text-muted">Model Precision</div>
                </motion.div>
                <motion.div variants={itemVariants} className="glass-card-hover stats-card">
                    <Activity className="text-success mb-2" size={24} />
                    <div className="text-2xl font-bold">1.2ms</div>
                    <div className="text-xs text-muted">Avg Latency</div>
                </motion.div>
                <motion.div variants={itemVariants} className="glass-card-hover stats-card">
                    <TrendingUp className="text-warning mb-2" size={24} />
                    <div className="text-2xl font-bold">2.4k</div>
                    <div className="text-xs text-muted">Daily Scans</div>
                </motion.div>
            </div>

            <div className="charts-grid">
                {/* Risk Score Distribution */}
                <motion.div variants={itemVariants} className="glass-card chart-card">
                    <h3 className="chart-title">Risk Score Distribution</h3>
                    <div style={{ height: '240px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={scoreDistribution}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="range" stroke="var(--text-muted)" fontSize={12} />
                                <YAxis stroke="var(--text-muted)" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px' }}
                                />
                                <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Transaction Channels */}
                <motion.div variants={itemVariants} className="glass-card chart-card">
                    <h3 className="chart-title">Channel Distribution</h3>
                    <div style={{ height: '240px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={typeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="count"
                                >
                                    {typeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Temporal Risk Pattern */}
                <motion.div variants={itemVariants} className="glass-card chart-card" style={{ gridColumn: 'span 2' }}>
                    <h3 className="chart-title">Temporal Risk Pattern (24h)</h3>
                    <div style={{ height: '240px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={hourlyRiskData}>
                                <defs>
                                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--danger)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--danger)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="hour" stroke="var(--text-muted)" fontSize={12} />
                                <YAxis stroke="var(--text-muted)" fontSize={12} />
                                <Tooltip />
                                <Area type="monotone" dataKey="risk" stroke="var(--danger)" fillOpacity={1} fill="url(#colorRisk)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Factor Radar */}
                <motion.div variants={itemVariants} className="glass-card chart-card" style={{ gridColumn: 'span 2' }}>
                    <h3 className="chart-title">Core Risk Heuristics</h3>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={riskFactors}>
                                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                <PolarAngleAxis dataKey="factor" stroke="var(--text-muted)" fontSize={12} />
                                <Radar
                                    name="Risk Intensity"
                                    dataKey="value"
                                    stroke="var(--primary)"
                                    fill="var(--primary)"
                                    fillOpacity={0.5}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            <motion.div variants={itemVariants} className="insight-card p-6" style={{ marginTop: '20px', borderRadius: '24px' }}>
                <h4 style={{ margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Brain size={20} className="text-primary" />
                    AI Strategic Insight
                </h4>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    Current telemetry indicates a 15% increase in high-velocity UPI transactions during non-standard hours (02:00 - 05:00).
                    Anomaly detection suggests automated script patterns. Recommended action: Enable strict MFA for transactions exceeding ₹10,000 in this window.
                </p>
            </motion.div>
        </motion.div>
    );
};

export default Analytics;
