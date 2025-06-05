export type UserRole = 'ADMIN' | 'MANAGER' | 'USER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  metadata?: Record<string, any>;
}

export interface UserInput {
  email: string;
  name: string;
  role: UserRole;
  metadata?: Record<string, any>;
} 