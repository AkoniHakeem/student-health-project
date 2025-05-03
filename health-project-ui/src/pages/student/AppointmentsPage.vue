<!-- src/pages/student/AppointmentsPage.vue -->
<template>
  <q-page class="bg-grey-2 q-pa-md">
    <!-- Page Title and Tabs -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h5 text-weight-bold">My Appointments</div>
      <q-btn color="primary" icon="add" label="Book Appointment" @click="goToBooking" />
    </div>

    <!-- Tabs for filtering -->
    <q-tabs
      v-model="activeTab"
      class="text-primary"
      active-color="primary"
      indicator-color="primary"
      align="left"
      dense
    >
      <q-tab name="upcoming" label="Upcoming" />
      <q-tab name="past" label="Past" />
      <q-tab name="cancelled" label="Cancelled" />
    </q-tabs>

    <!-- Empty State -->
    <div
      v-if="filteredAppointments?.length === 0"
      class="column items-center justify-center q-pa-xl"
    >
      <q-icon :name="emptyIcon" size="64px" class="text-grey-5" />
      <div class="text-subtitle2 text-grey-6 q-mt-md">{{ emptyMessage }}</div>
    </div>

    <!-- Appointment Cards -->
    <div v-else class="column q-gutter-md q-mt-md">
      <q-card
        v-for="appt in filteredAppointments"
        :key="appt.id"
        flat
        bordered
        class="bg-white shadow-1 overflow-hidden"
      >
        <div class="row items-center justify-between q-pa-md">
          <div>
            <div class="text-subtitle1">
              {{ DateTime.fromJSDate(new Date(appt.date), { zone: 'utc' }).toFormat('FF') }}
            </div>
            <div class="text-caption">
              Dr. {{ appt.staff.firstName + ' ' + appt.staff.lastName }}
            </div>
          </div>
          <q-chip :color="statusColor(appt.status)" text-color="white" dense label>
            {{ capitalize(appt.status) }}
          </q-chip>
        </div>
      </q-card>
    </div>

    <!-- Bottom CTA -->
    <div class="row justify-center q-mt-lg">
      <q-btn color="primary" label="Book Appointment" size="lg" @click="goToBooking" />
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import appointmentService from 'src/services/appointmentService';
import { DateTime } from 'luxon';
import type { PaginatedAppointments } from 'src/types';

const $q = useQuasar();
const router = useRouter();

// State
const appointments = ref<PaginatedAppointments>();
const activeTab = ref<'upcoming' | 'past' | 'cancelled'>('upcoming');

// Load data
onMounted(async () => {
  appointments.value = await appointmentService.getAll();
  console.log('Appointments loaded:', appointments.value);
});

// Filtered list
const filteredAppointments = computed(() => {
  const now = new Date();
  return appointments.value?.items.filter((a) => {
    const dt = new Date(a.date);
    if (activeTab.value === 'upcoming') {
      return a.status === 'pending' && dt >= now;
    }
    if (activeTab.value === 'past') {
      return a.status === 'completed' || (dt < now && a.status !== 'cancelled');
    }
    return a.status === 'cancelled';
  });
});

// Empty state helpers
const emptyIcon = computed(() => {
  switch (activeTab.value) {
    case 'upcoming':
      return 'mdi-calendar-clock';
    case 'past':
      return 'mdi-history';
    case 'cancelled':
      return 'mdi-calendar-remove';
    default:
      return 'mdi-calendar';
  }
});
const emptyMessage = computed(() => {
  switch (activeTab.value) {
    case 'upcoming':
      return 'No upcoming appointments.';
    case 'past':
      return 'No past appointments.';
    case 'cancelled':
      return 'No cancelled appointments.';
    default:
      return 'No appointments to show.';
  }
});

// Navigation
async function goToBooking() {
  await router.push('/student/appointments/new');
}

// Helpers
function formatDateTime(date: string, time: string) {
  const dt = new Date(date + 'T' + time);
  return dt.toLocaleString($q.lang.isoName, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
}
function statusColor(status: string) {
  switch (status) {
    case 'upcoming':
      return 'blue';
    case 'completed':
      return 'green';
    case 'missed':
      return 'orange';
    case 'cancelled':
      return 'red';
    default:
      return 'grey';
  }
}
function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
</script>

<style scoped>
/* No extra CSS needed—Quasar handles spacing and responsiveness */
</style>
