import type { components as LedgerComponents } from "@/generated/api/ledger";
import { formatWalletBalanceAmount } from "@/modules/wallet/utils/format-wallet-balance";

type TransactionDetail = LedgerComponents["schemas"]["TransactionDetail"];
type EntryDetail = LedgerComponents["schemas"]["EntryDetail"];

export type AdminLedgerEntryView = {
  id: string;
  accountId: string;
  assetCode: string;
  direction: string;
  amountLabel: string;
};

export type AdminLedgerTransactionView = {
  id: string;
  transactionType: string;
  description: string;
  sourceModule: string;
  sourceOperationType: string;
  sourceOperationId: string;
  marketSymbol?: string;
  postedAt: string;
  reversesTransactionId?: string;
  entries: AdminLedgerEntryView[];
  references: string[];
};

function mapEntry(entry: EntryDetail): AdminLedgerEntryView {
  const amount = formatWalletBalanceAmount(entry.asset_code, entry.amount);

  return {
    id: entry.id,
    accountId: entry.account_id,
    assetCode: entry.asset_code,
    direction: entry.direction,
    amountLabel: `${amount.formatted} ${amount.unit}`,
  };
}

export function mapLedgerTransactionToAdminView(
  transaction: TransactionDetail,
): AdminLedgerTransactionView {
  return {
    id: transaction.id,
    transactionType: transaction.transaction_type,
    description: transaction.description,
    sourceModule: transaction.source_module,
    sourceOperationType: transaction.source_operation_type,
    sourceOperationId: transaction.source_operation_id,
    marketSymbol: transaction.market_symbol,
    postedAt: transaction.posted_at,
    reversesTransactionId: transaction.reverses_transaction_id,
    entries: transaction.entries.map(mapEntry),
    references: [
      transaction.id,
      transaction.source_operation_id,
      transaction.idempotency_key,
      transaction.market_symbol,
      transaction.reverses_transaction_id,
    ].filter((value): value is string => Boolean(value)),
  };
}
