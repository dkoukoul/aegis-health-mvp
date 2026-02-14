// ── Health Record Entity ──

import { v4 as uuidv4 } from 'uuid';
import type { HealthRecordType } from '../value-objects/types';

export interface HealthRecordProps {
  id?: string;
  patientId: string;
  type: HealthRecordType;
  title: string;
  description: string;
  date: string; // ISO date
  createdAt?: string;
  updatedAt?: string;
}

export class HealthRecord {
  readonly id: string;
  patientId: string;
  type: HealthRecordType;
  title: string;
  description: string;
  date: string;
  readonly createdAt: string;
  updatedAt: string;

  constructor(props: HealthRecordProps) {
    this.id = props.id ?? uuidv4();
    this.patientId = props.patientId;
    this.type = props.type;
    this.title = props.title;
    this.description = props.description;
    this.date = props.date;
    this.createdAt = props.createdAt ?? new Date().toISOString();
    this.updatedAt = props.updatedAt ?? new Date().toISOString();
  }

  toPlain(): HealthRecordProps {
    return {
      id: this.id,
      patientId: this.patientId,
      type: this.type,
      title: this.title,
      description: this.description,
      date: this.date,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
