<template>
  <Dialog
    :visible="visible"
    :modal="true"
    :closable="true"
    :draggable="false"
    :style="{ width: '600px' }"
    :breakpoints="{ '1199px': '90vw', '575px': '95vw' }"
  >
    <template #header>
      <div class="flex items-center w-full">
        <div
          class="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-4"
        >
          <i class="pi pi-pencil text-white text-lg"></i>
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-800 m-0">O'quvchini tahrirlash</h2>
          <p class="text-sm text-gray-500 m-0 mt-1">Ma'lumotlarni yangilang</p>
        </div>
      </div>
    </template>

    <div class="space-y-6 py-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            <i class="pi pi-user mr-1"></i>
            Ism
          </label>
          <InputText v-model="student.name" class="w-full" placeholder="Ismni kiriting" />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            <i class="pi pi-user mr-1"></i>
            Familiya
          </label>
          <InputText
            v-model="student.lastname"
            class="w-full"
            placeholder="Familiyani kiriting"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            <i class="pi pi-phone mr-1"></i>
            Telefon raqami
          </label>
          <InputText
            v-model="student.phone"
            class="w-full"
            placeholder="+998 90 123 45 67"
          />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            <i class="pi pi-phone mr-1"></i>
            Ota-Ona Telefon raqami
          </label>
          <InputText
            v-model="student.parentPhone"
            class="w-full"
            placeholder="+998 90 123 45 67"
          />
        </div>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            <i class="pi pi-map-marker mr-1"></i>
            Manzil
          </label>
          <InputText
            v-model="student.location"
            class="w-full"
            placeholder="Yashash manzilini kiriting"
          />
        </div>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          <i class="pi pi-file-edit mr-1"></i>
          Izoh
        </label>
        <Textarea
          v-model="student.description"
          rows="3"
          class="w-full"
          autoResize
          placeholder="Qo'shimcha ma'lumotlar..."
        />
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
          label="Yangilash" 
          icon="pi pi-check" 
          :loading="loading" 
          @click="$emit('save', student)" 
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { watch,ref } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'

const props = defineProps({
  visible: Boolean,
  student: Object,
  loading: Boolean
})

const emit = defineEmits(['cancel', 'save'])

// Create a local copy to avoid directly mutating the prop
const localStudent = ref({ ...props.student })

// Update local copy when prop changes
watch(() => props.student, (newVal) => {
  localStudent.value = { ...newVal }
}, { deep: true })
</script>