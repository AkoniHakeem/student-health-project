<template>
  <q-page class="q-pa-none">
    <!-- DESKTOP & TABLET (md+) -->
    <div v-if="$q.screen.gt.sm" class="row no-wrap full-height">
      <!-- Left Panel: Branding + Image -->
      <div
        class="col-12 col-md-5 bg-primary text-white flex flex-center column q-pa-xl"
        style="height: 100vh"
      >
        <div class="row items-center q-mb-lg">
          <q-icon name="medical_services" size="40px" />
          <div class="text-h6 text-weight-bold q-ml-sm">HealthLink</div>
        </div>
        <div class="text-h5 text-weight-bold text-center q-mb-lg">
          Welcome back to modern healthcare.
        </div>
        <q-img
          src="assets/medical_seth.jpg"
          alt="Healthcare professional"
          class="medical-image"
          fit="contain"
        />
      </div>

      <!-- Right Panel: Login Form -->
      <div
        class="col-12 col-md-7 flex flex-center full-height"
        :style="{ marginTop: $q.screen.gt.sm ? '20vh' : '0' }"
      >
        <q-card flat bordered class="q-pa-xl" style="width: 100%; max-width: 400px">
          <div class="text-h6 text-weight-bold q-mb-md">Log in to your account</div>

          <q-form @submit.prevent="handleLogin" class="q-gutter-md">
            <q-input
              v-model="email"
              label="Email"
              type="email"
              outlined
              :rules="[(v) => !!v || 'Email is required']"
            />
            <q-input
              v-model="password"
              label="Password"
              type="password"
              outlined
              :rules="[(v) => !!v || 'Password is required']"
            />
            <q-btn
              label="Log In"
              color="primary"
              type="submit"
              class="full-width"
              :loading="authStore.loading"
            />
          </q-form>

          <q-banner v-if="authStore.error" class="bg-red-1 text-red-10 q-mt-md">
            {{ authStore.error }}
          </q-banner>

          <div class="text-center q-mt-md">
            Don’t have an account?
            <q-btn flat label="Sign up" color="primary" @click="router.push('/signup')" size="sm" />
          </div>
        </q-card>
      </div>
    </div>

    <!-- MOBILE (sm & xs) -->
    <div v-else class="flex flex-center column q-pa-md" style="min-height: 100vh">
      <!-- Branding & Icon -->
      <div class="row items-center q-mb-lg">
        <q-icon name="medical_services" size="40px" />
        <div class="text-h6 text-weight-bold q-ml-sm">HealthLink</div>
      </div>

      <!-- Login Form Only -->
      <q-card flat bordered class="q-pa-xl" style="width: 100%; max-width: 400px">
        <div class="text-h6 text-weight-bold q-mb-md">Log in to your account</div>

        <q-form @submit.prevent="handleLogin" class="q-gutter-md">
          <q-input
            v-model="email"
            label="Email"
            type="email"
            outlined
            :rules="[(v) => !!v || 'Email is required']"
          />
          <q-input
            v-model="password"
            label="Password"
            type="password"
            outlined
            :rules="[(v) => !!v || 'Password is required']"
          />
          <q-btn
            label="Log In"
            color="primary"
            type="submit"
            class="full-width"
            :loading="authStore.loading"
          />
        </q-form>

        <q-banner v-if="authStore.error" class="bg-red-1 text-red-10 q-mt-md">
          {{ authStore.error }}
        </q-banner>

        <div class="text-center q-mt-md">
          Don’t have an account?
          <q-btn flat label="Sign up" color="primary" @click="router.push('/signup')" size="sm" />
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'stores/authStore';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');

async function handleLogin() {
  try {
    await authStore.login(email.value, password.value);
  } catch {
    // error is surfaced via authStore.error
  }
}
</script>

<style scoped>
.full-height {
  height: 100vh;
}
.medical-image {
  max-width: 250px;
  border-radius: 8px;
}
@media (max-width: 599px) {
  .medical-image {
    max-width: 180px;
  }
}
</style>
