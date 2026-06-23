import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Count, Avg, Sum
from django.shortcuts import render, redirect
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.conf import settings
from django.urls import reverse
from datetime import timedelta
from django.utils import timezone

from .models import Transaction, RiskAnalysis, UserBehaviorProfile
from .serializers import TransactionSerializer
from .services.risk_engine import risk_engine
from .services.behavior_engine import behavior_engine
from .services.razorpay_client import razorpay_service


def _verify_and_analyze_payment(razorpay_order_id, razorpay_payment_id, razorpay_signature, device="Unknown", location="Unknown"):
    """Verify Razorpay signature, update transaction, run fraud analysis. Returns (success: bool, transaction_id or None)."""
    verify_params = {
        "razorpay_order_id": razorpay_order_id,
        "razorpay_payment_id": razorpay_payment_id,
        "razorpay_signature": razorpay_signature,
    }
    is_valid = razorpay_service.verify_payment_signature(verify_params)
    try:
        transaction = Transaction.objects.get(razorpay_order_id=razorpay_order_id)
        transaction.razorpay_payment_id = razorpay_payment_id
        transaction.status = "SUCCESS" if is_valid else "FAILED"
        transaction.save()
        if not is_valid:
            return False, None
        profile, _ = UserBehaviorProfile.objects.get_or_create(id=1, defaults={"avg_spending": 1000})
        hour = timezone.now().hour
        risk_result = risk_engine.calculate_risk_score(
            {"amount": transaction.amount, "device": device, "location": location}
        )
        behavior_modifier, reasons = behavior_engine.analyze(
            profile,
            {"amount": transaction.amount, "device": device, "location": location, "hour": hour},
        )
        total_risk_score = min(risk_result["risk_score"] + behavior_modifier, 100)
        final_level = "LOW"
        if total_risk_score > 80:
            final_level = "CRITICAL"
        elif total_risk_score > 60:
            final_level = "HIGH"
        elif total_risk_score > 30:
            final_level = "MEDIUM"
        if final_level in ["HIGH", "CRITICAL"]:
            transaction.status = "BLOCKED"
            transaction.save()
        RiskAnalysis.objects.create(
            transaction=transaction,
            risk_score=total_risk_score,
            risk_level=final_level,
            anomaly_reasons=", ".join(reasons) if reasons else "None Detected",
            fraud_probability=total_risk_score / 100.0,
        )
        return True, transaction.id
    except Transaction.DoesNotExist:
        return False, None


