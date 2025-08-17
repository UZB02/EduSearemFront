<template>
  <div class="flex items-center gap-2">
    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
      <i class="pi pi-users text-blue-600 text-sm"></i>
    </div>
    <span class="font-medium text-gray-800">{{ group?.name || '-' }}</span>
  </div>
</template>

<script setup>
defineProps({
  group: {
    type: Object,
    default: () => ({})
  }
});
</script>
