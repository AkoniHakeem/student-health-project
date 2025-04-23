<template>
  <q-page class="q-pa-none">
    <!-- DESKTOP & TABLET (md+) -->
    <div v-if="$q.screen.gt.sm" class="row no-wrap full-height">
      <!-- Left Panel: Branding + Image (40%) -->
      <div
        class="col-12 col-md-5 bg-blue-1 text-white flex flex-center column q-pa-xl"
        style="height: 100vh"
      >
        <div class="row items-center q-mb-lg">
          <q-icon name="medical_services" size="40px" />
          <div class="text-h6 text-weight-bold q-ml-sm">HealthLink</div>
        </div>
        <div class="text-h5 text-weight-bold text-center q-mb-lg">
          Join the platform that powers modern healthcare.
        </div>
        <q-img
          src="https://images.pexels.com/photos/932678/pexels-photo-932678.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
          alt="Healthcare professional"
          class="signup-image"
          fit="contain"
        />
      </div>

      <!-- Right Panel: Sign Up Form (60%) -->
      <div
        class="col-12 col-md-7 flex flex-center full-height"
        :style="{ marginTop: $q.screen.gt.sm ? '3vh' : '0' }"
      >
        <q-card flat bordered class="q-pa-xl" style="width: 100%; max-width: 400px">
          <div class="text-h6 text-weight-bold q-mb-md">Create your account</div>

          <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
            <q-input
              v-model="form.firstName"
              label="First name"
              outlined
              :rules="[(v) => !!v || 'First name is required']"
            />
            <q-input
              v-model="form.lastName"
              label="Last name"
              outlined
              :rules="[(v) => !!v || 'Last name is required']"
            />
            <q-input
              v-model="form.email"
              label="Email"
              type="email"
              outlined
              :rules="[(v) => !!v || 'Email is required']"
            />
            <q-input
              v-model="form.password"
              label="Password"
              type="password"
              outlined
              :rules="[(v) => !!v || 'Password is required']"
            />
            <q-input
              v-model="form.confirmPassword"
              label="Confirm password"
              type="password"
              outlined
              :rules="[(v) => form.confirmPassword === form.password || 'Passwords must match']"
            />

            <q-btn
              label="Sign up"
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
            Already have an account?
            <q-btn flat label="Log in" color="primary" @click="router.push('/login')" size="sm" />
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

      <!-- Sign Up Form Only -->
      <q-card flat bordered class="q-pa-xl" style="width: 100%; max-width: 400px">
        <div class="text-h6 text-weight-bold q-mb-md">Create your account</div>

        <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
          <q-input
            v-model="form.firstName"
            label="First name"
            outlined
            :rules="[(v) => !!v || 'First name is required']"
          />
          <q-input
            v-model="form.lastName"
            label="Last name"
            outlined
            :rules="[(v) => !!v || 'Last name is required']"
          />
          <q-input
            v-model="form.email"
            label="Email"
            type="email"
            outlined
            :rules="[(v) => !!v || 'Email is required']"
          />
          <q-input
            v-model="form.password"
            label="Password"
            type="password"
            outlined
            :rules="[(v) => !!v || 'Password is required']"
          />
          <q-input
            v-model="form.confirmPassword"
            label="Confirm password"
            type="password"
            outlined
            :rules="[(v) => form.confirmPassword === form.password || 'Passwords must match']"
          />

          <q-btn
            label="Sign up"
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
          Already have an account?
          <q-btn flat label="Log in" color="primary" @click="router.push('/login')" size="sm" />
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

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
});

async function handleSubmit() {
  if (form.value.password !== form.value.confirmPassword) return;
  try {
    await authStore.signup({
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password,
    });
  } catch {
    // error surfaced via authStore.error
  }
}
</script>

<style scoped>
.full-height {
  min-height: 100vh;
}
.signup-image {
  max-width: 250px;
  border-radius: 8px;
}
@media (max-width: 599px) {
  .signup-image {
    max-width: 180px;
  }
}
</style>
