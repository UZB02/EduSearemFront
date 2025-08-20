<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
    <Card class="w-80 shadow-2xl border-0">
      <template #content>
        <div class="text-center py-8">
          <ProgressSpinner class="mb-4" strokeWidth="4" />
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Ma'lumotlar yuklanmoqda...</h3>
          <p class="text-gray-600 text-sm">Iltimos, kuting</p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from "primevue/card";
import ProgressSpinner from "primevue/progressspinner";

defineProps({
  visible: Boolean
});
</script>
