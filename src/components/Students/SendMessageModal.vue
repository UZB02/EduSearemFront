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
        <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
          <i class="pi pi-envelope text-blue-600 text-xl"></i>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-800 m-0">
            {{ student.name }} {{ student.lastname }} ga xabar yuborish
          </h3>
          <p class="text-sm text-gray-500 m-0 mt-1">Xabar matnini kiriting va yuboring</p>
        </div>
      </div>
    </template>

    <div class="py-4">
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start flex-col gap-2">
          <div class="flex items-center justify-center gap-1">
            <i class="pi pi-info-circle text-blue-500"></i>
            <label class="text-sm font-medium text-gray-700 block">
              Xabar matni <span class="text-red-500">*</span>
            </label>
          </div>
          <div class="flex-1 w-full">
            <Textarea
              v-model="message"
              placeholder="Yuboriladigan xabar..."
              class="w-full"
              rows="4"
              autoResize
              :class="{ 'p-invalid': !message && showValidation }"
            />
            <small v-if="!message && showValidation" class="text-red-500">
              Xabar matni majburiy
            </small>
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
          :label="loading ? 'Yuborilmoqda...' : 'Xabar yuborish'"
          icon="pi pi-send"
          class="bg-blue-500 border-blue-500 hover:bg-blue-600"
          :loading="loading"
          @click="handleSend"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'

const props = defineProps({
  visible: Boolean,
  student: Object,
  loading: Boolean
})

const emit = defineEmits(['cancel', 'send'])

const showValidation = ref(false)
const message = ref('')

const handleSend = () => {
  showValidation.value = true
  
  if (!message.value) {
    return
  }
  
  emit('send', message.value)
}
</script>