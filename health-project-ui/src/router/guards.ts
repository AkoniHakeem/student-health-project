import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from 'stores/authStore';

export function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const authStore = useAuthStore();

  const isAuthenticated = authStore.isAuthenticated;
  const userRole = authStore.user?.role;

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) return next('/login');

    if (to.meta.role && to.meta.role !== userRole) return next('/login');
  }

  next();
}
