<!-- filepath: /home/akonimayowa/projects/student-health/health-project-ui/src/pages/student/HealthRecordDetailPage.vue -->
<template>
  <q-page class="bg-grey-2 q-pa-md flex justify-center">
    <div class="full-width" style="max-width: 700px">
      <!-- Title & Back Link -->
      <div class="text-h5 text-weight-bold q-mb-xs">
        Visit Note – {{ DateTime.fromJSDate(record?.createdAt, { zone: 'utc' }).toFormat('FF') }}
      </div>
      <q-btn flat small color="primary" class="q-mb-md" @click="goBack">
        <q-icon name="arrow_back" class="q-mr-xs" />
        Back to My Health Records
      </q-btn>

      <!-- Record Details Card -->
      <q-card flat bordered class="bg-white shadow-1 q-py-md q-px-sm">
        <q-list>
          <q-item>
            <q-item-section class="text-weight-medium">Date</q-item-section>
            <q-item-section side>{{
              DateTime.fromJSDate(record?.createdAt, { zone: 'utc' }).toFormat('FF')
            }}</q-item-section>
          </q-item>
          <q-separator />

          <q-item>
            <q-item-section class="text-weight-medium">Doctor</q-item-section>
            <q-item-section side
              >Dr. {{ record?.author?.firstName + ' ' + record?.author?.lastName }}</q-item-section
            >
          </q-item>
          <q-separator />

          <q-item>
            <q-item-section class="text-weight-medium">Diagnosis</q-item-section>
            <q-item-section side>{{ record?.note }}</q-item-section>
          </q-item>
          <q-separator />

          <q-item>
            <q-item-section class="text-weight-medium">Symptoms</q-item-section>
            <q-item-section side>{{ record?.symptoms }}</q-item-section>
          </q-item>
          <q-separator />

          <q-item>
            <q-item-section class="text-weight-medium">Treatment</q-item-section>
            <q-item-section side>{{ record?.treatment }}</q-item-section>
          </q-item>
          <q-separator />

          <q-item>
            <q-item-section class="text-weight-medium">Additional Notes</q-item-section>
            <q-item-section side>{{ record?.additionalNotes }}</q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import healthRecordService from 'src/services/healthRecordService';
import { useQuasar } from 'quasar';
import { DateTime } from 'luxon';

const router = useRouter();
const route = useRoute();
const recordId = route.params.id as string;
const $q = useQuasar();
const record = ref();

onMounted(async () => {
  const data = await healthRecordService.getAppointmentRecords(recordId);
  if (!data) {
    $q.notify('No data found for the given record ID');
    await router.push('/student/health-records');
    return;
  }
  record.value = data;
  console.log('Record loaded:', record.value);
});

async function goBack() {
  await router.push('/student/health-records');
}
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>
