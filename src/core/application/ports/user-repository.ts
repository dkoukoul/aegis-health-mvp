// ── User Repository Port ──

import type { User, UserProps } from '../../domain/entities/user';

export interface UserRepository {
  getAll(): User[];
  getById(id: string): User | undefined;
  getByName(name: string): User | undefined;
  create(props: UserProps): User;
  update(id: string, props: Partial<UserProps>): User;
  delete(id: string): void;
}
