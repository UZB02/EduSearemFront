<template>
  <Card>
    <template #title>So‘nggi Harakatlar</template>
    <template #content>
      <ul class="divide-y divide-gray-200">
        <li v-for="item in recent" :key="item.date" class="py-2 text-sm">
          <span class="font-medium">{{ item.type }}:</span>
          {{ item.description }} –
          <span class="text-gray-500 text-xs">{{ new Date(item.date).toLocaleDateString() }}</span>
        </li>
      </ul>
    </template>
  </Card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const props = defineProps({ adminId: String })
const recent = ref([])

onMounted(async () => {
  const { data } = await axios.get(`/dashboard/recent-activity/${props.adminId}`)
  recent.value = data
})
</script>
