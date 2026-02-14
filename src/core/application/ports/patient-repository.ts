// ── Patient Repository Port (Interface) ──

import type { Patient, PatientProps } from '../../domain/entities/patient';

export interface PatientRepository {
  getAll(): Patient[];
  getById(id: string): Patient | undefined;
  create(props: PatientProps): Patient;
  update(id: string, props: Partial<PatientProps>): Patient;
  delete(id: string): void;
  search(query: string): Patient[];
}