class CreateOrderView(APIView):
    def post(self, request):
        amount = request.data.get('amount')
        if not amount:
            return Response({"error": "Amount is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            order = razorpay_service.create_order(amount)
            # Create a pending transaction record
            # In a demo we might not have a logged in user, so null is fine
            Transaction.objects.create(
                razorpay_order_id=order['id'],
                amount=amount,
                device=request.data.get('device', 'Unknown'),
                ip_address=request.META.get('REMOTE_ADDR', '0.0.0.0'),
                location=request.data.get('location', 'Unknown'),
                status='PENDING'
            )
            return Response(order)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class VerifyPaymentView(APIView):
    def post(self, request):
        data = request.data
        razorpay_order_id = data.get("razorpay_order_id")
        razorpay_payment_id = data.get("razorpay_payment_id")
        razorpay_signature = data.get("razorpay_signature")
        device = data.get("device", "Unknown")
        location = data.get("location", "Unknown")
        if not razorpay_order_id or not razorpay_payment_id or not razorpay_signature:
            return Response({"error": "Missing payment params"}, status=status.HTTP_400_BAD_REQUEST)
        success, tx_id = _verify_and_analyze_payment(
            razorpay_order_id, razorpay_payment_id, razorpay_signature, device, location
        )
        if success and tx_id:
            tx = Transaction.objects.get(pk=tx_id)
            ra = getattr(tx, "risk_analysis", None)
            return Response({
                "status": "success",
                "id": tx_id,
                "risk_analysis": {
                    "score": ra.risk_score if ra else 0,
                    "level": ra.risk_level if ra else "LOW",
                    "reasons": (ra.anomaly_reasons or "").split(", ") if ra else [],
                },
            })
        if not success and tx_id is None:
            try:
                Transaction.objects.get(razorpay_order_id=razorpay_order_id)
            except Transaction.DoesNotExist:
                return Response({"error": "Transaction Not Found"}, status=404)
        return Response({"status": "failed"})

class DashboardStatsView(APIView):
    def get(self, request):
        total_tx = Transaction.objects.count()
        flagged_tx = RiskAnalysis.objects.filter(risk_level__in=['HIGH', 'CRITICAL']).count()
        blocked_tx = Transaction.objects.filter(status='BLOCKED').count()
        avg_risk = RiskAnalysis.objects.aggregate(avg=Avg('risk_score'))['avg'] or 0
        
        # Risk Distribution
        risk_dist = RiskAnalysis.objects.values('risk_level').annotate(count=Count('id'))
        dist_map = {row['risk_level']: row['count'] for row in risk_dist}
        
        # Last 24h Transactions (grouped by hour)
        last_24h = timezone.now() - timedelta(hours=24)
        tx_volume = Transaction.objects.filter(timestamp__gte=last_24h).values('timestamp__hour').annotate(count=Count('id'))
        
        return Response({
            "total_transactions": total_tx,
            "flagged_transactions": flagged_tx,
            "blocked_transactions": blocked_tx,
            "avg_risk_score": int(avg_risk),
            "risk_distribution": dist_map,
            "volume_data": list(tx_volume)
        })

class RecentTransactionsView(APIView):
    def get(self, request):
        txs = Transaction.objects.all().order_by('-timestamp')[:10]
        serializer = TransactionSerializer(txs, many=True)
        return Response(serializer.data)

class SimulateTransactionView(APIView):
    def post(self, request):
        amount = request.data.get('amount', 500)
        device = request.data.get('device', 'MacBook Pro')
        location = request.data.get('location', 'Mumbai')
        order_id = f"sim_order_{random.randint(1000, 9999)}"
        
        transaction = Transaction.objects.create(
            razorpay_order_id=order_id,
            amount=amount,
            device=device,
            ip_address="127.0.0.1",
            location=location,
            status='SUCCESS'
        )

        # Run Analysis
        profile, _ = UserBehaviorProfile.objects.get_or_create(id=1, defaults={'avg_spending': 1000, 'active_hours': [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]})
        
        risk_result = risk_engine.calculate_risk_score({'amount': amount, 'device': device, 'location': location})
        behavior_modifier, reasons = behavior_engine.analyze(profile, {
            'amount': amount, 'device': device, 'location': location, 'hour': timezone.now().hour
        })

        total_risk_score = min(risk_result['risk_score'] + behavior_modifier, 100)
        
        final_level = "LOW"
        if total_risk_score > 80: final_level = "CRITICAL"
        elif total_risk_score > 60: final_level = "HIGH"
        elif total_risk_score > 30: final_level = "MEDIUM"

        if final_level in ["HIGH", "CRITICAL"]:
            transaction.status = "BLOCKED"
            transaction.save()

        RiskAnalysis.objects.create(
            transaction=transaction,
            risk_score=total_risk_score,
            risk_level=final_level,
            anomaly_reasons=", ".join(reasons) if reasons else "None Detected",
            fraud_probability=total_risk_score/100.0
        )

        return Response({
            "status": "success", 
            "level": final_level, 
            "score": total_risk_score,
            "breakdown": {
                "ml_score": risk_result['risk_score'],
                "behavior_score": behavior_modifier,
                "reasons": reasons,
                "amount": amount,
                "device": device,
                "location": location,
                "timestamp": timezone.now().isoformat()
            }
        })


# ---------- Razorpay payment HTML views (dashboard integration) ----------

class PaymentReviewView(View):
    """Payment review page: form to enter amount and details before creating order."""
    def get(self, request):
        return render(request, 'fraud_analysis/payment_review.html', {
            'razorpay_key_id': settings.RAZORPAY_KEY_ID,
            'dashboard_url': getattr(settings, 'DASHBOARD_URL', 'http://localhost:5173'),
        })

    def post(self, request):
        amount = request.POST.get('amount')
        device = request.POST.get('device', 'Unknown')
        location = request.POST.get('location', 'Unknown')
        dashboard_url = getattr(settings, 'DASHBOARD_URL', 'http://localhost:5173')
        if not amount:
            return render(request, 'fraud_analysis/payment_review.html', {
                'error': 'Amount is required',
                'razorpay_key_id': settings.RAZORPAY_KEY_ID,
                'dashboard_url': dashboard_url,
            })
        try:
            amount = float(amount)
        except ValueError:
            return render(request, 'fraud_analysis/payment_review.html', {
                'error': 'Invalid amount',
                'razorpay_key_id': settings.RAZORPAY_KEY_ID,
                'dashboard_url': dashboard_url,
            })
        try:
            order = razorpay_service.create_order(amount)
            Transaction.objects.create(
                razorpay_order_id=order['id'],
                amount=amount,
                device=device,
                ip_address=request.META.get('REMOTE_ADDR', '0.0.0.0'),
                location=location,
                status='PENDING'
            )
            return redirect('create-payment', order_id=order['id'])
        except Exception as e:
            return render(request, 'fraud_analysis/payment_review.html', {
                'error': str(e),
                'razorpay_key_id': settings.RAZORPAY_KEY_ID,
                'dashboard_url': dashboard_url,
            })


class CreatePaymentView(View):
    """Create payment page: loads Razorpay Checkout; on success calls verify and redirects. QR generated server-side."""
    def get(self, request, order_id):
        try:
            tx = Transaction.objects.get(razorpay_order_id=order_id, status='PENDING')
        except Transaction.DoesNotExist:
            return render(request, 'fraud_analysis/payment_failed.html', {
                'error': 'Order not found or already processed.',
                'dashboard_url': getattr(settings, 'DASHBOARD_URL', 'http://localhost:5173'),
            })
        amount = float(tx.amount)
        amount_paise = int(amount * 100)
        qr_image_url = None
        qr_error = None
        try:
            qr = razorpay_service.create_upi_qr(
                amount_paise,
                description=f"Payment of ₹{amount}",
                notes={"order_id": order_id},
            )
            qr_image_url = qr.get("image_url") or qr.get("short_url") or ""
        except Exception as e:
            qr_error = str(e)
        return render(request, 'fraud_analysis/create_payment.html', {
            'order_id': order_id,
            'amount': amount,
            'amount_paise': amount_paise,
            'device': tx.device,
            'location': tx.location,
            'razorpay_key_id': settings.RAZORPAY_KEY_ID,
            'verify_url': request.build_absolute_uri(reverse('verify-payment')),
            'callback_url': request.build_absolute_uri(reverse('payment-callback')),
            'success_url': request.build_absolute_uri(reverse('payment-success')),
            'failed_url': request.build_absolute_uri(reverse('payment-failed')),
            'dashboard_url': getattr(settings, 'DASHBOARD_URL', 'http://localhost:5173'),
            'qr_image_url': qr_image_url,
            'qr_error': qr_error,
            'qr_code_path': reverse('create-qr', kwargs={'order_id': order_id}),
        })


@method_decorator(csrf_exempt, name="dispatch")
class PaymentCallbackView(View):
    """Razorpay redirect callback: receives POST after bank/redirect flow, verifies and redirects to success/failed page. Fixes net banking blank popup by using redirect=true."""
    def post(self, request):
        # Razorpay sends razorpay_payment_id, razorpay_order_id, razorpay_signature (or error for failure)
        if request.POST.get("razorpay_order_id") and request.POST.get("razorpay_payment_id") and request.POST.get("razorpay_signature"):
            order_id = request.POST.get("razorpay_order_id")
            payment_id = request.POST.get("razorpay_payment_id")
            signature = request.POST.get("razorpay_signature")
            try:
                tx = Transaction.objects.get(razorpay_order_id=order_id)
                device, location = tx.device, tx.location
            except Transaction.DoesNotExist:
                device, location = "Unknown", "Unknown"
            success, tx_id = _verify_and_analyze_payment(order_id, payment_id, signature, device, location)
            if success and tx_id:
                url = request.build_absolute_uri(reverse("payment-success")) + "?tx_id=" + str(tx_id)
                return redirect(url)
        failed_url = request.build_absolute_uri(reverse("payment-failed"))
        return redirect(failed_url)


class CreateQRView(APIView):
    """Create a UPI QR code for the given order; returns image_url and qr_id."""
    def get(self, request, order_id):
        try:
            tx = Transaction.objects.get(razorpay_order_id=order_id, status='PENDING')
        except Transaction.DoesNotExist:
            return Response({"error": "Order not found or already processed."}, status=status.HTTP_404_NOT_FOUND)
        amount_paise = int(float(tx.amount) * 100)
        try:
            qr = razorpay_service.create_upi_qr(
                amount_paise,
                description=f"Payment of ₹{tx.amount}",
                notes={"order_id": order_id},
            )
            return Response({
                "image_url": qr.get("image_url", ""),
                "qr_id": qr.get("id", ""),
                "short_url": qr.get("image_url", ""),
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PaymentSuccessView(View):
    """Shown after payment verification succeeds; optionally show transaction details from ?tx_id=."""
    def get(self, request):
        tx = None
        tx_id = request.GET.get('tx_id')
        dashboard_url = getattr(settings, 'DASHBOARD_URL', 'http://localhost:5173')
        if tx_id:
            try:
                tx = Transaction.objects.select_related('risk_analysis').get(pk=tx_id)
            except (Transaction.DoesNotExist, ValueError):
                pass
        if not tx and not tx_id:
            # Show latest successful transaction if no tx_id
            tx = Transaction.objects.filter(status__in=('SUCCESS', 'BLOCKED')).select_related('risk_analysis').order_by('-timestamp').first()
        return render(request, 'fraud_analysis/payment_success.html', {
            'transaction': tx,
            'dashboard_url': dashboard_url,
        })


class PaymentFailedView(View):
    """Shown after payment verification fails or user cancels."""
    def get(self, request):
        return render(request, 'fraud_analysis/payment_failed.html', {
            'dashboard_url': getattr(settings, 'DASHBOARD_URL', 'http://localhost:5173'),
        })
