import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: 'login', component: () => import('pages/auth/LoginPage.vue') },
      { path: 'signup', component: () => import('pages/auth/SignupPage.vue') },
    ],
  },
  {
    path: '/student',
    component: () => import('layouts/StudentLayout.vue'),
    meta: { requiresAuth: true, role: 'student' },
    children: [
      { path: 'dashboard', component: () => import('pages/student/DashboardPage.vue') },
      { path: 'appointments', component: () => import('pages/student/AppointmentsPage.vue') },
      { path: 'appointments/new', component: () => import('pages/student/NewAppointmentPage.vue') },
      { path: 'health-records', component: () => import('pages/student/HealthRecordsPage.vue') },
      {
        path: 'health-records/:id',
        component: () => import('pages/student/HealthRecordDetailPage.vue'),
      },
      {
        path: 'symptom-logs',
        component: () => import('pages/student/SymptomLogsPage.vue'),
      },
      // { path: 'profile', component: () => import('pages/student/ProfilePage.vue') },
    ],
  },
];

export default routes;
