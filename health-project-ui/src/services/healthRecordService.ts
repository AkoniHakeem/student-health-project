// src/services/healthRecordService.ts
import { api } from 'boot/axios';
import { apiRoutes } from 'src/lib/constants/apiRoutes';
import type { HealthRecord } from 'src/types';

export default {
  /**
   * Fetch all records for a given student.
   */
  getStudentRecords(studentId: string) {
    return api.get(apiRoutes.students.records(studentId)).then((res) => res.data);
  },

  /**
   * (Optional) Fetch all records tied to a specific appointment.
   */
  async getAppointmentRecords(appointmentId: string) {
    const response = await api.get(apiRoutes.appointments.records(appointmentId));

    return response?.data as HealthRecord[];
  },

  /**
   * (Helper) Get the most recent N records for a student.
   */
  getRecentRecords(studentId: string, limit = 3) {
    return this.getStudentRecords(studentId).then((records) =>
      // sort descending by date, then take first `limit`
      records
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit),
    );
  },
};
