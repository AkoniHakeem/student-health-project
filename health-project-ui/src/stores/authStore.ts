import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'boot/axios';
import { apiRoutes } from 'src/lib/constants/apiRoutes';

export type UserRole = 'student' | 'clinic_staff' | 'admin';

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
};

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  const token = ref<string | null>(localStorage.getItem('token'));
  const user = ref<User | null>(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  );
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  function setToken(newToken: string) {
    token.value = newToken;
    localStorage.setItem('token', newToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  }

  function setUser(newUser: User) {
    user.value = newUser;
    localStorage.setItem('user', JSON.stringify(newUser));
  }

  function clearSession() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  }

  async function loadUser() {
    try {
      if (!token.value) return;
      api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
      const res = await api.get(apiRoutes.auth.me);
      setUser(res.data);
    } catch {
      clearSession();
      throw new Error('Session expired or user fetch failed.');
    }
  }

  async function login(email: string, password: string) {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.post(apiRoutes.auth.login, { email, password });
      setToken(res.data.accessToken);
      await loadUser();
      await router.push('/student/dashboard');
    } catch (err) {
      error.value =
        (err as { response: { data: { message: string } } })?.response?.data?.message ||
        'Login failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function signup(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    loading.value = true;
    error.value = null;
    try {
      await api.post(apiRoutes.auth.register, { ...data, role: 'student' });
      await login(data.email, data.password);
    } catch (err) {
      error.value =
        (err as { response: { data: { message: string } } })?.response?.data?.message ||
        'Sign up failed';
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    clearSession();
    await router.replace('/login');
  }

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    signup,
    logout,
    loadUser,
    clearSession,
  };
});
