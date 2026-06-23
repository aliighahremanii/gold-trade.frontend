export type TradeWorkflowPhase =
  | "idle"
  | "quote_loading"
  | "quote_ready"
  | "quote_expired"
  | "confirming"
  | "order_tracking"
  | "completed"
  | "failed"
  | "manual_review_required"
  | "unknown";
