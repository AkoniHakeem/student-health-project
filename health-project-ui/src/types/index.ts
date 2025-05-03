export type UserRole = 'student' | 'clinic_staff' | 'admin';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
};

export interface HealthRecord {
  id: string;
  date: string; // ISO 8601 string
  note: string;
  appointmentId: string;
}

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: 'student';
}

export interface Staff {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: 'clinic_staff';
}

export interface Appointment {
  id: number;
  date: string; // ISO 8601 format
  status: 'approved' | 'rescheduled' | 'pending' | 'cancelled' | 'completed';
  student: Student;
  staff: Staff;
}

export interface PaginatedAppointments {
  items: Appointment[];
  total: number;
  page: number;
  perPage: number;
}

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: 'student';
}

export interface Author {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: 'clinic_staff';
}

export interface Appointment {
  id: number;
  date: string; // ISO 8601 format
  status: 'approved' | 'rescheduled' | 'pending' | 'cancelled' | 'completed';
  student: Student;
}

export interface HealthRecord {
  id: string;
  note: string;
  createdAt: string; // ISO 8601 format
  appointment: Appointment;
  author: Author;
}
