<script setup>
import { ref, reactive, defineEmits, watch, onMounted } from 'vue'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import MultiSelect from 'primevue/multiselect'
import Calendar from 'primevue/calendar'
import api from "@/utils/api.js";

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
  scheduleType: '',
  days: [],
  startTime: null,
  endTime: null,
  admin: admin.id
})

// Xatoliklar
const errors = reactive({
  groupName: '',
  teacher: '',
  monthlyFee: '',
  scheduleType: '',
  startTime: '',
  endTime: ''
})

const loading = ref(false)
const teachers = ref([])
const isEditMode = ref(false)

// 📌 Jadval turlari
const scheduleTypes = [
  { label: 'Toq kunlar (Du/Chor/Juma)', value: 'toq' },
  { label: 'Juft kunlar (Se/Pay/Shan)', value: 'juft' },
  { label: 'Maxsus kunlar', value: 'custom' }
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
    const res = await api.get(`/teachers?userId=${admin.id}`)
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
  errors.startTime = ''
  errors.endTime = ''

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
  if (!form.startTime) {
    errors.startTime = 'Boshlanish vaqti tanlanishi shart'
    isValid = false
  }
  if (!form.endTime) {
    errors.endTime = 'Tugash vaqti tanlanishi shart'
    isValid = false
  }

  return isValid
}

// 📌 Form yuborish
const submitForm = async () => {
  if (!validateForm()) return
  loading.value = true

  // Jadval turiga qarab kunlarni aniqlash
  let selectedDays = []
  if (form.scheduleType === 'toq') {
    selectedDays = ["Dushanba", "Chorshanba", "Juma"]
  } else if (form.scheduleType === 'juft') {
    selectedDays = ["Seshanba", "Payshanba", "Shanba"]
  } else {
    selectedDays = form.days
  }

  const payload = {
    name: form.groupName,
    description: form.description,
    monthlyFee: form.monthlyFee,
    teacher: form.teacher,
    scheduleType: form.scheduleType,
    days: selectedDays,
    startTime: form.startTime ? form.startTime.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}) : null,
    endTime: form.endTime ? form.endTime.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}) : null,
    adminId: form.admin
  }

  try {
    if (isEditMode.value && props.changegroup?._id) {
      await api.put(`/groups/${props.changegroup._id}`, payload)
    } else {
      await api.post('/groups', payload)
    }

    emit('refreshFunctions')
    emit('closeDrawer')
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// 📌 Guruhni tahrirlash uchun formani to‘ldirish
watch(
  () => props.changegroup,
  (newVal) => {
    if (newVal && newVal._id) {
      isEditMode.value = true
      form.groupName = newVal.name || ''
      form.monthlyFee = newVal.monthlyFee || 0
      form.teacher = newVal.teacher?._id || null
      form.description = newVal.description || ''
      form.scheduleType = newVal.scheduleType || ''
      form.days = newVal.days || []
      form.startTime = newVal.startTime ? new Date(`1970-01-01T${newVal.startTime}`) : null
      form.endTime = newVal.endTime ? new Date(`1970-01-01T${newVal.endTime}`) : null
    } else {
      isEditMode.value = false
      form.groupName = ''
      form.monthlyFee = 0
      form.teacher = null
      form.description = ''
      form.scheduleType = ''
      form.days = []
      form.startTime = null
      form.endTime = null
    }
  },
  { immediate: true }
)

onMounted(() => {
  getAllTeachers()
})
</script>

<template>
  <div>
    <form @submit.prevent="submitForm" class="space-y-6">
      <!-- Guruh nomi -->
      <div class="space-y-2">
        <label>Guruh nomi *</label>
        <InputText v-model="form.groupName" class="w-full" />
        <small v-if="errors.groupName" class="text-red-500">{{ errors.groupName }}</small>
      </div>

      <!-- O'qituvchi -->
      <div class="space-y-2">
        <label>O'qituvchi *</label>
        <Dropdown v-model="form.teacher" :options="teachers" optionLabel="name" optionValue="_id" class="w-full" />
        <small v-if="errors.teacher" class="text-red-500">{{ errors.teacher }}</small>
      </div>

      <!-- Oylik to'lov -->
      <div class="space-y-2">
        <label>Oylik to'lov *</label>
        <InputNumber v-model="form.monthlyFee" class="w-full" />
        <small v-if="errors.monthlyFee" class="text-red-500">{{ errors.monthlyFee }}</small>
      </div>

      <!-- Jadval turi -->
      <div class="space-y-2">
        <label>Dars jadvali *</label>
        <Dropdown v-model="form.scheduleType" :options="scheduleTypes" optionLabel="label" optionValue="value" class="w-full" />
        <small v-if="errors.scheduleType" class="text-red-500">{{ errors.scheduleType }}</small>
      </div>

      <!-- Custom kunlar -->
      <div v-if="form.scheduleType === 'custom'" class="space-y-2">
        <label>Dars kunlari *</label>
        <MultiSelect v-model="form.days" :options="daysOptions" optionLabel="label" optionValue="value" class="w-full" />
      </div>

      <!-- Dars boshlanish va tugash vaqti -->
      <div class="grid grid-cols-1">
        <div class="">
          <label>Boshlanish vaqti *</label>
          <Calendar v-model="form.startTime" timeOnly class="w-full" />
          <small v-if="errors.startTime" class="text-red-500">{{ errors.startTime }}</small>
        </div>
        <div class="">
          <label>Tugash vaqti *</label>
          <Calendar v-model="form.endTime" timeOnly class="w-full" />
          <small v-if="errors.endTime" class="text-red-500">{{ errors.endTime }}</small>
        </div>
      </div>

      <!-- Izoh -->
      <div class="space-y-2">
        <label>Guruh haqida</label>
        <Textarea v-model="form.description" rows="3" class="w-full" />
      </div>

      <!-- Tugmalar -->
      <div class="flex gap-3 pt-4">
        <Button type="button" label="Bekor qilish" severity="secondary" outlined class="flex-1" @click="emit('closeDrawer')" />
        <Button type="submit" label="Saqlash" :loading="loading" class="flex-1" />
      </div>
    </form>
  </div>
</template>
