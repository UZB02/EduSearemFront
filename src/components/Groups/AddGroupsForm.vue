<template>
  <div>
    <div>
      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Guruh nomi -->
        <div class="space-y-2">
          <label for="groupName" class="block text-sm font-medium text-gray-700">
            Guruh nomi *
          </label>
          <InputText
            id="groupName"
            v-model="form.groupName"
            placeholder="Guruh nomini kiriting"
            class="w-full"
            :class="{ 'p-invalid': errors.groupName }"
          />
          <small v-if="errors.groupName" class="text-red-500">
            {{ errors.groupName }}
          </small>
        </div>

        <!-- O'qituvchi tanlash -->
        <div class="space-y-2">
          <label for="teacher" class="block text-sm font-medium text-gray-700">
            O'qituvchi *
          </label>
          <Dropdown
            id="teacher"
            v-model="form.teacher"
            :options="teachers"
            optionLabel="name"
            optionValue="_id"
            placeholder="O'qituvchini tanlang"
            class="w-full"
            :class="{ 'p-invalid': errors.teacher }"
          />
          <small v-if="errors.teacher" class="text-red-500">
            {{ errors.teacher }}
          </small>
        </div>

        <!-- Belgilangan oylik to'lovi -->
        <div class="space-y-2">
          <label for="monthlyFee" class="block text-sm font-medium text-gray-700">
            Oylik to'lov *
          </label>
          <InputNumber
            id="monthlyFee"
            v-model="form.monthlyFee"
            placeholder="Oylik to'lovni kiriting"
            class="w-full"
            :class="{ 'p-invalid': errors.monthlyFee }"
          />
          <small v-if="errors.monthlyFee" class="text-red-500">
            {{ errors.monthlyFee }}
          </small>
        </div>

        <!-- Dars kunlari turi -->
        <div class="space-y-2">
          <label for="daysType" class="block text-sm font-medium text-gray-700">
            Dars kunlari *
          </label>
          <Dropdown
            id="daysType"
            v-model="form.daysType"
            :options="daysTypeOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Kun turini tanlang"
            class="w-full"
          />
        </div>

        <!-- Aniq kunlarni tanlash -->
        <div v-if="form.daysType === 'custom'" class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Kunlarni tanlang
          </label>
          <div class="grid grid-cols-2 gap-2">
            <div v-for="day in weekDays" :key="day.value" class="flex items-center">
              <input
                type="checkbox"
                :value="day.value"
                v-model="form.daysOfWeek"
                class="mr-2"
              />
              <span>{{ day.label }}</span>
            </div>
          </div>
        </div>

        <!-- Guruh haqida qo'shimcha ma'lumot -->
        <div class="space-y-2">
          <label for="description" class="block text-sm font-medium text-gray-700">
            Guruh haqida ma'lumot
          </label>
          <Textarea
            id="description"
            v-model="form.description"
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
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits } from 'vue'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import axios from "axios"

const admin = JSON.parse(sessionStorage.getItem('admin'))

// Form ma'lumotlari
const form = reactive({
  groupName: '',
  teacher: null,
  monthlyFee: 0,
  description: '',
  admin: admin.id,
  daysType: '',        // "toq" | "juft" | "custom"
  daysOfWeek: []       // ['monday', 'wednesday']
})

const emit = defineEmits(['getAllGroups', 'closeDrawer'])

// Xatoliklar
const errors = reactive({
  groupName: '',
  teacher: '',
  monthlyFee: 0
})

const loading = ref(false)
const teachers = ref([])

// Dars kunlari variantlari
const daysTypeOptions = [
  { label: "Toq kunlar (Du/Chor/Juma)", value: "toq" },
  { label: "Juft kunlar (Sesh/Pay/Shan)", value: "juft" },
  { label: "Maxsus kunlar", value: "custom" }
]

// Haftaning kunlari
const weekDays = [
  { label: "Dushanba", value: "Dushanba" },
  { label: "Seshanba", value: "Seshanba" },
  { label: "Chorshanba", value: "Chorshanba" },
  { label: "Payshanba", value: "Payshanba" },
  { label: "Juma", value: "Juma" },
  { label: "Shanba", value: "Shanba" },
  { label: "Yakshanba", value: "Yakshanba" }
]

// Validatsiya
const validateForm = () => {
  let isValid = true
  errors.groupName = ''
  errors.teacher = ''
  errors.monthlyFee = ''

  if (!form.groupName.trim()) {
    errors.groupName = 'Guruh nomi kiritilishi shart'
    isValid = false
  } else if (form.groupName.trim().length < 2) {
    errors.groupName = 'Guruh nomi kamida 2 ta belgidan iborat bo‘lishi kerak'
    isValid = false
  }

  if (!form.teacher) {
    errors.teacher = 'O‘qituvchi tanlanishi shart'
    isValid = false
  }
  if (!form.monthlyFee) {
    errors.monthlyFee = 'Oylik to‘lov kiritilishi shart'
    isValid = false
  }

  if (!form.daysType) {
    alert("Dars kunlari turini tanlang")
    isValid = false
  }

  if (form.daysType === 'custom' && form.daysOfWeek.length === 0) {
    alert("Maxsus rejim uchun hech bo‘lmasa bitta kun tanlang")
    isValid = false
  }

  return isValid
}

// Form yuborish
const submitForm = async () => {
  if (!validateForm()) return
  loading.value = true

  // Dars kunlarini aniqlash
  let selectedDays = []
  if (form.daysType === "toq") {
    selectedDays = ["Dushanba", "Chorshanba", "Juma"]
  } else if (form.daysType === "juft") {
    selectedDays = ["Seshanba", "Payshanba", "Shanba"]
  } else if (form.daysType === "custom") {
    selectedDays = form.daysOfWeek
  }

  try {
    await axios.post('/groups', {
      name: form.groupName,
      description: form.description,
      monthlyFee: form.monthlyFee,
      adminId: form.admin,
      teacher: form.teacher,
      scheduleType: form.daysType,   // endi toq/juft/custom
      days: selectedDays
    })
    emit('getAllGroups')
    emit('closeDrawer')
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

// Formani tozalash
const resetForm = () => {
  form.groupName = ''
  form.teacher = null
  form.monthlyFee = 0
  form.description = ''
  form.daysType = ''
  form.daysOfWeek = []
}

const getAllTeachers = async () => {
  try {
    const res = await axios.get(`/teachers?userId=${admin.id}`)
    teachers.value = res.data
  } catch (err) {
    console.error(err)
  }
}
getAllTeachers()
</script>
