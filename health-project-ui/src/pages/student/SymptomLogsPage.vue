<template>
  <q-page class="bg-grey-2 q-pa-md">
    <!-- Page Title -->
    <div class="text-h5 text-weight-bold q-mb-md">Symptoms Log</div>

    <!-- Submit Symptoms Card -->
    <q-card flat bordered class="bg-white shadow-1 q-pa-lg q-mb-xl">
      <div class="text-subtitle1 q-mb-sm">Submit Symptoms</div>

      <q-input
        v-model="text"
        type="textarea"
        placeholder="Describe your symptoms here..."
        autogrow
        maxlength="1000"
        counter
        :rules="[(v) => !!v || 'Please enter your symptoms']"
      />

      <div class="row items-center justify-between q-mt-sm">
        <div>{{ text.length }} / 1000</div>
        <q-btn
          label="Submit"
          color="primary"
          :loading="submitting"
          @click="submit"
          :disable="!text"
        />
      </div>

      <q-card-section v-if="lastDiagnosis" class="bg-grey-1 q-mt-md">
        <div class="text-subtitle2">Possible Diagnosis:</div>
        <div>{{ lastDiagnosis }}</div>
      </q-card-section>
    </q-card>

    <!-- Symptom History -->
    <div class="text-subtitle1 q-mb-sm">Symptom History</div>

    <div v-if="!history.length" class="q-pa-lg bg-white shadow-1 flex flex-center column">
      <q-icon name="assignment" size="48px" class="text-grey-5" />
      <div class="text-subtitle2 q-mt-md">No symptom logs yet</div>
      <div class="text-caption q-mt-xs">
        Once you submit your first symptoms, they’ll appear here.
      </div>
    </div>

    <div v-else class="column q-gutter-md">
      <q-card v-for="log in history" :key="log.id" flat bordered class="bg-white shadow-1">
        <div class="row items-start justify-between q-pa-md">
          <div>
            <div class="text-subtitle2">{{ formatDateTime(log.timestamp) }}</div>
            <div class="text-body1">{{ log?.input }}</div>
            <div class="text-caption q-pt-sm"><strong>Diagnosis:</strong> {{ log.aiResponse }}</div>
          </div>
        </div>
      </q-card>
    </div>

    <!-- Symptoms Log Details -->
    <q-card flat bordered class="bg-white shadow-1 q-pa-md">
      <q-list>
        <!-- Input -->
        <q-item>
          <q-item-section class="text-weight-medium">Symptom Description</q-item-section>
          <q-item-section side>{{ log?.input }}</q-item-section>
        </q-item>
        <q-separator />

        <!-- AI Response -->
        <q-item>
          <q-item-section class="text-weight-medium">AI Response</q-item-section>
          <q-item-section side>{{ log?.aiResponse }}</q-item-section>
        </q-item>
        <q-separator />

        <!-- Student Info -->
        <q-item>
          <q-item-section class="text-weight-medium">Student</q-item-section>
          <q-item-section side>
            {{ log?.student.firstName }} {{ log?.student.lastName }} ({{ log?.student.email }})
          </q-item-section>
        </q-item>
        <q-separator />

        <!-- Health Record -->
        <q-item>
          <q-item-section class="text-weight-medium">Health Record</q-item-section>
          <q-item-section side>
            {{
              DateTime.fromJSDate(new Date(log?.student.healthRecord.createdAt), {
                zone: 'utc',
              }).toFormat('FF')
            }}
          </q-item-section>
        </q-item>
        <q-separator />

        <!-- Timestamp -->
        <q-item>
          <q-item-section class="text-weight-medium">Log Timestamp</q-item-section>
          <q-item-section side>
            {{ DateTime.fromJSDate(new Date(log?.timestamp), { zone: 'utc' }).toFormat('FF') }}
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from 'stores/authStore';
import { useRoute } from 'vue-router';
import type { SymptomLog } from 'src/services/symptomLogService';
import symptomLogService from 'src/services/symptomLogService';
import { DateTime } from 'luxon';

const authStore = useAuthStore();
const text = ref('');
const submitting = ref(false);
const lastDiagnosis = ref<string | null>(null);
const history = ref<SymptomLog[]>([]);
const route = useRoute();
const log = ref<SymptomLog | null>(null);

// Fetch history on mount
async function loadHistory() {
  const user = authStore.user;
  if (user && user.id) {
    const res = await symptomLogService.getForStudent(authStore.user!.id);
    console.log('this is the current user: ', authStore.user);
    console.log('History:', res);
    history.value = res?.data;
  }
}
onMounted(loadHistory);

// Fetch log details on mount
onMounted(async () => {
  const logId = route.params.id as string;
  log.value = await symptomLogService.getById(logId);
});

// Submit handler
async function submit() {
  if (!text.value) return;
  submitting.value = true;
  try {
    const saved = await symptomLogService.create(text.value);
    console.log('Saved:', saved);
    lastDiagnosis.value = saved?.data?.aiResponse;
    text.value = '';
    // Prepend new log
    history.value.unshift(saved.data);
  } finally {
    submitting.value = false;
  }
}

// Formatting helper
function formatDateTime(iso: string) {
  const dt = new Date(iso);
  return dt.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
</script>

<style scoped>
/* No additional CSS needed; Quasar handles spacing and responsive layout */
</style>
