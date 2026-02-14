// ── User Use Cases ──

import { User, type UserProps } from '../../../domain/entities/user';
import { EntityNotFoundError, ValidationError } from '../../../domain/errors';
import type { UserRepository } from '../../ports/user-repository';

export class UserUseCases {
  constructor(private readonly repo: UserRepository) {}

  getAll(): User[] {
    return this.repo.getAll();
  }

  getById(id: string): User {
    const user = this.repo.getById(id);
    if (!user) throw new EntityNotFoundError('User', id);
    return user;
  }

  create(props: UserProps): User {
    if (!props.name) throw new ValidationError('name', 'is required');
    if (!props.pinHash) throw new ValidationError('pin', 'is required');
    
    const existing = this.repo.getByName(props.name);
    if (existing) throw new ValidationError('name', 'User already exists');

    return this.repo.create(props);
  }

  update(id: string, props: Partial<UserProps>): User {
    const existing = this.repo.getById(id);
    if (!existing) throw new EntityNotFoundError('User', id);
    return this.repo.update(id, props);
  }

  delete(id: string): void {
    const existing = this.repo.getById(id);
    if (!existing) throw new EntityNotFoundError('User', id);
    this.repo.delete(id);
  }

  async verifyPin(user: User, pinInput: string, verifyHashFn: (pin: string, hash: string) => Promise<boolean>): Promise<boolean> {
    return verifyHashFn(pinInput, user.pinHash);
  }
}
