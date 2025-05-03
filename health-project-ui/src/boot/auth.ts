import { defineBoot } from '#q-app/wrappers';
import { useAuthStore } from 'src/stores/authStore';

export default defineBoot(async () => {
  const authStore = useAuthStore();

  // Check if a token exists and load the user
  if (authStore.token) {
    try {
      await authStore.loadUser();
    } catch (error) {
      console.error('Failed to load user:', error);
      authStore.clearSession();
    }
  }
});
