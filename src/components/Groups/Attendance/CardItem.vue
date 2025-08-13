<template>
  <Card class="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
    <template #content>
      <div class="p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">{{ title }}</p>
            <p class="text-2xl font-bold" :class="`text-${color}-600`">{{ value }}</p>
          </div>
          <div :class="`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center`">
            <i :class="`${icon} text-${color}-600 text-xl`"></i>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script setup>
import { defineProps } from "vue";
import Card from "primevue/card";

const props = defineProps({
  title: String,
  value: [String, Number], // value number yoki string bo'lishi mumkin
  icon: String,
  color: { type: String, default: "blue" }, // blue, green, orange, red
});
</script>
