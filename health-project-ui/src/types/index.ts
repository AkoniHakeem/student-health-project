export type UserRole = 'student' | 'clinic_staff' | 'admin';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
};
