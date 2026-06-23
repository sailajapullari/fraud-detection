import razorpay
from django.conf import settings

class RazorpayClient:
    def __init__(self):
        self.client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

    def create_order(self, amount, currency='INR'):
        params = {
            'amount': int(amount * 100), # Razorpay amount is in paise
            'currency': currency,
            'payment_capture': 1
        }
        return self.client.order.create(data=params)

    def verify_payment_signature(self, params):
        try:
            return self.client.utility.verify_payment_signature(params)
        except Exception:
            return False

    def create_upi_qr(self, amount_paise, description="", notes=None):
        """Create a single-use UPI QR code for the given amount (in paise)."""
        payload = {
            "type": "upi_qr",
            "name": "Fraud Detection Demo",
            "usage": "single_use",
            "fixed_amount": True,
            "payment_amount": amount_paise,
            "description": description or f"Payment of ₹{amount_paise / 100:.2f}",
            "notes": notes or {},
        }
        return self.client.qrcode.create(payload)

razorpay_service = RazorpayClient()
