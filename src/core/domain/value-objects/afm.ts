// ── ΑΦΜ (Αριθμός Φορολογικού Μητρώου) ──
// 9-digit Greek Tax ID Number

import { DomainError } from '../errors';

export class Afm {
  private constructor(public readonly value: string) {}

  static create(value: string): Afm {
    const cleaned = value.replace(/\s/g, '');
    if (!/^\d{9}$/.test(cleaned)) {
      throw new DomainError('ΑΦΜ must be exactly 9 digits');
    }
    return new Afm(cleaned);
  }

  static fromRaw(value: string | undefined): Afm | undefined {
    if (!value || value.trim() === '') return undefined;
    return Afm.create(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Afm): boolean {
    return this.value === other.value;
  }
}
