<template>
  <Card>
    <template #title>Oylik Xarajatlar</template>
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
  const { data } = await axios.get(`/dashboard/expenses-by-month/${props.adminId}`)
  chartData.value = {
    labels: data.labels,
    datasets: [
      {
        label: 'Xarajatlar',
        data: data.values,
        borderColor: '#ef4444',
        fill: false,
      },
    ],
  }
})
</script>
