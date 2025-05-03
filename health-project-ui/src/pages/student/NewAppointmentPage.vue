<template>
  <q-page class="bg-grey-2 q-pa-md flex justify-center">
    <div class="full-width" style="max-width: 600px">
      <!-- Title -->
      <div class="text-h5 text-weight-bold q-mb-lg">Book a New Appointment</div>

      <!-- Form Card -->
      <q-card flat bordered class="bg-white shadow-1">
        <q-card-section>
          <q-form @submit.prevent="handleSubmit" class="q-gutter-md">
            <!-- Date -->
            <q-input
              v-model="form.date"
              label="Date"
              type="date"
              outlined
              :rules="[(v) => !!v || 'Date is required']"
            />

            <!-- Time -->
            <q-input
              v-model="form.time"
              label="Time"
              type="time"
              outlined
              :rules="[(v) => !!v || 'Time is required']"
            />

            <!-- Doctor -->
            <q-select
              v-model="form.doctorId"
              label="Doctor"
              :options="doctorOptions"
              option-label="label"
              option-value="value"
              outlined
              use-input
              input-debounce="300"
              :rules="[(v) => !!v || 'Please select a doctor']"
              emit-value
              map-options
            />

            <!-- Reason -->
            <q-input
              v-model="form.reason"
              label="Reason"
              type="textarea"
              outlined
              placeholder="Optional"
            />

            <!-- Error Banner -->
            <q-banner v-if="error" class="bg-red-1 text-red-10 q-mt-md">
              {{ error }}
            </q-banner>

            <!-- Submit Button -->
            <div class="row justify-end q-mt-lg">
              <q-btn label="Book Appointment" color="primary" type="submit" :loading="loading" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import appointmentService from 'src/services/appointmentService';
import { useQuasar } from 'quasar';
// import { useAuthStore } from 'stores/authStore';

interface DoctorOption {
  label: string;
  value: string;
}

const $q = useQuasar();

const router = useRouter();
// const authStore = useAuthStore();
const loading = ref(false);
const error = ref<string | null>(null);
const staffsAvailableForAppointment = ref<
  { id: string; firstName: string; lastName: string; email: string }[]
>([]);

const form = reactive({
  date: '',
  time: '',
  doctorId: '',
  reason: '',
});

// Submit handler
async function handleSubmit() {
  error.value = null;
  loading.value = true;
  try {
    // combine data and time:
    const dateTime = new Date(`${form.date}T${form.time}`);
    if (isNaN(dateTime.getTime())) {
      $q.notify({
        type: 'negative',
        message: 'Invalid date or time.',
      });
      console.log('Invalid date or time');
      return;
    }
    await appointmentService.create({
      date: dateTime,
      staffId: form.doctorId,
      reason: form.reason,
    });
    // Redirect back to list
    await router.push('/student/appointments');
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to book appointment.';
  } finally {
    loading.value = false;
  }
}

// Populate doctor dropdown by fetching users with clinic_staff role
const doctorOptions = ref<DoctorOption[]>([]);
onMounted(async () => {
  try {
    staffsAvailableForAppointment.value = await appointmentService.getAllClinicStaffs();
    if (!staffsAvailableForAppointment.value) {
      $q.notify('Failed to available staffs');
      return;
    }
    doctorOptions.value = staffsAvailableForAppointment.value.map((u) => ({
      value: u.id,
      label: `Dr. ${u.firstName} ${u.lastName}`,
    }));
  } catch (e) {
    console.error('Failed to load doctors', e);
  }
});
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>
