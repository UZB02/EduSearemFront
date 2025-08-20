<template>
  <Dialog
    :visible="visible"
    :modal="true"
    :closable="false"
    :draggable="false"
    :style="{ width: '450px' }"
    :breakpoints="{ '1199px': '90vw', '575px': '95vw' }"
  >
    <template #header>
      <div class="flex items-center">
        <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
          <i class="pi pi-exclamation-triangle text-red-600 text-xl"></i>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-800 m-0">O'quvchini o'chirish</h3>
          <p class="text-sm text-gray-500 m-0 mt-1">Bu amalni qaytarib bo'lmaydi</p>
        </div>
      </div>
    </template>

    <div class="py-4">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-start">
          <i class="pi pi-info-circle text-red-500 mt-1 mr-3"></i>
          <div>
            <p class="text-red-800 font-medium mb-1">
              Haqiqatan ham {{ student.name }} {{ student.lastname }} ni o'chirmoqchimisiz?
            </p>
            <p class="text-red-600 text-sm">
              O'quvchiga tegishli barcha ma'lumotlar ham o'chiriladi.
            </p>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <Button
          label="Bekor qilish"
          icon="pi pi-times"
          severity="secondary"
          @click="$emit('cancel')"
        />
        <Button
          :label="loading ? 'O\'chirilmoqda...' : 'Ha, o\'chirish'"
          icon="pi pi-trash"
          severity="danger"
          :loading="loading"
          @click="$emit('confirm')"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

defineProps({
  visible: Boolean,
  student: Object,
  loading: Boolean
})

defineEmits(['cancel', 'confirm'])
</script>