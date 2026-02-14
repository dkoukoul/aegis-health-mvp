// ── User Domain Entity ──

import { v4 as uuidv4 } from 'uuid';

export interface UserProps {
  id?: string;
  name: string;
  pinHash: string; // Stored hash of the PIN
  color?: string;  // For potential collaboration avatar
  createdAt?: string;
  lastLoginAt?: string;
}

export class User {
  readonly id: string;
  name: string;
  pinHash: string;
  color: string;
  readonly createdAt: string;
  lastLoginAt?: string;

  constructor(props: UserProps) {
    this.id = props.id ?? uuidv4();
    this.name = props.name.trim();
    this.pinHash = props.pinHash;
    this.color = props.color ?? this.generateColor();
    this.createdAt = props.createdAt ?? new Date().toISOString();
    this.lastLoginAt = props.lastLoginAt;
  }

  // Generate a random color for the user
  private generateColor(): string {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 50%)`;
  }

  // Simple validation logic if needed
  isValid(): boolean {
    return this.name.length > 0 && this.pinHash.length > 0;
  }

  toPlain(): UserProps {
    return {
      id: this.id,
      name: this.name,
      pinHash: this.pinHash,
      color: this.color,
      createdAt: this.createdAt,
      lastLoginAt: this.lastLoginAt,
    };
  }
}
