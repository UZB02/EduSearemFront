<template>
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

      <!-- O'qituvchi -->
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

      <!-- 📌 Dars jadvali turi (toq, juft yoki custom) -->
      <div class="space-y-2">
        <label for="scheduleType" class="block text-sm font-medium text-gray-700">
          Dars jadvali *
        </label>
        <Dropdown
          id="scheduleType"
          v-model="form.scheduleType"
          :options="scheduleTypes"
          optionLabel="label"
          optionValue="value"
          placeholder="Dars jadvalini tanlang"
          class="w-full"
          :class="{ 'p-invalid': errors.scheduleType }"
        />
        <small v-if="errors.scheduleType" class="text-red-500">
          {{ errors.scheduleType }}
        </small>
      </div>

      <!-- 📌 Agar "custom" bo'lsa, kunlarni tanlash -->
      <div v-if="form.scheduleType === 'custom'" class="space-y-2">
        <label for="days" class="block text-sm font-medium text-gray-700">
          Dars kunlari *
        </label>
        <MultiSelect
          id="days"
          v-model="form.days"
          :options="daysOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Kunlarni tanlang"
          class="w-full"
        />
      </div>

      <!-- Qo'shimcha ma'lumot -->
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
          @click="emit('closeDrawer')"
        />
        <Button
          type="submit"
          label="Saqlash"
          :loading="loading"
          class="flex-1"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits, watch, onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import MultiSelect from 'primevue/multiselect'
import axios from "axios"

// Props va emitlar
const props = defineProps({
  changegroup: Object
})
const emit = defineEmits(['refreshFunctions', 'closeDrawer'])

// Admin ma'lumotlari
const admin = JSON.parse(sessionStorage.getItem('admin'))

// Form
const form = reactive({
  groupName: '',
  teacher: null,
  monthlyFee: 0,
  description: '',
  scheduleType: 'custom',
  days: [],
  admin: admin.id
})

// Xatoliklar
const errors = reactive({
  groupName: '',
  teacher: '',
  monthlyFee: '',
  scheduleType: ''
})

const loading = ref(false)
const teachers = ref([])
const isEditMode = ref(false)

// 📌 Jadval turlari
const scheduleTypes = [
  { label: 'Toq kunlar', value: 'toq' },
  { label: 'Juft kunlar', value: 'juft' },
  { label: 'Mahsus kunlar', value: 'custom' }
]

// 📌 Kunlar ro‘yxati
const daysOptions = [
  { label: "Dushanba", value: "Dushanba" },
  { label: "Seshanba", value: "Seshanba" },
  { label: "Chorshanba", value: "Chorshanba" },
  { label: "Payshanba", value: "Payshanba" },
  { label: "Juma", value: "Juma" },
  { label: "Shanba", value: "Shanba" },
  { label: "Yakshanba", value: "Yakshanba" }
]

// O'qituvchilarni olish
const getAllTeachers = async () => {
  try {
    const res = await axios.get(`/teachers?userId=${admin.id}`)
    teachers.value = res.data
  } catch (err) {
    console.error(err)
  }
}

// Validatsiya
const validateForm = () => {
  let isValid = true
  errors.groupName = ''
  errors.teacher = ''
  errors.monthlyFee = ''
  errors.scheduleType = ''

  if (!form.groupName.trim()) {
    errors.groupName = 'Guruh nomi kiritilishi shart'
    isValid = false
  }
  if (!form.teacher) {
    errors.teacher = 'O\'qituvchi tanlanishi shart'
    isValid = false
  }
  if (!form.monthlyFee) {
    errors.monthlyFee = 'Kurs to\'lovi kiritilishi shart'
    isValid = false
  }
  if (!form.scheduleType) {
    errors.scheduleType = 'Dars jadvali tanlanishi shart'
    isValid = false
  }
  if (form.scheduleType === 'custom' && form.days.length === 0) {
    errors.scheduleType = 'Custom bo‘lsa, kunlar tanlanishi kerak'
    isValid = false
  }

  return isValid
}

// Form yuborish
const submitForm = async () => {
  if (!validateForm()) return
  loading.value = true

  try {
    const payload = {
      name: form.groupName,
      description: form.description,
      monthlyFee: form.monthlyFee,
      teacher: form.teacher,
      scheduleType: form.scheduleType,
      days: form.scheduleType === 'custom' ? form.days : [],
      adminId: form.admin
    }

    if (isEditMode.value && props.changegroup && props.changegroup._id) {
      // Tahrirlash
      await axios.put(`/groups/${props.changegroup._id}`, payload)
    } else {
      // Qo‘shish
      await axios.post('/groups', payload)
    }

    emit('refreshFunctions')
    emit('closeDrawer')
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Guruhni tahrirlash uchun formani to‘ldirish
watch(
  () => props.changegroup,
  (newVal) => {
    if (newVal && newVal._id) {
      isEditMode.value = true
      form.groupName = newVal.name || ''
      form.monthlyFee = newVal.monthlyFee || 0
      form.teacher = newVal.teacher?._id || null
      form.description = newVal.description || ''
      form.scheduleType = newVal.scheduleType || 'custom'
      form.days = newVal.days || []
    } else {
      isEditMode.value = false
      form.groupName = ''
      form.monthlyFee = 0
      form.teacher = null
      form.description = ''
      form.scheduleType = 'custom'
      form.days = []
    }
  },
  { immediate: true }
)

onMounted(() => {
  getAllTeachers()
})
</script>
