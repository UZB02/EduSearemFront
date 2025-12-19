<template>
  <div>
    <form @submit.prevent="submitForm" class="space-y-6">

      <!-- Guruh nomi -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          Guruh nomi *
        </label>
        <InputText
          v-model="form.groupName"
          placeholder="Guruh nomini kiriting"
          class="w-full"
          :class="{ 'p-invalid': errors.groupName }"
        />
        <small v-if="errors.groupName" class="text-red-500">
          {{ errors.groupName }}
        </small>
      </div>

      <!-- O‘qituvchilar -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          O‘qituvchilar *
        </label>
        <MultiSelect
          v-model="form.teachers"
          :options="teachers"
          optionLabel="name"
          optionValue="_id"
          placeholder="O‘qituvchilarni tanlang"
          display="chip"
          class="w-full"
          :class="{ 'p-invalid': errors.teachers }"
        />
        <small v-if="errors.teachers" class="text-red-500">
          {{ errors.teachers }}
        </small>
      </div>

      <!-- Oylik to‘lov -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          Oylik to‘lov *
        </label>
        <InputNumber
          v-model="form.monthlyFee"
          class="w-full"
          placeholder="Oylik to‘lov"
          :class="{ 'p-invalid': errors.monthlyFee }"
        />
        <small v-if="errors.monthlyFee" class="text-red-500">
          {{ errors.monthlyFee }}
        </small>
      </div>

      <!-- Dars vaqti -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Boshlanish vaqti *
          </label>
          <Calendar v-model="form.startTime" timeOnly class="w-full" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Tugash vaqti *
          </label>
          <Calendar v-model="form.endTime" timeOnly class="w-full" />
        </div>
      </div>

      <!-- Dars kunlari -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          Dars kunlari *
        </label>
        <Dropdown
          v-model="form.daysType"
          :options="daysTypeOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Kun turini tanlang"
          class="w-full"
        />
      </div>

      <!-- Maxsus kunlar -->
      <div v-if="form.daysType === 'custom'" class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          Kunlarni tanlang
        </label>
        <div class="grid grid-cols-2 gap-2">
          <label
            v-for="day in weekDays"
            :key="day.value"
            class="flex items-center gap-2"
          >
            <input
              type="checkbox"
              :value="day.value"
              v-model="form.daysOfWeek"
            />
            {{ day.label }}
          </label>
        </div>
      </div>

      <!-- Tavsif -->
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">
          Guruh haqida ma’lumot
        </label>
        <Textarea
          v-model="form.description"
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
          label="Guruh qo‘shish"
          class="flex-1"
          :loading="loading"
        />
      </div>

    </form>
  </div>
</template>

<script setup>
import { ref, reactive, defineEmits } from "vue"
import InputText from "primevue/inputtext"
import InputNumber from "primevue/inputnumber"
import Dropdown from "primevue/dropdown"
import MultiSelect from "primevue/multiselect"
import Textarea from "primevue/textarea"
import Button from "primevue/button"
import Calendar from "primevue/calendar"
import api from "@/utils/api.js"

const admin = JSON.parse(sessionStorage.getItem("admin"))

const emit = defineEmits(["getAllGroups", "closeDrawer"])

const loading = ref(false)
const teachers = ref([])

const form = reactive({
  groupName: "",
  teachers: [],
  monthlyFee: null,
  description: "",
  admin: admin.id,
  daysType: "",
  daysOfWeek: [],
  startTime: null,
  endTime: null
})

const errors = reactive({
  groupName: "",
  teachers: "",
  monthlyFee: ""
})

const daysTypeOptions = [
  { label: "Toq kunlar (Du/Chor/Juma)", value: "toq" },
  { label: "Juft kunlar (Sesh/Pay/Shan)", value: "juft" },
  { label: "Maxsus kunlar", value: "custom" }
]

const weekDays = [
  { label: "Dushanba", value: "Dushanba" },
  { label: "Seshanba", value: "Seshanba" },
  { label: "Chorshanba", value: "Chorshanba" },
  { label: "Payshanba", value: "Payshanba" },
  { label: "Juma", value: "Juma" },
  { label: "Shanba", value: "Shanba" },
  { label: "Yakshanba", value: "Yakshanba" }
]

const validateForm = () => {
  errors.groupName = ""
  errors.teachers = ""
  errors.monthlyFee = ""

  let valid = true

  if (!form.groupName.trim()) {
    errors.groupName = "Guruh nomi majburiy"
    valid = false
  }

  if (!form.teachers.length) {
    errors.teachers = "Kamida bitta o‘qituvchi tanlang"
    valid = false
  }

  if (!form.monthlyFee) {
    errors.monthlyFee = "Oylik to‘lov majburiy"
    valid = false
  }

  if (!form.daysType) {
    alert("Dars kunlarini tanlang")
    valid = false
  }

  if (form.daysType === "custom" && !form.daysOfWeek.length) {
    alert("Kamida bitta kun tanlang")
    valid = false
  }

  if (!form.startTime || !form.endTime) {
    alert("Dars vaqtlarini tanlang")
    valid = false
  }

  return valid
}

const formatTime = (date) =>
  date?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

const submitForm = async () => {
  if (!validateForm()) return
  loading.value = true

  let days = []
  if (form.daysType === "toq") {
    days = ["Dushanba", "Chorshanba", "Juma"]
  } else if (form.daysType === "juft") {
    days = ["Seshanba", "Payshanba", "Shanba"]
  } else {
    days = form.daysOfWeek
  }

  try {
    await api.post("/groups", {
      name: form.groupName,
      description: form.description,
      monthlyFee: form.monthlyFee,
      adminId: form.admin,
      teachers: form.teachers,
      scheduleType: form.daysType,
      days,
      startTime: formatTime(form.startTime),
      endTime: formatTime(form.endTime)
    })

    emit("getAllGroups")
    emit("closeDrawer")
    resetForm()
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  Object.assign(form, {
    groupName: "",
    teachers: [],
    monthlyFee: null,
    description: "",
    daysType: "",
    daysOfWeek: [],
    startTime: null,
    endTime: null
  })
}

const getAllTeachers = async () => {
  const res = await api.get(`/teachers?userId=${admin.id}`)
  teachers.value = res.data
}

getAllTeachers()
</script>
