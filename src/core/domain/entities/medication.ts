// ── Medication Entity ──

import { v4 as uuidv4 } from 'uuid';

export interface MedicationProps {
  id?: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string; // ISO date
  endDate?: string;  // ISO date, optional
  prescribedBy: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class Medication {
  readonly id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  prescribedBy: string;
  notes: string;
  readonly createdAt: string;
  updatedAt: string;

  constructor(props: MedicationProps) {
    this.id = props.id ?? uuidv4();
    this.patientId = props.patientId;
    this.name = props.name;
    this.dosage = props.dosage;
    this.frequency = props.frequency;
    this.startDate = props.startDate;
    this.endDate = props.endDate ?? '';
    this.prescribedBy = props.prescribedBy;
    this.notes = props.notes ?? '';
    this.createdAt = props.createdAt ?? new Date().toISOString();
    this.updatedAt = props.updatedAt ?? new Date().toISOString();
  }

  get isActive(): boolean {
    if (!this.endDate) return true;
    return new Date(this.endDate) >= new Date();
  }

  toPlain(): MedicationProps {
    return {
      id: this.id,
      patientId: this.patientId,
      name: this.name,
      dosage: this.dosage,
      frequency: this.frequency,
      startDate: this.startDate,
      endDate: this.endDate || undefined,
      prescribedBy: this.prescribedBy,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
