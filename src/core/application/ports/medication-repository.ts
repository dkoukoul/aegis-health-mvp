// ── Medication Repository Port (Interface) ──

import type { Medication, MedicationProps } from '../../domain/entities/medication';

export interface MedicationRepository {
  getAll(): Medication[];
  getById(id: string): Medication | undefined;
  getByPatientId(patientId: string): Medication[];
  create(props: MedicationProps): Medication;
  update(id: string, props: Partial<MedicationProps>): Medication;
  delete(id: string): void;
}
