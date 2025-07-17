<template>
    <div class="">
      <div class="">
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Guruh nomi -->
          <div class="space-y-2">
            <label for="guruhNomi" class="block text-sm font-medium text-gray-700">
              Guruh nomi *
            </label>
            <InputText
              id="guruhNomi"
              v-model="form.guruhNomi"
              placeholder="Guruh nomini kiriting"
              class="w-full"
              :class="{ 'p-invalid': errors.guruhNomi }"
            />
            <small v-if="errors.guruhNomi" class="text-red-500">
              {{ errors.guruhNomi }}
            </small>
          </div>

          <!-- O'qituvchi tanlash -->
          <div class="space-y-2">
            <label for="oqituvchi" class="block text-sm font-medium text-gray-700">
              O'qituvchi *
            </label>
            <Dropdown
              id="oqituvchi"
              v-model="form.oqituvchi"
              :options="oqituvchilar"
              optionLabel="ism"
              optionValue="id"
              placeholder="O'qituvchini tanlang"
              class="w-full"
              :class="{ 'p-invalid': errors.oqituvchi }"
            />
            <small v-if="errors.oqituvchi" class="text-red-500">
              {{ errors.oqituvchi }}
            </small>
          </div>

          <!-- Guruh haqida qo'shimcha ma'lumot -->
          <div class="space-y-2">
            <label for="tavsif" class="block text-sm font-medium text-gray-700">
              Guruh haqida ma'lumot
            </label>
            <Textarea
              id="tavsif"
              v-model="form.tavsif"
              placeholder="Guruh haqida qo'shimcha ma'lumot kiriting"
              rows="3"
              class="w-full"
            />
          </div>

          <!-- Tugmalar -->
          <div class="flex gap-3 pt-4">
            <Button
              type="button"
              label="Bekor qilish"
              severity="secondary"
              outlined
              class="flex-1"
              @click="resetForm"
            />
            <Button
              type="submit"
              label="Guruh qo'shish"
              :loading="loading"
              class="flex-1"
            />
          </div>
        </form>

        <!-- Muvaffaqiyat xabari -->
        <div v-if="showSuccess" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <p class="text-sm text-green-700">Guruh muvaffaqiyatli qo'shildi!</p>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'

// Form ma'lumotlari
const form = reactive({
  guruhNomi: '',
  oqituvchi: null,
  tavsif: ''
})

// Xatoliklar
const errors = reactive({
  guruhNomi: '',
  oqituvchi: ''
})

// Holat o'zgaruvchilari
const loading = ref(false)
const showSuccess = ref(false)

// O'qituvchilar ro'yxati
const oqituvchilar = ref([
  { id: 1, ism: 'Ahmadov Akmal Akramovich' },
  { id: 2, ism: 'Karimova Dilnoza Rustamovna' },
  { id: 3, ism: 'Toshmatov Bobur Olimovich' },
  { id: 4, ism: 'Nazarova Gulnoza Shavkatovna' },
  { id: 5, ism: 'Rahimov Jasur Abdullayevich' }
])

// Validatsiya funksiyasi
const validateForm = () => {
  let isValid = true
  
  // Xatoliklarni tozalash
  errors.guruhNomi = ''
  errors.oqituvchi = ''
  
  // Guruh nomi tekshiruvi
  if (!form.guruhNomi.trim()) {
    errors.guruhNomi = 'Guruh nomi kiritilishi shart'
    isValid = false
  } else if (form.guruhNomi.trim().length < 2) {
    errors.guruhNomi = 'Guruh nomi kamida 2 ta belgidan iborat bo\'lishi kerak'
    isValid = false
  }
  
  // O'qituvchi tekshiruvi
  if (!form.oqituvchi) {
    errors.oqituvchi = 'O\'qituvchi tanlanishi shart'
    isValid = false
  }
  
  return isValid
}

// Formani yuborish
const submitForm = async () => {
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  
  try {
    // Bu yerda API ga so'rov yuboriladi
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulyatsiya
    
    console.log('Yangi guruh:', {
      guruhNomi: form.guruhNomi,
      oqituvchi: form.oqituvchi,
      tavsif: form.tavsif
    })
    
    // Muvaffaqiyat xabarini ko'rsatish
    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)
    
    // Formani tozalash
    resetForm()
    
  } catch (error) {
    console.error('Xatolik:', error)
  } finally {
    loading.value = false
  }
}

// Formani tozalash
const resetForm = () => {
  form.guruhNomi = ''
  form.oqituvchi = null
  form.tavsif = ''
  errors.guruhNomi = ''
  errors.oqituvchi = ''
}
</script>

<style scoped>
/* PrimeVue komponentlari uchun qo'shimcha stillar */

</style>