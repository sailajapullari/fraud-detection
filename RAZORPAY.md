# Razorpay integration (Fraud Detection project)

## 1. Razorpay in Django

Razorpay is listed in `backend/requirements.txt` and is installed with:

```bash
cd backend && pip install -r requirements.txt
```

## 2. Keys in settings.py

- **Key ID:** `rzp_test_SKv9M5zP69e2hB`
- **Secret:** `IWrIg3SqTDuMXlp44X1JVNSp`

Both are set as defaults in `backend/config/settings.py`. Override in production with env vars:

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

## 3. Payment flow (review → create → verify)

| Step              | URL                                    | Description                                                                 |
|-------------------|----------------------------------------|-----------------------------------------------------------------------------|
| Payment review    | `/api/fraud/payment-review/`           | Form: amount (INR), device, location → creates order, redirects to checkout |
| Create payment    | `/api/fraud/create-payment/<order_id>/` | Razorpay Checkout; on success calls verify API then redirects              |
| Verify (backend)  | `POST /api/fraud/verify-payment/`      | Verifies Razorpay signature, updates transaction, runs fraud analysis      |
| Success page      | `/api/fraud/payment-success/`          | Shown after successful verification                                         |
| Failed page       | `/api/fraud/payment-failed/`           | Shown when verification fails or payment is cancelled                      |

## 4. Backend verification

- `VerifyPaymentView` uses Razorpay **signature verification** with the keys above.
- On success it runs the existing fraud analysis and returns the risk result.

## 5. Templates

- `backend/fraud_analysis/templates/fraud_analysis/payment_review.html` – form to enter amount and details
- `backend/fraud_analysis/templates/fraud_analysis/create_payment.html` – Razorpay Checkout + handler that POSTs to verify, then redirects
- `payment_success.html` and `payment_failed.html` – result pages

## 6. URLs (in `backend/fraud_analysis/urls.py`)

- `payment-review/`
- `create-payment/<str:order_id>/`
- `payment-success/`
- `payment-failed/`

## How to test

1. Start backend: `python manage.py runserver 8000`
2. Open **http://localhost:8000/api/fraud/payment-review/**  
   Or from the React dashboard, click **Pay with Razorpay** (opens the same URL).
3. Enter amount (e.g. 500), submit → Razorpay Checkout opens → pay with test card → redirect to success/failed; transaction is verified and analyzed.

## Dashboard link

The React app has a **Pay with Razorpay** button in the header that opens the payment review page in a new tab.
