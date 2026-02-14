// ── Domain Errors ──

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class EntityNotFoundError extends DomainError {
  constructor(entity: string, id: string) {
    super(`${entity} with id "${id}" not found`);
    this.name = 'EntityNotFoundError';
  }
}

export class ValidationError extends DomainError {
  constructor(field: string, message: string) {
    super(`Validation error on "${field}": ${message}`);
    this.name = 'ValidationError';
  }
}
