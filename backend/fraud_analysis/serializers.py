from rest_framework import serializers
from .models import Transaction, RiskAnalysis, UserBehaviorProfile

class RiskAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiskAnalysis
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    risk_analysis = RiskAnalysisSerializer(read_only=True)
    class Meta:
        model = Transaction
        fields = '__all__'

class UserBehaviorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserBehaviorProfile
        fields = '__all__'
