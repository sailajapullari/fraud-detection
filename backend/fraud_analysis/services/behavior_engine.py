from decimal import Decimal

class BehaviorEngine:
    def analyze(self, profile, transaction_data):
        """
        Compares transaction with user behavior profile.
        Returns: {score_modifier: int, reasons: list}
        """
        score_modifier = 0
        reasons = []

        if not profile:
            return score_modifier, reasons

        amount = Decimal(str(transaction_data.get('amount', 0)))
        device = transaction_data.get('device')
        location = transaction_data.get('location')
        hour = transaction_data.get('hour') # 0-23

        # 1. Unusual Amount (200% above average)
        if profile.avg_spending > 0 and amount > (profile.avg_spending * 2):
            score_modifier += 15
            reasons.append("Unusual Amount")

        # 2. New Device
        if device not in profile.known_devices:
            score_modifier += 10
            reasons.append("New Device")

        # 3. Unknown Location
        if location not in profile.known_locations:
            score_modifier += 15
            reasons.append("Unknown Location")

        # 4. Odd Transaction Time
        if hour not in profile.active_hours and profile.active_hours:
            score_modifier += 10
            reasons.append("Odd Transaction Time")

        return score_modifier, reasons

behavior_engine = BehaviorEngine()
