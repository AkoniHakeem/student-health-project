<template>
  <q-card flat bordered class="q-pa-md" style="height: 100%">
    <div class="text-subtitle1 q-mb-sm">Visit History</div>
    <v-chart :option="chartOption as any" autoresize style="height: calc(100% - 24px)" />
  </q-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { VueEcharts as VChart } from 'vue3-echarts';
import type { EChartsOption } from 'echarts';

const props = defineProps<{
  visitHistory: {
    month: string;
    count: number;
  }[];
}>();

const chartOption = ref<EChartsOption>({
  tooltip: { trigger: 'axis' },
  xAxis: { type: 'category', data: [] },
  yAxis: { type: 'value', min: 0, interval: 1 },
  series: [{ name: 'Visits', type: 'line', data: [], smooth: true }],
});

watch(
  () => props.visitHistory,
  (visitHistory) => {
    if (!visitHistory) return;
    chartOption.value.xAxis = {
      ...(chartOption.value.xAxis as any),
      data: visitHistory.map((v) => v.month),
    };
    chartOption.value.series = [
      {
        ...(chartOption.value.series as any)[0],
        data: visitHistory.map((v) => v.count),
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
