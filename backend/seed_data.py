import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from fraud_analysis.models import UserBehaviorProfile, Transaction, RiskAnalysis
from django.utils import timezone
import random

def seed_data():
    # 1. Create a demo user and profile
    user, _ = User.objects.get_or_create(username='demo_admin')
    profile, _ = UserBehaviorProfile.objects.get_or_create(
        user=user,
        defaults={
            'avg_spending': 2500,
            'active_hours': [9, 10, 11, 14, 15, 16, 20, 21],
            'known_devices': ['iPhone 15 Pro', 'MacBook Pro M3'],
            'known_locations': ['Mumbai', 'Bangalore']
        }
    )

    # 2. Add some mock successful transactions
    locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai']
    devices = ['iPhone 15 Pro', 'MacBook Pro M3', 'Windows 11']
    
    # Recent Successes
    for i in range(15):
        tx = Transaction.objects.create(
            user=user,
            razorpay_order_id=f"order_mock_{random.randint(10000, 99999)}",
            amount=random.randint(500, 4000),
            device=random.choice(devices),
            ip_address=f"192.168.1.{random.randint(1, 255)}",
            location=random.choice(locations),
            status='SUCCESS'
        )
        RiskAnalysis.objects.create(
            transaction=tx,
            risk_score=random.randint(5, 25),
            risk_level='LOW',
            fraud_probability=random.random() * 0.2
        )

    # Mock some Blocked/High Risk ones
    for i in range(5):
        amount = random.randint(45000, 95000)
        tx = Transaction.objects.create(
            user=user,
            razorpay_order_id=f"order_fraud_{random.randint(10000, 99999)}",
            amount=amount,
            device="Linux / Tor Exit Node",
            ip_address="45.16.22.1",
            location="Unknown",
            status='BLOCKED'
        )
        RiskAnalysis.objects.create(
            transaction=tx,
            risk_score=random.randint(85, 99),
            risk_level='CRITICAL',
            anomaly_reasons="Unusual Amount, Unknown Location, New Device",
            fraud_probability=0.9
        )

    print("Successfully seeded GuardianPay with mock data.")

if __name__ == '__main__':
    seed_data()
