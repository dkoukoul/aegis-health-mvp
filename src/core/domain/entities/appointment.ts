// ── Appointment Entity ──

import { v4 as uuidv4 } from 'uuid';
import type { AppointmentStatus } from '../value-objects/types';

export interface AppointmentProps {
  id?: string;
  patientId: string;
  title: string;
  dateTime: string; // ISO datetime string
  duration: number; // minutes
  status: AppointmentStatus;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class Appointment {
  readonly id: string;
  patientId: string;
  title: string;
  dateTime: string;
  duration: number;
  status: AppointmentStatus;
  notes: string;
  readonly createdAt: string;
  updatedAt: string;

  constructor(props: AppointmentProps) {
    this.id = props.id ?? uuidv4();
    this.patientId = props.patientId;
    this.title = props.title;
    this.dateTime = props.dateTime;
    this.duration = props.duration;
    this.status = props.status;
    this.notes = props.notes ?? '';
    this.createdAt = props.createdAt ?? new Date().toISOString();
    this.updatedAt = props.updatedAt ?? new Date().toISOString();
  }

  get endTime(): Date {
    const start = new Date(this.dateTime);
    return new Date(start.getTime() + this.duration * 60_000);
  }

  get isUpcoming(): boolean {
    return new Date(this.dateTime) > new Date();
  }

  get isPast(): boolean {
    return this.endTime < new Date();
  }

  toPlain(): AppointmentProps {
    return {
      id: this.id,
      patientId: this.patientId,
      title: this.title,
      dateTime: this.dateTime,
      duration: this.duration,
      status: this.status,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
