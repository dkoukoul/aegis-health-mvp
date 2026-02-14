// ── Yjs User Repository ──

import * as Y from 'yjs';
import { User, type UserProps } from '../../core/domain/entities/user';
import type { UserRepository } from '../../core/application/ports/user-repository';
import { getUsersMap } from './yjs-provider';

export class YjsUserRepository implements UserRepository {
  private get map(): Y.Map<Y.Map<string>> {
    return getUsersMap();
  }

  getAll(): User[] {
    const items: User[] = [];
    this.map.forEach((ymap) => {
      items.push(this.ymapToEntity(ymap));
    });
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }

  getById(id: string): User | undefined {
    const ymap = this.map.get(id);
    if (!ymap) return undefined;
    return this.ymapToEntity(ymap);
  }

  getByName(name: string): User | undefined {
    // Linear scan is acceptable for small number of users
    // For larger scale, we'd need an index
    const normalizedName = name.toLowerCase().trim();
    return this.getAll().find(u => u.name.toLowerCase() === normalizedName);
  }

  create(props: UserProps): User {
    const entity = new User(props);
    const ymap = new Y.Map<string>();
    this.entityToYmap(entity, ymap);
    this.map.set(entity.id, ymap);
    return entity;
  }

  update(id: string, props: Partial<UserProps>): User {
    const ymap = this.map.get(id);
    if (!ymap) throw new Error(`User ${id} not found`);
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

  private ymapToEntity(ymap: Y.Map<string>): User {
    return new User({
      id: ymap.get('id') ?? '',
      name: ymap.get('name') ?? '',
      pinHash: ymap.get('pinHash') ?? '',
      color: ymap.get('color'),
      createdAt: ymap.get('createdAt'),
      lastLoginAt: ymap.get('lastLoginAt'),
    });
  }

  private entityToYmap(entity: User, ymap: Y.Map<string>): void {
    const plain = entity.toPlain();
    for (const [key, value] of Object.entries(plain)) {
      if (value !== undefined) {
        ymap.set(key, String(value));
      }
    }
  }
}
