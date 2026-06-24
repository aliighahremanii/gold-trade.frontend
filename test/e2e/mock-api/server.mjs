/**
 * Local mock API for Playwright workflow tests.
 *
 * Serves module paths under /api/{module}/v1/** with deterministic state transitions.
 * Start via `bun run test/e2e/mock-api/server.mjs` (also started by playwright.config.ts).
 */
const PORT = Number(process.env.E2E_MOCK_API_PORT ?? 3099);

const USERS = {
  "e2e-customer@test.local": {
    password: "E2eCustomer1!",
    userId: "e2e-customer-user",
    roles: ["customer"],
    token: "e2e-customer-token",
  },
  "e2e-admin@test.local": {
    password: "E2eAdmin1!",
    userId: "e2e-admin-user",
    roles: ["admin"],
    token: "e2e-admin-token",
  },
};

/** @type {Map<string, unknown>} */
const state = new Map();

function nowIso() {
  return new Date().toISOString();
}

function futureIso(secondsFromNow) {
  return new Date(Date.now() + secondsFromNow * 1000).toISOString();
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function empty(status = 204) {
  return new Response(null, { status });
}

function problem(status, message, code = "mock_error") {
  return json({ code, message }, status);
}

function getBearer(request) {
  const header = request.headers.get("authorization") ?? "";

  if (header.toLowerCase().startsWith("bearer ")) {
    return header.slice(7).trim();
  }

  return null;
}

function resolveUser(request) {
  const token = getBearer(request);

  if (!token) {
    return null;
  }

  return Object.values(USERS).find((user) => user.token === token) ?? null;
}

function requireUser(request) {
  const user = resolveUser(request);

  if (!user) {
    return { error: problem(401, "Authentication required") };
  }

  return { user };
}

function parsePath(url) {
  const { pathname } = new URL(url);
  const match = pathname.match(/^\/api\/([^/]+)\/v1\/(.*)$/);

  if (!match) {
    return null;
  }

  return {
    module: match[1],
    subpath: match[2],
    segments: match[2].split("/").filter(Boolean),
  };
}

function currentUserResponse(user) {
  return {
    userId: user.userId,
    email: Object.entries(USERS).find(([, value]) => value.userId === user.userId)?.[0] ?? "user@test.local",
    mobileNumber: "+989121234567",
    nationalCode: "0012345678",
    status: "active",
    roles: user.roles,
    isEmailVerified: true,
    isMobileVerified: true,
    totpEnabled: false,
  };
}

function authTokens(user) {
  return {
    accessToken: user.token,
    accessTokenExpiresAt: futureIso(3600),
    refreshToken: `${user.token}-refresh`,
    refreshTokenExpiresAt: futureIso(86400),
    sessionId: `session-${user.userId}`,
    userId: user.userId,
    isEmailVerified: true,
    isMobileVerified: true,
    requiresTotp: false,
  };
}

function walletAccounts(userId) {
  return [
    {
      id: "wallet-irr",
      user_id: userId,
      asset_code: "IRR",
      available_balance: 50_000_000,
      locked_balance: 0,
      total_balance: 50_000_000,
      status: "active",
      created_at: nowIso(),
      updated_at: nowIso(),
    },
    {
      id: "wallet-xau",
      user_id: userId,
      asset_code: "XAU",
      available_balance: 5_000,
      locked_balance: 0,
      total_balance: 5_000,
      status: "active",
      created_at: nowIso(),
      updated_at: nowIso(),
    },
  ];
}

function pricingPolicy() {
  return {
    market_symbol: "XAU-IRR",
    base_asset_code: "XAU",
    quote_asset_code: "IRR",
    quote_per_base_unit: "g",
    created_at: nowIso(),
    updated_at: nowIso(),
  };
}

function selectedPrice() {
  const stored = state.get("selectedPrice");

  return (
    stored ?? {
      market_symbol: "XAU-IRR",
      buy_price: 5_000_000,
      sell_price: 4_950_000,
      quote_per_base_unit: "g",
      source: "manual",
      market_status: state.get("marketStatus") ?? "open",
      price_snapshot_id: "price-snapshot-1",
      selected_at: nowIso(),
      effective_from: nowIso(),
    }
  );
}

function marketStatus() {
  return {
    market_symbol: "XAU-IRR",
    status: state.get("marketStatus") ?? "open",
    updated_at: nowIso(),
    updated_by: "e2e-admin-user",
  };
}

function createQuote(body, user) {
  const quoteId = `quote-${Date.now()}`;
  const displayAmount = body.display_amount ?? 1000;
  const isExpiredFixture = displayAmount === 7777;
  const quote = {
    id: quoteId,
    user_id: user.userId,
    market_symbol: body.market_symbol ?? "XAU-IRR",
    side: body.side ?? "buy",
    status: isExpiredFixture ? "expired" : "pending",
    base_asset_code: "XAU",
    base_unit_code: "mg",
    quote_asset_code: "IRR",
    display_unit: body.display_unit ?? "g",
    display_amount: displayAmount,
    base_amount: displayAmount * 1000,
    unit_price: 5_000_000,
    gross_quote_amount: 5_000_000,
    fee_amount: 50_000,
    total_quote_amount: 5_050_000,
    price_source: "manual",
    price_snapshot_id: "price-snapshot-1",
    quote_per_base_unit: "g",
    created_at: nowIso(),
    expires_at: isExpiredFixture ? "2020-01-01T00:00:00.000Z" : futureIso(120),
  };

  state.set(`quote:${quoteId}`, quote);
  return quote;
}

function getQuote(quoteId) {
  return state.get(`quote:${quoteId}`);
}

function createOrder(quoteId, user) {
  const orderId = `order-${Date.now()}`;
  const order = {
    id: orderId,
    user_id: user.userId,
    quote_id: quoteId,
    market_symbol: "XAU-IRR",
    side: "buy",
    status: "settlement_pending",
    base_asset_code: "XAU",
    base_unit_code: "mg",
    quote_asset_code: "IRR",
    base_amount: 1000,
    total_quote_amount: 5_050_000,
    price_snapshot_id: "price-snapshot-1",
    idempotency_key: `order-key-${orderId}`,
    created_at: nowIso(),
    updated_at: nowIso(),
  };

  state.set(`order:${orderId}`, order);
  state.set(`order:${orderId}:polls`, 0);
  return order;
}

function getOrder(orderId) {
  const order = state.get(`order:${orderId}`);

  if (!order) {
    return null;
  }

  const polls = Number(state.get(`order:${orderId}:polls`) ?? 0) + 1;
  state.set(`order:${orderId}:polls`, polls);

  if (polls >= 2 && order.status === "settlement_pending") {
    const settled = {
      ...order,
      status: "settled",
      completed_at: nowIso(),
      updated_at: nowIso(),
      execution_id: `exec-${orderId}`,
    };
    state.set(`order:${orderId}`, settled);
    return settled;
  }

  return order;
}

function createDeposit(body, user) {
  const idempotencyKey = body.idempotency_key ?? `dep-key-${Date.now()}`;

  if (state.has(`deposit-idem:${idempotencyKey}`)) {
    return {
      duplicate: true,
      resourceId: state.get(`deposit-idem:${idempotencyKey}`),
    };
  }

  const depositId = `deposit-${Date.now()}`;
  const deposit = {
    id: depositId,
    user_id: user.userId,
    amount: body.amount,
    status: "awaiting_confirmation",
    gateway_provider: "mock",
    idempotency_key: idempotencyKey,
    created_at: nowIso(),
    updated_at: nowIso(),
  };

  state.set(`deposit:${depositId}`, deposit);
  state.set(`deposit-idem:${idempotencyKey}`, depositId);
  return deposit;
}

function getDeposit(depositId) {
  const deposit = state.get(`deposit:${depositId}`);

  if (!deposit) {
    return null;
  }

  if (deposit.status === "awaiting_confirmation") {
    const confirmed = {
      ...deposit,
      status: "confirmed",
      confirmed_at: nowIso(),
      updated_at: nowIso(),
      bank_reference: "MOCK-BANK-REF",
    };
    state.set(`deposit:${depositId}`, confirmed);
    return confirmed;
  }

  return deposit;
}

function createWithdrawal(body, user) {
  const withdrawalId = `withdrawal-${Date.now()}`;
  const withdrawal = {
    id: withdrawalId,
    user_id: user.userId,
    amount: body.amount,
    status: "pending_approval",
    bank_account_reference: body.bank_account_reference,
    idempotency_key: body.idempotency_key ?? `wd-key-${withdrawalId}`,
    created_at: nowIso(),
    updated_at: nowIso(),
  };

  state.set(`withdrawal:${withdrawalId}`, withdrawal);
  return withdrawal;
}

function getWithdrawal(withdrawalId) {
  return state.get(`withdrawal:${withdrawalId}`);
}

function deliveryZones() {
  return [
    {
      id: "zone-tehran-1",
      code: "THR-01",
      name: "Tehran Central",
      city: "Tehran",
      active: true,
      created_at: nowIso(),
    },
  ];
}

function seedAuditRecords() {
  return [
    {
      id: "audit-1",
      action: "set_manual_price",
      actor_id: "e2e-admin-user",
      target_type: "market",
      target_id: "XAU-IRR",
      business_reference: "price-snapshot-1",
      reason: "E2E seeded audit event",
      status: "recorded",
      created_at: "2026-06-23T10:00:00.000Z",
      updated_at: "2026-06-23T10:00:00.000Z",
    },
    {
      id: "audit-2",
      action: "approve_delivery",
      actor_id: "e2e-admin-user",
      target_type: "delivery_request",
      target_id: "delivery-seed-1",
      reason: "E2E seeded delivery approval",
      status: "recorded",
      created_at: "2026-06-23T11:00:00.000Z",
      updated_at: "2026-06-23T11:00:00.000Z",
    },
  ];
}

function getAuditRecord(recordId) {
  const seeded = seedAuditRecords().find((record) => record.id === recordId);
  return state.get(`audit:${recordId}`) ?? seeded ?? null;
}

function listAuditRecords() {
  const dynamic = [...state.entries()]
    .filter(([key]) => key.startsWith("audit:"))
    .map(([, value]) => value);

  const byId = new Map(seedAuditRecords().map((record) => [record.id, record]));
  for (const record of dynamic) {
    byId.set(record.id, record);
  }

  return [...byId.values()];
}

function seedReconciliationRuns() {
  return [
    {
      id: "run-seed-1",
      run_type: "wallet_ledger",
      status: "completed",
      correlation_id: "corr-seed-1",
      scope_user_id: "e2e-customer-user",
      scope_asset_code: "IRR",
      matched_count: 1,
      mismatch_count: 1,
      summary: "E2E seeded wallet-ledger run",
      started_at: "2026-06-23T09:00:00.000Z",
      completed_at: "2026-06-23T09:01:00.000Z",
      created_at: "2026-06-23T09:00:00.000Z",
      updated_at: "2026-06-23T09:01:00.000Z",
    },
  ];
}

function seedReconciliationMismatches() {
  return [
    {
      id: "mm-seed-1",
      run_id: "run-seed-1",
      mismatch_type: "balance_delta",
      status: "open",
      description: "Wallet balance differs from ledger balance",
      expected_value: "50000000",
      actual_value: "49999900",
      created_at: "2026-06-23T09:01:00.000Z",
      updated_at: "2026-06-23T09:01:00.000Z",
    },
  ];
}

function getReconciliationRun(runId) {
  const seeded = seedReconciliationRuns().find((run) => run.id === runId);
  return state.get(`reconciliation-run:${runId}`) ?? seeded ?? null;
}

function listReconciliationRuns() {
  const dynamic = [...state.entries()]
    .filter(([key]) => key.startsWith("reconciliation-run:"))
    .map(([, value]) => value);

  const byId = new Map(seedReconciliationRuns().map((run) => [run.id, run]));
  for (const run of dynamic) {
    byId.set(run.id, run);
  }

  return [...byId.values()].sort((left, right) =>
    String(right.created_at).localeCompare(String(left.created_at)),
  );
}

function getReconciliationMismatch(mismatchId) {
  const seeded = seedReconciliationMismatches().find((mismatch) => mismatch.id === mismatchId);
  return state.get(`reconciliation-mismatch:${mismatchId}`) ?? seeded ?? null;
}

function listReconciliationMismatches() {
  const dynamic = [...state.entries()]
    .filter(([key]) => key.startsWith("reconciliation-mismatch:"))
    .map(([, value]) => value);

  const byId = new Map(seedReconciliationMismatches().map((mismatch) => [mismatch.id, mismatch]));
  for (const mismatch of dynamic) {
    byId.set(mismatch.id, mismatch);
  }

  return [...byId.values()];
}

function createWalletLedgerRun(body) {
  const runId = `run-${Date.now()}`;
  const mismatchId = `mm-${Date.now()}`;
  const run = {
    id: runId,
    run_type: "wallet_ledger",
    status: "completed",
    correlation_id: body.correlation_id,
    scope_user_id: body.user_id,
    scope_asset_code: body.asset_code,
    matched_count: 0,
    mismatch_count: 1,
    summary: "Wallet-ledger comparison completed",
    started_at: nowIso(),
    completed_at: nowIso(),
    created_at: nowIso(),
    updated_at: nowIso(),
  };
  const mismatch = {
    id: mismatchId,
    run_id: runId,
    mismatch_type: "balance_delta",
    status: "open",
    description: "Mock wallet-ledger mismatch",
    expected_value: "50000000",
    actual_value: "49999900",
    created_at: nowIso(),
    updated_at: nowIso(),
  };

  state.set(`reconciliation-run:${runId}`, run);
  state.set(`reconciliation-mismatch:${mismatchId}`, mismatch);
  return run;
}

function resolveReconciliationMismatch(mismatchId, body) {
  const existing = getReconciliationMismatch(mismatchId);
  if (!existing) {
    return null;
  }

  const resolved = {
    ...existing,
    status: body.dismiss ? "dismissed" : "resolved",
    resolution_notes: body.resolution_notes,
    resolved_at: nowIso(),
    updated_at: nowIso(),
  };
  state.set(`reconciliation-mismatch:${mismatchId}`, resolved);
  return resolved;
}

function createDeliveryRequest(body, user) {
  const requestId = `delivery-${Date.now()}`;
  const request = {
    id: requestId,
    user_id: user.userId,
    asset_code: "XAU",
    amount: body.amount,
    status: "pending_approval",
    delivery_address: body.delivery_address,
    delivery_zone_id: body.delivery_zone_id,
    recipient_name: body.recipient_name,
    recipient_phone: body.recipient_phone,
    idempotency_key: body.idempotency_key ?? `delivery-key-${requestId}`,
    created_at: nowIso(),
    updated_at: nowIso(),
  };

  state.set(`delivery:${requestId}`, request);
  return request;
}

function getDeliveryRequest(requestId) {
  return state.get(`delivery:${requestId}`);
}

async function handleRequest(request) {
  const parsed = parsePath(request.url);

  if (!parsed) {
    if (new URL(request.url).pathname === "/health") {
      return json({ status: "ok" });
    }

    return problem(404, "Not found");
  }

  const { module, subpath, segments } = parsed;
  const method = request.method.toUpperCase();

  if (module === "identity") {
    if (method === "POST" && subpath === "auth/sign-in") {
      const body = await request.json();
      const account = USERS[body.email];

      if (!account || account.password !== body.password) {
        return problem(401, "Invalid credentials");
      }

      return json(authTokens(account));
    }

    if (method === "POST" && subpath === "auth/refresh") {
      return problem(401, "Refresh not implemented in mock");
    }

    if (method === "GET" && subpath === "me") {
      const auth = requireUser(request);
      if (auth.error) return auth.error;
      return json(currentUserResponse(auth.user));
    }
  }

  if (module === "wallet" && method === "GET" && subpath === "wallet/me/accounts") {
    const auth = requireUser(request);
    if (auth.error) return auth.error;
    return json(walletAccounts(auth.user.userId));
  }

  if (module === "pricing") {
    if (method === "GET" && subpath === "pricing/markets/XAU-IRR/policy") {
      return json(pricingPolicy());
    }

    if (method === "GET" && subpath === "pricing/markets/XAU-IRR/selected") {
      return json(selectedPrice());
    }

    if (method === "GET" && subpath === "pricing/markets/XAU-IRR/status") {
      return json(marketStatus());
    }

    if (method === "GET" && subpath === "pricing/markets/XAU-IRR/prices") {
      return json([
        {
          id: "price-snapshot-1",
          market_symbol: "XAU-IRR",
          buy_price: 5_000_000,
          sell_price: 4_950_000,
          quote_per_base_unit: "g",
          source: "manual",
          reason: "E2E seed",
          created_at: nowIso(),
          effective_from: nowIso(),
        },
      ]);
    }
  }

  if (module === "quote") {
    if (method === "POST" && subpath === "quotes") {
      const auth = requireUser(request);
      if (auth.error) return auth.error;
      const body = await request.json();
      return json(createQuote(body, auth.user), 201);
    }

    if (method === "GET" && segments[0] === "quotes" && segments.length === 2) {
      const quote = getQuote(segments[1]);
      return quote ? json(quote) : problem(404, "Quote not found");
    }

    if (method === "GET" && segments[0] === "quotes" && segments[2] === "confirmation-eligibility") {
      const quoteId = segments[1];
      const quote = getQuote(quoteId);
      if (!quote) return problem(404, "Quote not found");

      return json({
        quote_id: quoteId,
        eligible: quote.status !== "expired",
        status: quote.status,
        checked_at: nowIso(),
        expires_at: quote.expires_at,
      });
    }

    if (method === "POST" && segments[0] === "quote" && segments[1] === "quotes" && segments[3] === "confirm") {
      const quoteId = segments[2];
      const quote = getQuote(quoteId);
      if (!quote) return problem(404, "Quote not found");
      const confirmed = { ...quote, status: "confirmed", confirmed_at: nowIso() };
      state.set(`quote:${quoteId}`, confirmed);
      return json(confirmed);
    }
  }

  if (module === "trading") {
    if (method === "POST" && subpath === "orders") {
      const auth = requireUser(request);
      if (auth.error) return auth.error;
      const body = await request.json();
      return json(createOrder(body.quote_id, auth.user), 201);
    }

    if (method === "GET" && segments[0] === "orders" && segments.length === 2) {
      const order = getOrder(segments[1]);
      return order ? json(order) : problem(404, "Order not found");
    }
  }

  if (module === "payments") {
    if (method === "POST" && subpath === "payments/deposits") {
      const auth = requireUser(request);
      if (auth.error) return auth.error;
      const body = await request.json();
      const created = createDeposit(body, auth.user);

      if (created.duplicate) {
        return problem(409, "A request with this idempotency key already exists.", "conflict");
      }

      return json(created, 201);
    }

    if (method === "GET" && segments[0] === "payments" && segments[1] === "deposits" && segments.length === 3) {
      const deposit = getDeposit(segments[2]);
      return deposit ? json(deposit) : problem(404, "Deposit not found");
    }

    if (method === "POST" && subpath === "payments/withdrawals") {
      const auth = requireUser(request);
      if (auth.error) return auth.error;
      const body = await request.json();
      return json(createWithdrawal(body, auth.user), 201);
    }

    if (method === "GET" && segments[0] === "payments" && segments[1] === "withdrawals" && segments.length === 3) {
      const withdrawal = getWithdrawal(segments[2]);
      return withdrawal ? json(withdrawal) : problem(404, "Withdrawal not found");
    }
  }

  if (module === "delivery") {
    if (method === "GET" && subpath === "delivery/zones") {
      return json(deliveryZones());
    }

    if (method === "POST" && subpath === "delivery/requests") {
      const auth = requireUser(request);
      if (auth.error) return auth.error;
      const body = await request.json();
      return json(createDeliveryRequest(body, auth.user), 201);
    }

    if (method === "GET" && segments[0] === "delivery" && segments[1] === "requests" && segments.length === 3) {
      const requestDetail = getDeliveryRequest(segments[2]);
      return requestDetail ? json(requestDetail) : problem(404, "Delivery request not found");
    }
  }

  if (module === "admin") {
    const auth = requireUser(request);
    if (auth.error) return auth.error;

    if (!auth.user.roles.includes("admin")) {
      return problem(403, "Admin role required");
    }

    if (method === "POST" && subpath === "admin/pricing/markets/XAU-IRR/manual-prices") {
      const body = await request.json();
      state.set("selectedPrice", {
        market_symbol: "XAU-IRR",
        buy_price: body.buy_price,
        sell_price: body.sell_price,
        quote_per_base_unit: body.quote_per_base_unit ?? "g",
        source: "manual",
        market_status: state.get("marketStatus") ?? "open",
        price_snapshot_id: `price-snapshot-${Date.now()}`,
        selected_at: nowIso(),
        effective_from: body.effective_from ?? nowIso(),
      });
      return empty(204);
    }

    if (method === "PUT" && subpath === "admin/pricing/markets/XAU-IRR/status") {
      const body = await request.json();
      state.set("marketStatus", body.status);
      return empty(204);
    }

    if (method === "POST" && segments[0] === "admin" && segments[1] === "delivery" && segments[2] === "requests" && segments[4] === "approve") {
      const requestId = segments[3];
      const delivery = getDeliveryRequest(requestId);
      if (!delivery) return problem(404, "Delivery request not found");
      const approved = {
        ...delivery,
        status: "approved",
        approved_by: auth.user.userId,
        updated_at: nowIso(),
      };
      state.set(`delivery:${requestId}`, approved);
      return empty(204);
    }
  }

  if (module === "compliance" && method === "GET" && subpath === "compliance/review-cases") {
    return json([]);
  }

  if (module === "audit") {
    const auth = requireUser(request);
    if (auth.error) return auth.error;

    if (!auth.user.roles.includes("admin")) {
      return problem(403, "Admin role required");
    }

    if (method === "GET" && subpath === "audit/records") {
      return json(listAuditRecords());
    }

    if (method === "GET" && segments[0] === "audit" && segments[1] === "records" && segments.length === 3) {
      const record = getAuditRecord(segments[2]);
      return record ? json(record) : problem(404, "Audit record not found");
    }
  }

  if (module === "reconciliation") {
    const auth = requireUser(request);
    if (auth.error) return auth.error;

    if (!auth.user.roles.includes("admin")) {
      return problem(403, "Admin role required");
    }

    if (method === "GET" && subpath === "reconciliation/runs") {
      return json(listReconciliationRuns());
    }

    if (method === "GET" && segments[0] === "reconciliation" && segments[1] === "runs" && segments.length === 3) {
      const run = getReconciliationRun(segments[2]);
      return run ? json(run) : problem(404, "Reconciliation run not found");
    }

    if (method === "GET" && subpath === "reconciliation/mismatches") {
      return json(listReconciliationMismatches());
    }

    if (
      method === "GET" &&
      segments[0] === "reconciliation" &&
      segments[1] === "mismatches" &&
      segments.length === 3
    ) {
      const mismatch = getReconciliationMismatch(segments[2]);
      return mismatch ? json(mismatch) : problem(404, "Reconciliation mismatch not found");
    }

    if (method === "POST" && subpath === "reconciliation/runs/wallet-ledger") {
      const body = await request.json();
      return json(createWalletLedgerRun(body));
    }

    if (
      method === "POST" &&
      segments[0] === "reconciliation" &&
      segments[1] === "mismatches" &&
      segments[3] === "resolve"
    ) {
      const body = await request.json();
      const resolved = resolveReconciliationMismatch(segments[2], body);
      return resolved ? json(resolved) : problem(404, "Reconciliation mismatch not found");
    }
  }

  return problem(404, `Unhandled mock route: ${module} ${method} ${subpath}`);
}

const server = Bun.serve({
  port: PORT,
  async fetch(request) {
    try {
      return await handleRequest(request);
    } catch (error) {
      console.error("[e2e-mock-api] handler error", error);
      return problem(500, "Mock API handler error");
    }
  },
});

console.log(`[e2e-mock-api] listening on http://127.0.0.1:${server.port}`);
