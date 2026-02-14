// ── Yjs Patient Repository ──
// Implements PatientRepository using Y.Map CRDTs

import * as Y from 'yjs';
import { Patient, type PatientProps } from '../../core/domain/entities/patient';
import type { PatientRepository } from '../../core/application/ports/patient-repository';
import { getPatientsMap } from './yjs-provider';

export class YjsPatientRepository implements PatientRepository {
  private get map(): Y.Map<Y.Map<string>> {
    return getPatientsMap();
  }

  getAll(): Patient[] {
    const patients: Patient[] = [];
    this.map.forEach((ymap) => {
      patients.push(this.ymapToPatient(ymap));
    });
    return patients.sort((a, b) => a.lastName.localeCompare(b.lastName, 'el'));
  }

  getById(id: string): Patient | undefined {
    const ymap = this.map.get(id);
    if (!ymap) return undefined;
    return this.ymapToPatient(ymap);
  }

  create(props: PatientProps): Patient {
    const patient = new Patient(props);
    const ymap = new Y.Map<string>();
    this.patientToYmap(patient, ymap);
    this.map.set(patient.id, ymap);
    return patient;
  }

  update(id: string, props: Partial<PatientProps>): Patient {
    const ymap = this.map.get(id);
    if (!ymap) throw new Error(`Patient ${id} not found`);

    for (const [key, value] of Object.entries(props)) {
      if (value !== undefined) {
        ymap.set(key, String(value));
      }
    }
    return this.ymapToPatient(ymap);
  }

  delete(id: string): void {
    this.map.delete(id);
  }

  search(query: string): Patient[] {
    const q = query.toLowerCase().trim();
    if (!q) return this.getAll();

    return this.getAll().filter((p) => {
      return (
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        p.amka.includes(q) ||
        p.phone.includes(q) ||
        p.afm.includes(q)
      );
    });
  }

  private ymapToPatient(ymap: Y.Map<string>): Patient {
    return new Patient({
      id: ymap.get('id') ?? '',
      firstName: ymap.get('firstName') ?? '',
      lastName: ymap.get('lastName') ?? '',
      fatherName: ymap.get('fatherName') ?? '',
      amka: ymap.get('amka') ?? '',
      afm: ymap.get('afm') ?? '',
      dateOfBirth: ymap.get('dateOfBirth') ?? '',
      gender: (ymap.get('gender') as PatientProps['gender']) ?? 'other',
      phone: ymap.get('phone') ?? '',
      email: ymap.get('email') ?? '',
      address: ymap.get('address') ?? '',
      city: ymap.get('city') ?? '',
      postalCode: ymap.get('postalCode') ?? '',
      insuranceProvider: ymap.get('insuranceProvider') ?? '',
      insuranceNumber: ymap.get('insuranceNumber') ?? '',
      notes: ymap.get('notes') ?? '',
      createdAt: ymap.get('createdAt') ?? '',
      updatedAt: ymap.get('updatedAt') ?? '',
    });
  }

  private patientToYmap(patient: Patient, ymap: Y.Map<string>): void {
    const plain = patient.toPlain();
    for (const [key, value] of Object.entries(plain)) {
      if (value !== undefined) {
        ymap.set(key, String(value));
      }
    }
  }
}
