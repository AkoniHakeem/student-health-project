<!-- src/pages/student/HealthRecordsPage.vue -->
<template>
  <q-page class="bg-grey-2 q-pa-md">
    <!-- Page Title -->
    <div class="text-h5 text-weight-bold q-mb-md">My Health Records</div>

    <!-- Records List or Empty State -->
    <div v-if="healthRecords.length > 0" class="column q-gutter-md q-mt-md">
      <q-card
        v-for="record in healthRecords"
        :key="record.id"
        flat
        bordered
        class="bg-white shadow-1 overflow-hidden"
      >
        <div class="row items-center justify-between q-pa-md">
          <div>
            <div class="text-subtitle1">
              {{
                DateTime.fromJSDate(new Date(record.appointment.date), { zone: 'utc' }).toFormat(
                  'FF',
                )
              }}
            </div>
            <div class="text-caption">
              Dr. {{ record.author.firstName + ' ' + record.author.lastName }}
            </div>
          </div>
          <q-btn
            flat
            label="View full note"
            color="primary"
            @click="viewNote(record.appointment.id)"
          />
        </div>
      </q-card>
    </div>
    <div v-else class="column items-center justify-center text-center q-pa-xl">
      <q-icon name="mdi-file-document-outline" size="64px" class="text-grey-5" />
      <div class="text-subtitle2 text-grey-6 q-mt-md">No visit notes yet</div>
      <div class="text-caption text-grey-5">
        You'll see your health records here after your first consultation.
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { HealthRecord } from 'src/services/healthRecordService';
import healthRecordService from 'src/services/healthRecordService';
import { useAuthStore } from 'stores/authStore';
import { DateTime } from 'luxon';

const healthRecords = ref<HealthRecord[]>([]);
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  healthRecords.value = await healthRecordService.getStudentRecords(authStore.user!.id);
});

function formatDate(date: string) {
  const dt = new Date(date);
  return dt.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

async function viewNote(id: string) {
  await router.push(`/student/health-records/${id}`);
}
</script>

<style scoped>
/* Quasar handles responsiveness */
</style>
