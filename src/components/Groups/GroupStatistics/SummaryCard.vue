<template>
  <Card class="shadow-lg border-0 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <template #content>
      <div class="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <p class="text-sm text-gray-600 mb-1">{{ title }}</p>
          <p :class="'text-2xl font-bold text-' + color + '-600'">{{ value }}</p>
          <p v-if="subtitle" class="text-xs text-gray-500 mt-1">{{ subtitle }}</p>
        </div>
        <div :class="'w-12 h-12 bg-' + color + '-100 rounded-lg flex items-center justify-center'">
          <i :class="'pi ' + icon + ' text-' + color + '-600 text-xl'"></i>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card';
const props = defineProps({
  title: String,
  value: [String, Number],
  subtitle: String,  // qo‘shildi
  icon: String,
  color: String
});
</script>
