<template>
  <Card>
    <template #title>Oylik To‘lovlar</template>
    <template #content>
      <Chart type="line" :data="chartData" :options="options" />
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
  const { data } = await axios.get(`/dashboard/payments-by-month/${props.adminId}`)
  chartData.value = {
    labels: data.labels,
    datasets: [
      {
        label: 'To‘lovlar',
        data: data.values,
        borderColor: '#22c55e',
        fill: false,
      },
    ],
  }
})
</script>
