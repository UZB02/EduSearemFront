<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
    <Card v-for="item in stats" :key="item.label">
      <template #content>
        <div class="text-center">
          <p class="text-gray-500">{{ item.label }}</p>
          <p class="text-2xl font-bold">{{ item.value }}</p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({ adminId: String })
const stats = ref([])

onMounted(async () => {
  const res = await axios.get(`/dashboard/summary/${props.adminId}`)
  stats.value = res.data
})
</script>
