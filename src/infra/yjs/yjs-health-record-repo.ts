// ── Yjs Health Record Repository ──

import * as Y from 'yjs';
import { HealthRecord, type HealthRecordProps } from '../../core/domain/entities/health-record';
import type { HealthRecordRepository } from '../../core/application/ports/health-record-repository';
import { getHealthRecordsMap } from './yjs-provider';

export class YjsHealthRecordRepository implements HealthRecordRepository {
  private get map(): Y.Map<Y.Map<string>> {
    return getHealthRecordsMap();
  }

  getAll(): HealthRecord[] {
    const items: HealthRecord[] = [];
    this.map.forEach((ymap) => {
      items.push(this.ymapToEntity(ymap));
    });
    return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getById(id: string): HealthRecord | undefined {
    const ymap = this.map.get(id);
    if (!ymap) return undefined;
    return this.ymapToEntity(ymap);
  }

  getByPatientId(patientId: string): HealthRecord[] {
    return this.getAll().filter((r) => r.patientId === patientId);
  }

  create(props: HealthRecordProps): HealthRecord {
    const entity = new HealthRecord(props);
    const ymap = new Y.Map<string>();
    this.entityToYmap(entity, ymap);
    this.map.set(entity.id, ymap);
    return entity;
  }

  update(id: string, props: Partial<HealthRecordProps>): HealthRecord {
    const ymap = this.map.get(id);
    if (!ymap) throw new Error(`HealthRecord ${id} not found`);
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

  private ymapToEntity(ymap: Y.Map<string>): HealthRecord {
    return new HealthRecord({
      id: ymap.get('id') ?? '',
      patientId: ymap.get('patientId') ?? '',
      type: (ymap.get('type') as HealthRecordProps['type']) ?? 'note',
      title: ymap.get('title') ?? '',
      description: ymap.get('description') ?? '',
      date: ymap.get('date') ?? '',
      createdAt: ymap.get('createdAt') ?? '',
      updatedAt: ymap.get('updatedAt') ?? '',
    });
  }

  private entityToYmap(entity: HealthRecord, ymap: Y.Map<string>): void {
    const plain = entity.toPlain();
    for (const [key, value] of Object.entries(plain)) {
      if (value !== undefined) {
        ymap.set(key, String(value));
      }
    }
  }
}
