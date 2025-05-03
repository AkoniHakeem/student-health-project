<template>
  <q-card flat bordered class="q-pa-md" style="height: 100%">
    <div class="text-subtitle1 q-mb-sm">Appointments</div>
    <v-chart :option="chartOption as any" autoresize style="height: calc(100% - 24px)" />
  </q-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { VueEcharts as VChart } from 'vue3-echarts';
import type { EChartsOption } from 'echarts';

const props = defineProps<{
  appointments: {
    upcoming: number;
    completed: number;
    missed: number;
  };
}>();

const chartOption = ref<EChartsOption>({
  tooltip: { trigger: 'item' },
  legend: { bottom: 10 },
  series: [
    {
      name: 'Appointments',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      label: { show: false, position: 'center' },
      emphasis: {
        label: { show: true, fontSize: '16', fontWeight: 'bold' },
      },
      labelLine: { show: false },
      data: [],
    },
  ],
});

watch(
  () => props.appointments,
  (appointments) => {
    if (!appointments) return;
    chartOption.value.series = [
      {
        ...(chartOption.value.series as any)[0],
        data: [
          { value: appointments.completed, name: 'Completed' },
          { value: appointments.upcoming, name: 'Upcoming' },
          { value: appointments.missed, name: 'Missed' },
        ],
      },
    ];
  },
  { immediate: true },
);
</script>

<style scoped>
q-card {
  height: 100%;
}
</style>
