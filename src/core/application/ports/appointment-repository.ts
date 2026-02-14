// ── Appointment Repository Port (Interface) ──

import type { Appointment, AppointmentProps } from '../../domain/entities/appointment';

export interface AppointmentRepository {
  getAll(): Appointment[];
  getById(id: string): Appointment | undefined;
  getByPatientId(patientId: string): Appointment[];
  getByDateRange(start: string, end: string): Appointment[];
  create(props: AppointmentProps): Appointment;
  update(id: string, props: Partial<AppointmentProps>): Appointment;
  delete(id: string): void;
}
