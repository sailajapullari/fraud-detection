export const realWorldCases = [
    {
        title: "Phishing & OTP Scams",
        icon: "smartphone",
        description: "Highly common social engineering where users are tricked into sharing sensitive credentials.",
        impact: "High",
        frequency: "Daily",
        how: "Fraudsters send fake SMS/WhatsApp messages about bank account blocking or electricity bill pending, asking for OTP verification.",
        detection: "Our system detects unusual session locations combined with rapid OTP entry from new IP addresses and blocklists known fraud numbers."
    },
    {
        title: "Identity Theft (Fake KYC)",
        icon: "key",
        description: "Using stolen documents to create mock accounts and bypass traditional verification.",
        impact: "Critical",
        frequency: "Weekly",
        how: "Stolen PAN/Aadhaar details are used to create digital wallets and facilitate money laundering or predatory loans.",
        detection: "Behavioral analytics flags accounts that show zero historical patterns but sudden high-velocity transaction bursts."
    },
    {
        title: "Fake Loan Apps",
        icon: "file-warning",
        description: "Apps that offer quick loans but harvest personal data and extort users.",
        impact: "High",
        frequency: "Constant",
        how: "Users install malicious APKs that gain access to contacts and gallery, then harass users for repayments at 100%+ interest.",
        detection: "ML models identify the predatory payment gateway endpoints and block transaction flows originating from blacklisted app signatures."
    },
    {
        title: "E-commerce QR Scams",
        icon: "store",
        description: "Tricking sellers into 'receiving' money by actually scanning a payment QR.",
        impact: "Medium",
        frequency: "Regular",
        how: "Buyer sends a QR code to a seller claiming it's to pay them, but it's actually a 'Request Money' link that drains the seller's account.",
        detection: "Transaction risk scoring flags unusual 'Request' patterns from accounts that typically only perform outgoing payments."
    }
];

export const sampleBehaviors = [
    {
        userId: "USR-9842",
        userName: "Rahul Sharma",
        riskProfile: "low",
        avgSpending: 1250,
        typicalTime: "10 AM - 2 PM",
        commonLocation: "Mumbai, MH",
        usualDevice: "iPhone 15 Pro",
        txFrequency: 4.2,
        anomalyCount: 0,
        lastActive: "2026-02-26T21:30:00Z"
    },
    {
        userId: "USR-4122",
        userName: "Amit Verma",
        riskProfile: "high",
        avgSpending: 25400,
        typicalTime: "2 AM - 4 AM",
        commonLocation: "Unknown (VPN)",
        usualDevice: "Insecure Linux Bot",
        txFrequency: 48.5,
        anomalyCount: 3,
        lastActive: "2026-02-26T21:45:00Z"
    },
    {
        userId: "USR-7731",
        userName: "Sneha Kapur",
        riskProfile: "medium",
        avgSpending: 8400,
        typicalTime: "6 PM - 10 PM",
        commonLocation: "Delhi, DL",
        usualDevice: "MacBook Pro M3",
        txFrequency: 2.1,
        anomalyCount: 1,
        lastActive: "2026-02-26T20:15:00Z"
    },
    {
        userId: "USR-2099",
        userName: "Vikram Singh",
        riskProfile: "low",
        avgSpending: 500,
        typicalTime: "9 AM - 6 PM",
        commonLocation: "Bangalore, KA",
        usualDevice: "Samsung S24",
        txFrequency: 1.5,
        anomalyCount: 0,
        lastActive: "2026-02-26T18:00:00Z"
    }
];
