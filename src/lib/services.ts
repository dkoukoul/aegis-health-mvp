// ── Service Context ──
// Wires infrastructure implementations to domain use cases
// This is the composition root — the only place that knows about both layers

import {
  PatientUseCases,
  AppointmentUseCases,
  MedicationUseCases,
  HealthRecordUseCases,
} from '$core';
import {
  YjsPatientRepository,
  YjsAppointmentRepository,
  YjsMedicationRepository,
  YjsHealthRecordRepository,
  initPersistence,
} from '$infra';

// Repository instances (singletons)
const patientRepo = new YjsPatientRepository();
const appointmentRepo = new YjsAppointmentRepository();
const medicationRepo = new YjsMedicationRepository();
const healthRecordRepo = new YjsHealthRecordRepository();

// Use case instances (singletons)
export const patientUseCases = new PatientUseCases(patientRepo);
export const appointmentUseCases = new AppointmentUseCases(appointmentRepo);
export const medicationUseCases = new MedicationUseCases(medicationRepo);
export const healthRecordUseCases = new HealthRecordUseCases(healthRecordRepo);

// Initialize persistence (call once on app start)
export async function initServices(): Promise<void> {
  await initPersistence();
  console.log('[Aegis] Services initialized');
}
