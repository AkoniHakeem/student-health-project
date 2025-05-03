export const apiRoutes = {
  auth: {
    login: '/users/login',
    register: '/users/register',
    me: '/users/me',
  },
  users: {
    base: '/users',
    byId: (id: string) => `/users/${id}`,
    updateMe: '/users/me',
    deleteById: (id: string) => `/users/${id}`,
  },
  appointments: {
    base: '/appointments',
    dashboard: '/appointments/dashboard',
    byId: (id: string) => `/appointments/${id}`,
    approve: (id: string) => `/appointments/${id}/approve`,
    records: (appointmentId: string) => `/appointments/${appointmentId}/records`,
    clinicStaffs: '/appointments/staffs',
  },
  students: {
    records: (studentId: string) => `/students/${studentId}/records`,
  },
  symptomLogs: {
    base: '/symptom-logs',
    byId: (id: string) => `/symptom-logs/${id}`,
    forStudent: (studentId: string) => {
      debugger;
      return `/symptom-logs/students/${studentId}`;
    },
  },
};
