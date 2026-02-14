// ── Medication Use Cases ──

import { Medication, type MedicationProps } from '../../../domain/entities/medication';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import type { MedicationRepository } from '../../ports/medication-repository';

export class MedicationUseCases {
  constructor(private readonly repo: MedicationRepository) {}

  getAll(): Medication[] {
    return this.repo.getAll();
  }

  getById(id: string): Medication {
    const med = this.repo.getById(id);
    if (!med) throw new EntityNotFoundError('Medication', id);
    return med;
  }

  getByPatientId(patientId: string): Medication[] {
    return this.repo.getByPatientId(patientId);
  }

  create(props: MedicationProps): Medication {
    this.validate(props);
    return this.repo.create(props);
  }

  update(id: string, props: Partial<MedicationProps>): Medication {
    const existing = this.repo.getById(id);
    if (!existing) throw new EntityNotFoundError('Medication', id);
    return this.repo.update(id, { ...props, updatedAt: new Date().toISOString() });
  }

  delete(id: string): void {
    const existing = this.repo.getById(id);
    if (!existing) throw new EntityNotFoundError('Medication', id);
    this.repo.delete(id);
  }

  private validate(props: MedicationProps): void {
    if (!props.patientId) throw new ValidationError('patientId', 'is required');
    if (!props.name?.trim()) throw new ValidationError('name', 'is required');
    if (!props.dosage?.trim()) throw new ValidationError('dosage', 'is required');
  }
}
