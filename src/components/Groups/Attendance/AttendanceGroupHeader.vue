<template>
 <Card class="mb-6 shadow-lg border-0 overflow-hidden">
  <template #content>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      
      <!-- Orqaga tugma (standart yuqori chap) -->
      <div class="self-start sm:self-auto">
        <Button
          icon="pi pi-arrow-left"
          label="Orqaga"
          severity="secondary"
          @click="$emit('back')"
          class="rounded-lg hover:shadow-md transition-all duration-200"
        />
      </div>
      
      <!-- Guruh va o'qituvchi ma'lumotlari -->
      <div class="flex-1 flex flex-col sm:flex-row sm:items-center gap-4">
        <!-- Group Icon -->
        <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
          <i class="pi pi-users text-white text-xl"></i>
        </div>

        <!-- Text Info -->
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-gray-800 mb-1">
            {{ groupInfo?.name || "Guruh nomi" }}
          </h1>
          <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <i class="pi pi-user text-blue-500"></i>
              <span>O'qituvchi: {{ teacherName }}</span>
            </div>
            <div class="flex items-center gap-2">
              <i class="pi pi-calendar text-green-500"></i>
              <span>Jami darslar: {{ totalLessons }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </template>
</Card>

</template>

<script setup>
import Card from "primevue/card";
import Button from "primevue/button";
import { computed } from "vue";

const props = defineProps({
  groupInfo: Object,
  totalLessons: Number,
});

const teacherName = computed(() => {
  if (!props.groupInfo?.teacher) return "-";
  return `${props.groupInfo.teacher.name} ${props.groupInfo.teacher.lastname}`;
});
</script>
