from django.db import models
from django.contrib.auth.models import User

class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    razorpay_order_id = models.CharField(max_length=255, unique=True)
    razorpay_payment_id = models.CharField(max_length=255, null=True, blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    device = models.CharField(max_length=255)
    ip_address = models.GenericIPAddressField()
    location = models.CharField(max_length=255, default="Unknown")
    timestamp = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default="PENDING") # PENDING, SUCCESS, FAILED, BLOCKED

    def __str__(self):
        return f"{self.razorpay_order_id} - {self.amount}"

class RiskAnalysis(models.Model):
    transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE, related_name='risk_analysis')
    risk_score = models.IntegerField() # 0-100
    risk_level = models.CharField(max_length=20) # LOW, MEDIUM, HIGH, CRITICAL
    anomaly_reasons = models.TextField(null=True, blank=True)
    fraud_probability = models.FloatField() # 0.0 - 1.0

    def __str__(self):
        return f"Risk: {self.risk_level} ({self.risk_score})"

class UserBehaviorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='behavior_profile')
    avg_spending = models.DecimalField(max_digits=12, decimal_places=2, default=0.0)
    active_hours = models.JSONField(default=list) # List of common hours
    known_devices = models.JSONField(default=list)
    known_locations = models.JSONField(default=list)
    transaction_frequency = models.FloatField(default=0.0) # Trans per day

    def __str__(self):
        return f"Profile: {self.user.username}"
