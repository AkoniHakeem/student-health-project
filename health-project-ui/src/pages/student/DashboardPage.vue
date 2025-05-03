<template>
  <q-page class="bg-grey-2 q-pa-md">
    <!-- Page Title -->
    <div class="row items-center justify-between q-mb-lg">
      <div class="text-h5 text-weight-bold">Student Dashboard</div>
      <div class="text-subtitle2">Here’s your current health status</div>
    </div>

    <!-- Charts Row -->
    <div class="row q-col-gutter-lg q-mb-lg">
      <div class="col-12 col-md-6" style="height: 300px">
        <DonutChart :appointments="recentRecords.appointments" />
      </div>
      <div class="col-12 col-md-6" style="height: 300px">
        <LineChart :visitHistory="recentRecords.visitHistory" />
      </div>
    </div>

    <!-- Book Appointment CTA -->
    <div class="row">
      <div class="col-12">
        <q-card flat bordered class="q-pa-lg shadow-1 bg-white">
          <div class="row items-center justify-between">
            <div class="text-h6">Book Appointment</div>
            <q-btn color="primary" label="Book Appointment" @click="goToBooking" />
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import DonutChart from 'components/student/DonutChart.vue';
import LineChart from 'components/student/LineChart.vue';
import healthRecordService from 'src/services/healthRecordService';
import { onMounted, ref } from 'vue';
import { useAuthStore } from 'src/stores/authStore';
import { useQuasar } from 'quasar';

const router = useRouter();
const authStore = useAuthStore();
const $q = useQuasar();

async function goToBooking() {
  await router.push('/student/appointments');
}

const recentRecords = ref<{
  appointments: {
    upcoming: number;
    completed: number;
    missed: number;
  };
  visitHistory: {
    month: string;
    count: number;
  }[];
}>({
  appointments: {
    upcoming: 2,
    completed: 5,
    missed: 1,
  },
  visitHistory: [
    { month: 'Nov', count: 1 },
    { month: 'Dec', count: 0 },
    { month: 'Jan', count: 1 },
    { month: 'Feb', count: 0 },
    { month: 'Mar', count: 2 },
    { month: 'Apr', count: 0 },
  ],
});

onMounted(async () => {
  const response = await healthRecordService.getRecentRecords(authStore.user!.id);
  if (!response) {
    $q.notify('Failed to fetch recent records');
    return;
  }
  recentRecords.value = response;
});
</script>

<style scoped>
/* No additional styles needed; Quasar grid handles responsiveness */
</style>
