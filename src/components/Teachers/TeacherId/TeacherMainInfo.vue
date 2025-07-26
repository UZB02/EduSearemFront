<template>
  <Card>
    <template #title>
      <div class="flex items-center space-x-2">
        <i class="pi pi-user text-blue-500"></i>
        <span>Asosiy ma'lumotlar</span>
      </div>
    </template>
    <template #content>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-3">
          <div v-for="(label, key) in leftFields" :key="key">
            <label class="text-sm font-medium text-gray-500">{{ label }}</label>
            <p class="text-gray-900 font-medium">{{ teacher[key] }}</p>
          </div>
        </div>
        <div class="space-y-3">
          <div v-for="(label, key) in rightFields" :key="key">
            <label class="text-sm font-medium text-gray-500">{{ label }}</label>
            <p class="text-gray-900 font-mono text-sm">{{ teacher[key] }}</p>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card'
defineProps(['teacher'])

const leftFields = {
  name: "Ism",
  lastname: "Familiya",
  science: "Fan"
}

const rightFields = {
  _id: "ID",
  userId: "Foydalanuvchi ID",
  __v: "Versiya"
}
</script>
