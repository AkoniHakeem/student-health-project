// src/services/appointmentService.ts
import { api } from 'boot/axios';
import { apiRoutes } from 'src/lib/constants/apiRoutes';
import type { PaginatedAppointments } from 'src/types';

export interface Appointment {
  id: string;
  date: string; // ISO string
  time: string; // e.g. '14:30'
  doctor: string;
  status: 'upcoming' | 'completed' | 'missed' | 'cancelled';
  // ...any other fields
}

export default {
  /** Dashboard stats */
  getDashboardStats() {
    return api
      .get(apiRoutes.appointments.dashboard)
      .then((res) => res.data as { completed: number; upcoming: number; missed: number });
  },

  /** Fetch all appointments for the current student */
  getAll() {
    return api.get<PaginatedAppointments>(apiRoutes.appointments.base).then((res) => res.data);
  },

  /** Fetch one by id */
  getById(id: string) {
    return api.get<Appointment>(apiRoutes.appointments.byId(id)).then((res) => res.data);
  },

  /** Create new */
  async create(data: { date: Date; staffId: string; reason: string }) {
    return api.post<Appointment>(apiRoutes.appointments.base, data).then((res) => res.data);
  },

  /** Update (e.g. cancel or reschedule) */
  update(id: string, data: Partial<Appointment>) {
    return api.patch<Appointment>(apiRoutes.appointments.byId(id), data).then((res) => res.data);
  },

  getAllClinicStaffs() {
    return api
      .get(apiRoutes.appointments.clinicStaffs)
      .then(
        (res) => res.data as { id: string; firstName: string; lastName: string; email: string }[],
      );
  },
};
