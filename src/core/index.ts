// ── Core Module Public API ──

// Domain entities
export { Patient, type PatientProps } from './domain/entities/patient';
export { Appointment, type AppointmentProps } from './domain/entities/appointment';
export { Medication, type MedicationProps } from './domain/entities/medication';
export { HealthRecord, type HealthRecordProps } from './domain/entities/health-record';
export { User, type UserProps } from './domain/entities/user';

// Value objects
export { Amka } from './domain/value-objects/amka';
export { Afm } from './domain/value-objects/afm';
export { Gender, AppointmentStatus, HealthRecordType } from './domain/value-objects/types';

// Errors
export { DomainError, EntityNotFoundError, ValidationError } from './domain/errors';

// Ports
export type { PatientRepository } from './application/ports/patient-repository';
export type { AppointmentRepository } from './application/ports/appointment-repository';
export type { MedicationRepository } from './application/ports/medication-repository';
export type { HealthRecordRepository } from './application/ports/health-record-repository';

// Use cases
export { PatientUseCases } from './application/use-cases/patients/patient-use-cases';
export { AppointmentUseCases } from './application/use-cases/appointments/appointment-use-cases';
export { MedicationUseCases } from './application/use-cases/medications/medication-use-cases';
export { HealthRecordUseCases } from './application/use-cases/health-records/health-record-use-cases';
export { UserUseCases } from './application/use-cases/users/user-use-cases';
