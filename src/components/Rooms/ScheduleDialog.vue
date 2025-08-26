<template>
  <Dialog v-model:visible="visible" modal class="w-[600px]">
    <template #header>
      <div class="flex items-center gap-3">
        <i class="pi pi-info-circle text-xl"></i>
        <span class="text-lg font-semibold">Guruh ma'lumotlari</span>
      </div>
    </template>

    <div v-if="schedule" class="p-6">
      <!-- Status Badge -->
      <div class="flex justify-between items-start mb-6">
        <div class="flex items-center gap-3">
          <div :class="['w-4 h-4 rounded-full', schedule.isActive ? 'bg-emerald-500' : 'bg-red-500']"></div>
          <h3 class="text-xl font-bold text-gray-800">{{ schedule.groupId.name }}</h3>
        </div>
        <span :class="['px-3 py-1 rounded-full text-sm font-medium', schedule.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700']">
          {{ schedule.isActive ? 'Aktiv' : 'Arxiv' }}
        </span>
      </div>

      <!-- Info Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="bg-gray-50 rounded-xl p-4 space-y-3">
          <div class="flex items-center gap-2 text-gray-700">
            <i class="pi pi-bookmark text-indigo-600"></i>
            <span class="font-medium">Ta'rif:</span>
          </div>
          <p class="text-gray-600 text-sm">{{ schedule.groupId.description }}</p>
        </div>

        <div class="bg-gray-50 rounded-xl p-4 space-y-3">
          <div class="flex items-center gap-2 text-gray-700">
            <i class="pi pi-user text-indigo-600"></i>
            <span class="font-medium">O'qituvchi:</span>
          </div>
          <p class="text-gray-800 font-medium">{{ schedule.groupId.teacher.name }} {{ schedule.groupId.teacher.lastname }}</p>
          <p class="text-gray-600 text-sm flex items-center gap-1">
            <i class="pi pi-phone text-xs"></i> {{ schedule.groupId.teacher.phone }}
          </p>
        </div>

        <div class="bg-gray-50 rounded-xl p-4 space-y-3">
          <div class="flex items-center gap-2 text-gray-700">
            <i class="pi pi-calendar text-indigo-600"></i>
            <span class="font-medium">Dars vaqti:</span>
          </div>
          <p class="text-gray-800 font-medium">{{ schedule.groupId.startTime }} - {{ schedule.groupId.endTime }}</p>
          <p class="text-gray-600 text-sm">{{ schedule.groupId.days?.join(", ") }}</p>
        </div>

        <div class="bg-gray-50 rounded-xl p-4 space-y-3">
          <div class="flex items-center gap-2 text-gray-700">
            <i class="pi pi-home text-indigo-600"></i>
            <span class="font-medium">Xona:</span>
          </div>
          <p class="text-gray-800 font-medium">{{ schedule.roomId.name }}</p>
          <p class="text-gray-600 text-sm">{{ schedule.roomId.capacity }} o'rin</p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-between items-center pt-4 border-t border-gray-200">
        <Button label="Xonadan olib tashlash" severity="danger" icon="pi pi-trash"
                class="px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                @click="$emit('remove', schedule)" />
        <Button label="Yopish" severity="secondary" icon="pi pi-times"
                class="px-6 py-3" @click="visible = false" />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";

const props = defineProps({
  schedule: Object,
  visible: Boolean
});

const emit = defineEmits(["update:visible", "remove"]);

const visible = ref(props.visible);
watch(() => props.visible, (val) => visible.value = val);
watch(visible, (val) => emit("update:visible", val));
</script>
