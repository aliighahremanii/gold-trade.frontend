package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	adminopenapi "gold-trade/internal/modules/admin/presentation/openapi"
	assetopenapi "gold-trade/internal/modules/asset/presentation/openapi"
	auditopenapi "gold-trade/internal/modules/audit/presentation/openapi"
	complianceopenapi "gold-trade/internal/modules/compliance/presentation/openapi"
	deliveryopenapi "gold-trade/internal/modules/delivery/presentation/openapi"
	identityopenapi "gold-trade/internal/modules/identity/presentation/openapi"
	ledgeropenapi "gold-trade/internal/modules/ledger/presentation/openapi"
	paymentsopenapi "gold-trade/internal/modules/payments/presentation/openapi"
	pricingopenapi "gold-trade/internal/modules/pricing/presentation/openapi"
	quoteopenapi "gold-trade/internal/modules/quote/presentation/openapi"
	reconciliationopenapi "gold-trade/internal/modules/reconciliation/presentation/openapi"
	settlementopenapi "gold-trade/internal/modules/settlement/presentation/openapi"
	tradingopenapi "gold-trade/internal/modules/trading/presentation/openapi"
	walletopenapi "gold-trade/internal/modules/wallet/presentation/openapi"
)

type moduleSpec struct {
	name    string
	segment string
	spec    func() map[string]any
}

func main() {
	outputDir := filepath.Join("..", "..", "contracts", "openapi")
	if len(os.Args) > 1 {
		outputDir = os.Args[1]
	}

	if err := os.MkdirAll(outputDir, 0o755); err != nil {
		fmt.Fprintf(os.Stderr, "create output dir: %v\n", err)
		os.Exit(1)
	}

	modules := []moduleSpec{
		{name: "identity", segment: "identity", spec: identityopenapi.Spec},
		{name: "asset", segment: "asset", spec: assetopenapi.Spec},
		{name: "wallet", segment: "wallet", spec: walletopenapi.Spec},
		{name: "pricing", segment: "pricing", spec: pricingopenapi.Spec},
		{name: "quote", segment: "quote", spec: quoteopenapi.Spec},
		{name: "trading", segment: "trading", spec: tradingopenapi.Spec},
		{name: "settlement", segment: "settlement", spec: settlementopenapi.Spec},
		{name: "payments", segment: "payments", spec: paymentsopenapi.Spec},
		{name: "delivery", segment: "delivery", spec: deliveryopenapi.Spec},
		{name: "admin", segment: "admin", spec: adminopenapi.Spec},
		{name: "audit", segment: "audit", spec: auditopenapi.Spec},
		{name: "compliance", segment: "compliance", spec: complianceopenapi.Spec},
		{name: "reconciliation", segment: "reconciliation", spec: reconciliationopenapi.Spec},
		{name: "ledger", segment: "ledger", spec: ledgeropenapi.Spec},
	}

	for _, module := range modules {
		document := module.spec()
		prefix := defaultPathPrefix(module.segment)
		if prefix != "/" {
			document["servers"] = []map[string]any{{"url": prefix}}
		}

		payload, err := json.MarshalIndent(document, "", "  ")
		if err != nil {
			fmt.Fprintf(os.Stderr, "marshal %s openapi: %v\n", module.name, err)
			os.Exit(1)
		}

		target := filepath.Join(outputDir, fmt.Sprintf("%s.openapi.json", module.name))
		if err := os.WriteFile(target, append(payload, '\n'), 0o644); err != nil {
			fmt.Fprintf(os.Stderr, "write %s: %v\n", target, err)
			os.Exit(1)
		}

		fmt.Printf("wrote %s\n", target)
	}
}

// defaultPathPrefix mirrors backend webhttp.PathPrefixForModule defaults.
func defaultPathPrefix(moduleSegment string) string {
	return fmt.Sprintf("/api/%s/v1", moduleSegment)
}
