<template>
  <Card>
    <template #title>
      <div class="flex items-center space-x-2">
        <i class="pi pi-chart-bar text-purple-500"></i>
        <span>Statistika</span>
      </div>
    </template>
    <template #content>
      <div class="space-y-4">
        <div class="stat-card bg-blue-50 text-blue-600">
          <i class="pi pi-star-fill" /> Ballar
          <span>{{ teacher.points }}</span>
        </div>
        <div class="stat-card bg-green-50 text-green-600">
          <i class="pi pi-dollar" /> Oylik maosh
          <span>{{ formatCurrency(teacher.monthlySalary) }}</span>
        </div>
        <div class="stat-card bg-orange-50 text-orange-600">
          <i class="pi pi-calendar" /> Maosh soni
          <span>{{ teacher.salaries?.length || 0 }}</span>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card'
defineProps(['teacher'])

const formatCurrency = (amount) => new Intl.NumberFormat('uz-UZ', {
  style: 'currency', currency: 'UZS', minimumFractionDigits: 0
}).format(amount)
</script>

<style scoped>

</style>
