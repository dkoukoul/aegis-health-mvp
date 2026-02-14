// ── Yjs Medication Repository ──

import * as Y from 'yjs';
import { Medication, type MedicationProps } from '../../core/domain/entities/medication';
import type { MedicationRepository } from '../../core/application/ports/medication-repository';
import { getMedicationsMap } from './yjs-provider';

export class YjsMedicationRepository implements MedicationRepository {
  private get map(): Y.Map<Y.Map<string>> {
    return getMedicationsMap();
  }

  getAll(): Medication[] {
    const items: Medication[] = [];
    this.map.forEach((ymap) => {
      items.push(this.ymapToEntity(ymap));
    });
    return items.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }

  getById(id: string): Medication | undefined {
    const ymap = this.map.get(id);
    if (!ymap) return undefined;
    return this.ymapToEntity(ymap);
  }

  getByPatientId(patientId: string): Medication[] {
    return this.getAll().filter((m) => m.patientId === patientId);
  }

  create(props: MedicationProps): Medication {
    const entity = new Medication(props);
    const ymap = new Y.Map<string>();
    this.entityToYmap(entity, ymap);
    this.map.set(entity.id, ymap);
    return entity;
  }

  update(id: string, props: Partial<MedicationProps>): Medication {
    const ymap = this.map.get(id);
    if (!ymap) throw new Error(`Medication ${id} not found`);
    for (const [key, value] of Object.entries(props)) {
      if (value !== undefined) {
        ymap.set(key, String(value));
      }
    }
    return this.ymapToEntity(ymap);
  }

  delete(id: string): void {
    this.map.delete(id);
  }

  private ymapToEntity(ymap: Y.Map<string>): Medication {
    return new Medication({
      id: ymap.get('id') ?? '',
      patientId: ymap.get('patientId') ?? '',
      name: ymap.get('name') ?? '',
      dosage: ymap.get('dosage') ?? '',
      frequency: ymap.get('frequency') ?? '',
      startDate: ymap.get('startDate') ?? '',
      endDate: ymap.get('endDate') || undefined,
      prescribedBy: ymap.get('prescribedBy') ?? '',
      notes: ymap.get('notes') ?? '',
      createdAt: ymap.get('createdAt') ?? '',
      updatedAt: ymap.get('updatedAt') ?? '',
    });
  }

  private entityToYmap(entity: Medication, ymap: Y.Map<string>): void {
    const plain = entity.toPlain();
    for (const [key, value] of Object.entries(plain)) {
      if (value !== undefined) {
        ymap.set(key, String(value));
      }
    }
  }
}
