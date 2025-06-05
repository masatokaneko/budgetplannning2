export type ImportType = 'BUDGET' | 'ACTUAL';
export type ImportStatus = 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';

export interface ImportResult {
  id: number;
  type: ImportType;
  status: ImportStatus;
  totalRecords: number;
  processedRecords: number;
  failedRecords: number;
  errors: string[];
  startedAt: Date;
  completedAt: Date;
  createdBy: number;
  metadata?: Record<string, any>;
} 