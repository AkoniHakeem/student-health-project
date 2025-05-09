import { route } from 'quasar/wrappers';
import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import { authGuard } from './guards';

export default route(function () {
  const Router = createRouter({
    history: createWebHistory(),
    routes,
  });

  Router.beforeEach(authGuard);

  return Router;
});
