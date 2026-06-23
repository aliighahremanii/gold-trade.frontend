import { adminSectionDescriptions } from "@/modules/admin/utils/admin-section-descriptions";
import { AdminWorkflowShell } from "@/shared/layout/admin-workflow-shell";

type AdminSectionShellFlowProps = {
  title: string;
  module: string;
  href: string;
  description?: string;
};

export function AdminSectionShellFlow({
  title,
  module,
  href,
  description,
}: AdminSectionShellFlowProps) {
  return (
    <AdminWorkflowShell
      title={title}
      module={module}
      description={description ?? adminSectionDescriptions[href]}
    />
  );
}
