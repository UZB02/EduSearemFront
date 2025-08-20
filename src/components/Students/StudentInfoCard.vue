<template>
  <div class="bg-white rounded-2xl overflow-hidden mb-8">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
      <div class="flex items-center space-x-4">
        <div class="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
          <i class="pi pi-user text-4xl text-white"></i>
        </div>
        <div>
          <h1 class="text-3xl font-bold text-white">
            {{ student.name }} {{ student.lastname }}
          </h1>
          <p class="text-indigo-100 mt-1">O'quvchi profili</p>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="md:p-8 p-4">
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Contact Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <i class="pi pi-phone text-indigo-600 mr-2"></i>
              Aloqa ma'lumotlari
            </h3>

            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <i class="pi pi-phone text-green-600"></i>
                </div>
                <div class="flex flex-col">
                  <div>
                    <p class="text-sm text-gray-500">Telefon raqami</p>
                    <a
                      :href="`tel:${student.phone}`"
                      class="text-lg font-medium text-green-600 hover:text-green-700 transition-colors"
                    >
                      {{ student.phone }}
                    </a>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">Ota-Ona telefon raqami</p>
                    <a
                      :href="`tel:${student.parentPhone}`"
                      class="text-lg font-medium text-green-600 hover:text-green-700 transition-colors"
                    >
                      {{ student.parentPhone }}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <i class="pi pi-map-marker text-blue-600"></i>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Manzil</p>
                  <p class="text-lg font-medium text-gray-800">{{ student.location }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Additional Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <i class="pi pi-info-circle text-indigo-600 mr-2"></i>
              Qo'shimcha ma'lumotlar
            </h3>

            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center"
                >
                  <i class="pi pi-calendar text-purple-600"></i>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Qo'shilgan sana</p>
                  <p class="text-lg font-medium text-gray-800">
                    {{ formatDate(student.createdAt) }}
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-start space-x-3">
                <div
                  class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mt-1"
                >
                  <i class="pi pi-file-edit text-orange-600"></i>
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-500">Izoh</p>
                  <p class="text-lg font-medium text-gray-800 mt-1">
                    {{ student.description || 'Hech qanday izoh qoldirilmagan' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Status Card -->
        <PaymentStatusCard :student="student" @show-monthly="$emit('show-monthly')" />
      </div>
      
      <!-- Action Buttons -->
      <div class="mt-8 pt-6 border-t border-gray-200">
        <div class="flex flex-wrap gap-3">
          <button
            @click="$emit('edit', student)"
            class="inline-flex items-center cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <i class="pi pi-pencil mr-2"></i>
            Tahrirlash
          </button>

          <button
            @click="$emit('delete', student)"
            class="inline-flex items-center cursor-pointer px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <i class="pi pi-trash mr-2"></i>
            O'chirish
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PaymentStatusCard from './PaymentStatusCard.vue'

defineProps({
  student: Object
})

defineEmits(['edit', 'delete', 'show-monthly'])

const formatDate = (dateString) => {
  if (!dateString) return "Noma'lum"
  const date = new Date(dateString)
  return date.toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>