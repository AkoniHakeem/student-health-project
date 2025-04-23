<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>HealthLink</q-toolbar-title>
        <q-btn flat dense icon="logout" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list>
        <q-item clickable to="/student/dashboard">
          <q-item-section>Dashboard</q-item-section>
        </q-item>
        <q-item clickable to="/student/appointments">
          <q-item-section>Appointments</q-item-section>
        </q-item>
        <q-item clickable to="/student/health-records">
          <q-item-section>Health Records</q-item-section>
        </q-item>
        <q-item clickable to="/student/profile">
          <q-item-section>Profile</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container :style="$q.screen.gt.sm ? { marginLeft: drawerWidth } : {}">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'stores/authStore';

const router = useRouter();
const leftDrawerOpen = ref(false);
const drawerWidth = '250px'; // Adjust this value as needed
const authStore = useAuthStore();

async function logout() {
  await authStore.logout();
  await router.push('/login');
}
</script>
