enum OrderStatus {
  "Pending" = "Pending",
  "Delivered" = "Delivered",
  "AcknowledgedBySeller" = "AcknowledgedBySeller",
  "Shipped" = "Shipped",
  "Cancelled" = "Cancelled",
  "Failed" = "Failed",
}
enum OrderPaymentStatus {
  "PENDING" = "PENDING",
  "COMPLETED" = "COMPLETED",
  "FAILED" = "FAILED",
}

enum SubscriptionStatus {
  "incomplete" = "incomplete",
  "incomplete_expired" = "incomplete_expired",
  "trialing" = "trialing",
  "active" = "active",
  "past_due" = "past_due",
  "canceled" = "canceled",
  "unpaid" = "unpaid",
  "end" = "end",
  "all" = "all",
}

enum BillingReason {
  "subscription_cycle" = "subscription_cycle",
  "subscription_create" = "subscription_create",
  "subscription_update" = "subscription_update",
  "manual" = "manual",
  "subscription_threshold" = "subscription_threshold",
  "upcoming" = "upcoming",
  "subscription" = "subscription"
}

enum InvoiceStatus {
  'draft' = 'draft',
  'open' = 'open',
  'paid' = 'paid',
  'uncollectible' = 'uncollectible',
  'void' = 'void',
}

enum PaymentIntentStatus {
  "requires_payment_method" = "requires_payment_method",
  "requires_action" = "requires_action",
  "processing" = "processing",
  "succeeded" = "succeeded",
  "canceled" = "canceled",
  "payment_failed" = "payment_failed", // webhook
}

enum PaymentStatus {
  "PENDING" = "PENDING",
  "COMPLETED" = "COMPLETED",
  "FAILED" = "FAILED",
  "REFUNDED" = "REFUNDED",
}

enum RefundStatus {
  "pending" = "pending",
  "succeeded" = "succeeded",
  "failed" = "failed",
  "canceled" = "canceled",
}

enum PayoutStatus {
  "paid" = "paid",
  "pending" = "pending",
  "in_transit" = "in_transit",
  "canceled" = "canceled",
  "failed" = "failed",
}

enum PaypalOrderIntentStatus {
  "CREATED" = "CREATED",
  "SAVED" = "SAVED",
  "APPROVED" = "APPROVED",
  "VOIDED" = "VOIDED",
  "COMPLETED" = "COMPLETED",
  "PAYER_ACTION_REQUIRED" = "PAYER_ACTION_REQUIRED",
}

enum PaymentType {
  "STRIPE" = "STRIPE",
  "PAYPAL" = "PAYPAL",
}

enum PaypalPaymentStatus {
  "COMPLETED" = "COMPLETED",
  "DECLINED" = "DECLINED",
  "PENDING" = "PENDING",
  "FAILED" = "FAILED",
  "PARTIALLY_REFUNDED" = "PARTIALLY_REFUNDED",
  "REFUNDED" = "REFUNDED",
}


export {
  OrderStatus,
  OrderPaymentStatus,
  PaymentIntentStatus,
  PaymentStatus,
  RefundStatus,
  PayoutStatus,
  PaypalOrderIntentStatus,
  PaymentType,
  SubscriptionStatus,
  BillingReason
};
