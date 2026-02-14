// ── Yjs Appointment Repository ──

import * as Y from 'yjs';
import { Appointment, type AppointmentProps } from '../../core/domain/entities/appointment';
import type { AppointmentRepository } from '../../core/application/ports/appointment-repository';
import { getAppointmentsMap } from './yjs-provider';

export class YjsAppointmentRepository implements AppointmentRepository {
  private get map(): Y.Map<Y.Map<string>> {
    return getAppointmentsMap();
  }

  getAll(): Appointment[] {
    const items: Appointment[] = [];
    this.map.forEach((ymap) => {
      items.push(this.ymapToEntity(ymap));
    });
    return items.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  }

  getById(id: string): Appointment | undefined {
    const ymap = this.map.get(id);
    if (!ymap) return undefined;
    return this.ymapToEntity(ymap);
  }

  getByPatientId(patientId: string): Appointment[] {
    return this.getAll().filter((a) => a.patientId === patientId);
  }

  getByDateRange(start: string, end: string): Appointment[] {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    return this.getAll().filter((a) => {
      const t = new Date(a.dateTime).getTime();
      return t >= startTime && t < endTime;
    });
  }

  create(props: AppointmentProps): Appointment {
    const entity = new Appointment(props);
    const ymap = new Y.Map<string>();
    this.entityToYmap(entity, ymap);
    this.map.set(entity.id, ymap);
    return entity;
  }

  update(id: string, props: Partial<AppointmentProps>): Appointment {
    const ymap = this.map.get(id);
    if (!ymap) throw new Error(`Appointment ${id} not found`);
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

  private ymapToEntity(ymap: Y.Map<string>): Appointment {
    return new Appointment({
      id: ymap.get('id') ?? '',
      patientId: ymap.get('patientId') ?? '',
      title: ymap.get('title') ?? '',
      dateTime: ymap.get('dateTime') ?? '',
      duration: parseInt(ymap.get('duration') ?? '30', 10),
      status: (ymap.get('status') as AppointmentProps['status']) ?? 'scheduled',
      notes: ymap.get('notes') ?? '',
      createdAt: ymap.get('createdAt') ?? '',
      updatedAt: ymap.get('updatedAt') ?? '',
    });
  }

  private entityToYmap(entity: Appointment, ymap: Y.Map<string>): void {
    const plain = entity.toPlain();
    for (const [key, value] of Object.entries(plain)) {
      if (value !== undefined) {
        ymap.set(key, String(value));
      }
    }
  }
}
