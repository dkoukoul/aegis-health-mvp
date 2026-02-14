// ── Appointment Use Cases ──

import { Appointment, type AppointmentProps } from '../../../domain/entities/appointment';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import type { AppointmentRepository } from '../../ports/appointment-repository';

export class AppointmentUseCases {
  constructor(private readonly repo: AppointmentRepository) {}

  getAll(): Appointment[] {
    return this.repo.getAll();
  }

  getById(id: string): Appointment {
    const appt = this.repo.getById(id);
    if (!appt) throw new EntityNotFoundError('Appointment', id);
    return appt;
  }

  getByPatientId(patientId: string): Appointment[] {
    return this.repo.getByPatientId(patientId);
  }

  getByDateRange(start: string, end: string): Appointment[] {
    return this.repo.getByDateRange(start, end);
  }

  getTodaysAppointments(): Appointment[] {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString();
    return this.repo.getByDateRange(start, end);
  }

  create(props: AppointmentProps): Appointment {
    this.validate(props);
    return this.repo.create(props);
  }

  update(id: string, props: Partial<AppointmentProps>): Appointment {
    const existing = this.repo.getById(id);
    if (!existing) throw new EntityNotFoundError('Appointment', id);
    return this.repo.update(id, { ...props, updatedAt: new Date().toISOString() });
  }

  delete(id: string): void {
    const existing = this.repo.getById(id);
    if (!existing) throw new EntityNotFoundError('Appointment', id);
    this.repo.delete(id);
  }

  private validate(props: AppointmentProps): void {
    if (!props.patientId) throw new ValidationError('patientId', 'is required');
    if (!props.title?.trim()) throw new ValidationError('title', 'is required');
    if (!props.dateTime) throw new ValidationError('dateTime', 'is required');
    if (!props.duration || props.duration <= 0) throw new ValidationError('duration', 'must be positive');
  }
}
