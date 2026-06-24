export type AuditRecordView = {
  id: string;
  actorId?: string;
  action?: string;
  targetType?: string;
  targetId?: string;
  reason?: string;
  businessReference?: string;
  createdAt?: string;
  updatedAt?: string;
  status: string;
};
