from django.urls import path
from django.views.generic import RedirectView
from .views import (
    CreateOrderView, VerifyPaymentView, DashboardStatsView,
    RecentTransactionsView, SimulateTransactionView,
    PaymentReviewView, CreatePaymentView, CreateQRView,
    PaymentCallbackView, PaymentSuccessView, PaymentFailedView,
)

urlpatterns = [
    path('', RedirectView.as_view(url='/api/fraud/payment-review/', permanent=False), name='fraud-index'),
    # API (dashboard / frontend)
    path('create-order/', CreateOrderView.as_view(), name='create-order'),
    path('verify-payment/', VerifyPaymentView.as_view(), name='verify-payment'),
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('recent-transactions/', RecentTransactionsView.as_view(), name='recent-transactions'),
    path('simulate-transaction/', SimulateTransactionView.as_view(), name='simulate'),
    # Razorpay payment pages (review → create payment → verify)
    path('payment-review/', PaymentReviewView.as_view(), name='payment-review'),
    path('create-payment/<str:order_id>/', CreatePaymentView.as_view(), name='create-payment'),
    path('payment-callback/', PaymentCallbackView.as_view(), name='payment-callback'),
    path('create-qr/<str:order_id>/', CreateQRView.as_view(), name='create-qr'),
    path('payment-success/', PaymentSuccessView.as_view(), name='payment-success'),
    path('payment-failed/', PaymentFailedView.as_view(), name='payment-failed'),
]
