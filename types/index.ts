export type Role = 'ADMIN' | 'MANAGER' | 'QA' | 'AGENT';

export interface User {
  id: string;
  email: string;
  supabaseId: string | null;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  role: Role;
  organizationId: string | null;
  teamId: string | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  name: string;
  description: string | null;
  organizationId: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Setting {
  id: string;
  organizationId: string;
  qaRubric: QARubric;
  crmIntegrationSettings: Record<string, unknown> | null;
  notificationsConfig: {
    email: boolean;
    inApp: boolean;
  };
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface QARubric {
  compliance: string[];
  softSkills: string[];
}
