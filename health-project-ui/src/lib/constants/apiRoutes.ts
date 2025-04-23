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
};
