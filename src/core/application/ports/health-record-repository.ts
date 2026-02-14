// ── Health Record Repository Port (Interface) ──

import type { HealthRecord, HealthRecordProps } from '../../domain/entities/health-record';

export interface HealthRecordRepository {
  getAll(): HealthRecord[];
  getById(id: string): HealthRecord | undefined;
  getByPatientId(patientId: string): HealthRecord[];
  create(props: HealthRecordProps): HealthRecord;
  update(id: string, props: Partial<HealthRecordProps>): HealthRecord;
  delete(id: string): void;
}
