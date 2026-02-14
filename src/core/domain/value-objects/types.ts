// ── Enums & shared types for the domain layer ──

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export enum AppointmentStatus {
  Scheduled = "scheduled",
  Completed = "completed",
  Cancelled = "cancelled",
  NoShow = "no-show",
}

export enum HealthRecordType {
  Diagnosis = "diagnosis",
  LabResult = "lab-result",
  Note = "note",
  Procedure = "procedure",
  Referral = "referral",
}
