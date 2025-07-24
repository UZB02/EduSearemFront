<template>
  <Card>
    <template #title>Balans O‘zgarishi</template>
    <template #content>
      <Chart type="bar" :data="chartData" :options="options" />
    </template>
  </Card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({ adminId: String })

const chartData = ref({ labels: [], datasets: [] })
const options = {
  responsive: true,
  plugins: { legend: { display: false } },
}

onMounted(async () => {
  const { data } = await axios.get(`/dashboard/balance-by-month/${props.adminId}`)
  console.log(data);
  chartData.value = {
    labels: data.labels,
    datasets: [
      {
        label: 'Balans',
        data: data.values,
        backgroundColor: '#8b5cf6',
      },
    ],
  }
})
</script>
