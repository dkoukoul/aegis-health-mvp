// ── Patient Entity ──

import { v4 as uuidv4 } from 'uuid';
import type { Gender } from '../value-objects/types';

export interface PatientProps {
  id?: string;
  firstName: string;
  lastName: string;
  fatherName?: string;
  amka?: string;
  afm?: string;
  dateOfBirth: string; // ISO date string
  gender: Gender;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class Patient {
  readonly id: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  amka: string;
  afm: string;
  dateOfBirth: string;
  gender: Gender;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  insuranceProvider: string;
  insuranceNumber: string;
  notes: string;
  readonly createdAt: string;
  updatedAt: string;

  constructor(props: PatientProps) {
    this.id = props.id ?? uuidv4();
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.fatherName = props.fatherName ?? '';
    this.amka = props.amka ?? '';
    this.afm = props.afm ?? '';
    this.dateOfBirth = props.dateOfBirth;
    this.gender = props.gender;
    this.phone = props.phone ?? '';
    this.email = props.email ?? '';
    this.address = props.address ?? '';
    this.city = props.city ?? '';
    this.postalCode = props.postalCode ?? '';
    this.insuranceProvider = props.insuranceProvider ?? '';
    this.insuranceNumber = props.insuranceNumber ?? '';
    this.notes = props.notes ?? '';
    this.createdAt = props.createdAt ?? new Date().toISOString();
    this.updatedAt = props.updatedAt ?? new Date().toISOString();
  }

  get fullName(): string {
    return `${this.lastName} ${this.firstName}`;
  }

  toPlain(): PatientProps {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      fatherName: this.fatherName,
      amka: this.amka,
      afm: this.afm,
      dateOfBirth: this.dateOfBirth,
      gender: this.gender,
      phone: this.phone,
      email: this.email,
      address: this.address,
      city: this.city,
      postalCode: this.postalCode,
      insuranceProvider: this.insuranceProvider,
      insuranceNumber: this.insuranceNumber,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
