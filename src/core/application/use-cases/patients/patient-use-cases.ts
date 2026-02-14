// ── Patient Use Cases ──

import { Patient, type PatientProps } from '../../../domain/entities/patient';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import { Amka } from '../../../domain/value-objects/amka';
import { Afm } from '../../../domain/value-objects/afm';
import type { PatientRepository } from '../../ports/patient-repository';

export class PatientUseCases {
  constructor(private readonly repo: PatientRepository) {}

  getAll(): Patient[] {
    return this.repo.getAll();
  }

  getById(id: string): Patient {
    const patient = this.repo.getById(id);
    if (!patient) throw new EntityNotFoundError('Patient', id);
    return patient;
  }

  create(props: PatientProps): Patient {
    this.validate(props);
    return this.repo.create(props);
  }

  update(id: string, props: Partial<PatientProps>): Patient {
    const existing = this.repo.getById(id);
    if (!existing) throw new EntityNotFoundError('Patient', id);
    if (props.amka) Amka.create(props.amka);
    if (props.afm) Afm.create(props.afm);
    return this.repo.update(id, { ...props, updatedAt: new Date().toISOString() });
  }

  delete(id: string): void {
    const existing = this.repo.getById(id);
    if (!existing) throw new EntityNotFoundError('Patient', id);
    this.repo.delete(id);
  }

  search(query: string): Patient[] {
    return this.repo.search(query);
  }

  private validate(props: PatientProps): void {
    if (!props.firstName?.trim()) throw new ValidationError('firstName', 'is required');
    if (!props.lastName?.trim()) throw new ValidationError('lastName', 'is required');
    if (!props.dateOfBirth) throw new ValidationError('dateOfBirth', 'is required');
    if (props.amka) Amka.create(props.amka);
    if (props.afm) Afm.create(props.afm);
  }
}
