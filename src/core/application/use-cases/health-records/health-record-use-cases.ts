// ── Health Record Use Cases ──

import { HealthRecord, type HealthRecordProps } from '../../../domain/entities/health-record';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import type { HealthRecordRepository } from '../../ports/health-record-repository';

export class HealthRecordUseCases {
  constructor(private readonly repo: HealthRecordRepository) {}

  getAll(): HealthRecord[] {
    return this.repo.getAll();
  }

  getById(id: string): HealthRecord {
    const record = this.repo.getById(id);
    if (!record) throw new EntityNotFoundError('HealthRecord', id);
    return record;
  }

  getByPatientId(patientId: string): HealthRecord[] {
    return this.repo.getByPatientId(patientId);
  }

  create(props: HealthRecordProps): HealthRecord {
    this.validate(props);
    return this.repo.create(props);
  }

  update(id: string, props: Partial<HealthRecordProps>): HealthRecord {
    const existing = this.repo.getById(id);
    if (!existing) throw new EntityNotFoundError('HealthRecord', id);
    return this.repo.update(id, { ...props, updatedAt: new Date().toISOString() });
  }

  delete(id: string): void {
    const existing = this.repo.getById(id);
    if (!existing) throw new EntityNotFoundError('HealthRecord', id);
    this.repo.delete(id);
  }

  private validate(props: HealthRecordProps): void {
    if (!props.patientId) throw new ValidationError('patientId', 'is required');
    if (!props.title?.trim()) throw new ValidationError('title', 'is required');
    if (!props.date) throw new ValidationError('date', 'is required');
    if (!props.type) throw new ValidationError('type', 'is required');
  }
}
