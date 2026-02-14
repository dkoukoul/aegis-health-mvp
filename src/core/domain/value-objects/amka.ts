// ── ΑΜΚΑ (Αριθμός Μητρώου Κοινωνικής Ασφάλισης) ──
// 11-digit Greek Social Security Number

import { DomainError } from '../errors';

export class Amka {
  private constructor(public readonly value: string) {}

  static create(value: string): Amka {
    const cleaned = value.replace(/\s/g, '');
    if (!/^\d{11}$/.test(cleaned)) {
      throw new DomainError('AMKA must be exactly 11 digits');
    }
    return new Amka(cleaned);
  }

  static fromRaw(value: string | undefined): Amka | undefined {
    if (!value || value.trim() === '') return undefined;
    return Amka.create(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Amka): boolean {
    return this.value === other.value;
  }
}
