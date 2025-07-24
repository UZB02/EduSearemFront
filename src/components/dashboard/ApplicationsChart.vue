<template>
  <Card>
    <template #title>Oylik Arizalar</template>
    <template #content>
      <Chart type="bar" :data="chartData" :options="options" />
    </template>
  </Card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({ adminId: String })

const chartData = ref({
  labels: [],
  datasets: [],
})

const options = {
  responsive: true,
  plugins: { legend: { display: false } },
}

onMounted(async () => {
  const { data } = await axios.get(`/dashboard/applications-by-month/${props.adminId}`)
  chartData.value = {
    labels: data.labels,
    datasets: [
      {
        label: 'Arizalar',
        data: data.values,
        backgroundColor: '#3b82f6',
      },
    ],
  }
})
</script>
