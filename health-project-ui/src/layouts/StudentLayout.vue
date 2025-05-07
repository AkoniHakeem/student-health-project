<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Side Navigation Drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      :mini="isMini"
      :persistent="!isMini"
      side="left"
      bordered
      class="bg-primary text-white"
      :width="isMini ? 80 : 250"
    >
      <!-- Logo & App Name -->
      <div class="q-pa-md flex items-center">
        <q-icon name="medical_services" size="28px" class="q-mr-sm" />
        <span v-if="!isMini" class="text-h6 text-white">HealthLink</span>
      </div>

      <!-- Navigation Items -->
      <q-list padding>
        <q-item clickable to="/student/dashboard" active-class="bg-white text-primary">
          <q-item-section avatar>
            <q-icon name="dashboard" class="text-white" />
          </q-item-section>
          <q-item-section v-if="!isMini">Dashboard</q-item-section>
        </q-item>

        <!-- Appointments with Submenu -->
        <q-expansion-item
          icon="event"
          :label="!isMini ? 'Appointments' : ''"
          expand-icon="chevron_right"
          group="nav"
          class="text-white"
          :icon-size="isMini ? '24px' : '20px'"
          :dense="isMini"
        >
          <q-list padding class="bg-primary">
            <q-item
              inset-level="1"
              clickable
              to="/student/appointments"
              active-class="bg-white text-primary"
            >
              <q-item-section> All </q-item-section>
            </q-item>
            <q-item
              inset-level="1"
              clickable
              to="/student/appointments/new"
              active-class="bg-white text-primary"
            >
              <q-item-section> New </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <!-- Health Records -->
        <q-item clickable to="/student/health-records" active-class="bg-white text-primary">
          <q-item-section avatar>
            <q-icon name="folder" class="text-white" />
          </q-item-section>
          <q-item-section v-if="!isMini">My Health Records</q-item-section>
        </q-item>

        <!-- Symptoms Log -->
        <q-item clickable to="/student/symptom-logs" active-class="bg-white text-primary">
          <q-item-section avatar>
            <q-icon name="assignment" class="text-white" />
          </q-item-section>
          <q-item-section v-if="!isMini">Symptoms Log</q-item-section>
        </q-item>

        <!-- Profile -->
        <!-- <q-item clickable to="/student/profile" active-class="bg-white text-primary">
          <q-item-section avatar>
            <q-icon name="person" class="text-white" />
          </q-item-section>
          <q-item-section v-if="!isMini">Profile</q-item-section>
        </q-item>-->
      </q-list>

      <!-- Logout at bottom -->
      <div class="absolute-bottom q-pa-md">
        <q-item clickable @click="logout">
          <q-item-section avatar>
            <q-icon name="logout" class="text-white" />
          </q-item-section>
          <q-item-section v-if="!isMini">Logout</q-item-section>
        </q-item>
      </div>
    </q-drawer>

    <!-- Main Content Container -->
    <q-page-container class="bg-grey-2" :style="contentOffset">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from 'stores/authStore';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const isMini = computed(() => $q.screen.lt.md);
const leftDrawerOpen = ref($q.screen.gt.sm);

const contentOffset = computed(() => {
  return $q.screen.gt.sm && leftDrawerOpen.value ? { marginLeft: '250px' } : {};
});

const authStore = useAuthStore();

async function logout() {
  await authStore.logout();
}
</script>

<style scoped>
/* Quasar handles drawer and layout responsiveness */
</style>
