import random
import numpy as np
from sklearn.ensemble import RandomForestClassifier

class RiskEngine:
    def __init__(self):
        # In a real app, you would load a pickled model: 
        # self.model = joblib.load('fraud_model.pkl')
        pass

    def calculate_risk_score(self, transaction_data):
        """
        Accepts: amount, time, device_hash, ip_hash, location_hash
        Returns: {score: int, p_fraud: float, level: str}
        """
        # Feature extraction simulation
        amount = float(transaction_data.get('amount', 0))
        
        # Scoring logic (Simulated ML processing)
        # Higher amounts often correlated with higher risk in simple models
        base_score = 0
        
        if amount > 50000: base_score += 40
        elif amount > 10000: base_score += 20
        
        # Add some "ML Randomness" / Complexity
        # Note: In a real system, you'd pass features into the model.predict_proba()
        p_fraud = (base_score + random.randint(0, 40)) / 100.0
        p_fraud = min(p_fraud, 0.99)
        
        score = int(p_fraud * 100)
        
        level = "LOW"
        if score > 80: level = "CRITICAL"
        elif score > 60: level = "HIGH"
        elif score > 30: level = "MEDIUM"
        
        return {
            "risk_score": score,
            "fraud_probability": p_fraud,
            "risk_level": level
        }

risk_engine = RiskEngine()
