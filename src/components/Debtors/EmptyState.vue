<template>
  <div class="text-center py-8">
    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <i class="pi pi-search text-gray-400 text-2xl"></i>
    </div>
    <h3 class="text-lg font-medium text-gray-800 mb-2">
      {{ type === 'debtors' ? 'Qarzdorlar topilmadi' : 'Haqdorlar topilmadi' }}
    </h3>
    <p class="text-gray-500">Qidiruv so'zini o'zgartiring yoki filtrlash shartlarini tekshiring</p>
  </div>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    required: true
  }
});
</script>
