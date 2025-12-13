<template>
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
    <div>
      <h1 class="text-3xl font-bold text-gray-800 mb-2">{{ group.name || 'Loading...' }}</h1>
      <p class="text-gray-600">
        {{
          group.teacher
            ? group.teacher.name + ' ' + group.teacher.lastname
            : 'O‘qituvchi maʼlumoti yo‘q'
        }}
      </p>
    </div>

    <!-- Yangi student qo‘shish -->
    <div class="flex items-center gap-2 bg-white rounded-lg shadow-sm p-3">
      <button
        class="bg-gradient-to-r cursor-pointer from-blue-500 to-blue-600 text-white rounded-md px-4 py-2 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        @click="router.push(`/group/${group._id}/attendance`)"
      >
        <i class="pi pi-address-book"></i>
        Davomat
      </button>
            <button
        class="bg-gradient-to-r cursor-pointer from-purple-500 to-purple-600 text-white rounded-md px-4 py-2 hover:from-purple-600 hover:to-purple-700 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        @click="router.push(`/group/${group._id}/statistics`)"
      >
        <i class="pi pi-chart-bar"></i>
        Statistika
      </button>
      <button
        class="bg-gradient-to-r cursor-pointer from-green-500 to-green-600 text-white rounded-md px-4 py-2 hover:from-green-600 hover:to-green-700 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        @click="addStudentmodalvisible = true"
      >
        <i class="pi pi-plus"></i>
      </button>
    </div>
  </div>
  <div>
    <StudentsTable :group="group" @getGroupById="getGroupById"></StudentsTable>
  </div>

  <!-- Begin AddStudent Modal -->
  <Dialog
    v-model:visible="addStudentmodalvisible"
    :modal="true"
    :closable="true"
    :draggable="false"
    class="custom-dialog"
    :style="{ width: '600px' }"
    :breakpoints="{ '1199px': '90vw', '575px': '95vw' }"
  >
    <!-- Custom Header -->
    <template #header>
      <div class="flex items-center gap-3 w-full">
        <div
          class="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center"
        >
          <i class="pi pi-user-plus w-5 h-5 text-white"></i>
        </div>
        <div>
          <h2 class="text-xl font-semibold text-gray-800 m-0">Yangi o'quvchi qo'shish</h2>
          <p class="text-sm text-gray-500 m-0">O'quvchi ma'lumotlarini kiriting</p>
        </div>
      </div>
    </template>

    <!-- Form Content -->
    <div class="space-y-6 p-1">
      <!-- Shaxsiy ma'lumotlar bo'limi -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <i class="pi pi-user w-5 h-5 text-blue-500"></i>
          Shaxsiy ma'lumotlar
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-1">
              Ism <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="newStudent.name"
              placeholder="Ismingizni kiriting"
              class="w-full"
              :class="{ 'p-invalid': !newStudent.name && showValidation }"
            />
            <small v-if="!newStudent.name && showValidation" class="text-red-500">
              Ism kiritish majburiy
            </small>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700 flex items-center gap-1">
              Familiya <span class="text-red-500">*</span>
            </label>
            <InputText
              v-model="newStudent.lastname"
              placeholder="Familiyangizni kiriting"
              class="w-full"
              :class="{ 'p-invalid': !newStudent.lastname && showValidation }"
            />
            <small v-if="!newStudent.lastname && showValidation" class="text-red-500">
              Familiya kiritish majburiy
            </small>
          </div>
        </div>
      </div>

      <!-- Aloqa ma'lumotlari bo'limi -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <i class="pi pi-phone w-5 h-5 text-green-500"></i>
          Aloqa ma'lumotlari
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Telefon raqami</label>
            <InputText v-model="newStudent.phone" placeholder="+998 90 123 45 67" class="w-full" />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Ota-Ona telefon raqami</label>
            <InputText v-model="newStudent.parentPhone" placeholder="+998 90 123 45 67" class="w-full" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Manzil</label>
            <InputText v-model="newStudent.location" placeholder="Yashash manzili" class="w-full" />
          </div>
        </div>
      </div>
      <!-- Qo'shimcha ma'lumotlar bo'limi -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
          <i class="pi pi-clipboard w-5 h-5 text-orange-500"></i>
          Qo'shimcha ma'lumotlar
        </h3>

        <div class="space-y-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-medium text-gray-700">Izoh</label>
            <Textarea
              v-model="newStudent.description"
              placeholder="Qo'shimcha ma'lumotlar yoki izohlar..."
              class="w-full"
              rows="3"
              autoResize
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Custom Footer -->
    <template #footer>
      <div class="flex justify-between items-center w-full pt-4 border-t border-gray-200">
        <div class="text-sm text-gray-500">
          <span class="text-red-500">*</span> Majburiy maydonlar
        </div>
        <div class="flex gap-3">
          <Button
            label="Bekor qilish"
            icon="pi pi-times"
            severity="secondary"
            @click="addStudentmodalvisible = false"
            class="px-4 py-2"
          />
          <Button
            label="Saqlash"
            icon="pi pi-check"
            @click="addStudent()"
            :loading="isLoading"
            class="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 border-blue-500 hover:from-blue-600 hover:to-blue-700"
          />
        </div>
      </div>
    </template>
  </Dialog>
  <!-- End AddStudent Modal -->
   <!-- Guruhga xabar yuborish -->
  <Dialog
    v-model:visible="visible"
    modal
    header="Guruhga xabar yuborish"
    class="w-full max-w-lg"
  >
  <div class="p-2 bg-orange-500/20 rounded">
    <span class="text-orange-600">Buyerda yoziladigan xabar guruhdagi barcha o'quvchilarga yuboriladi!</span>
  </div>
    <div class="flex flex-col gap-4">
      <Textarea
        v-model="form.message"
        rows="5"
        placeholder="Xabar matnini kiriting..."
        class="w-full"
      />

      <Button
        label="Xabar yuborish"
        icon="pi pi-send"
        :loading="loading"
        class="w-full"
        @click="groupSendMessage"
      />
    </div>
  </Dialog>
<div class="fixed right-4 bottom-4 z-50">
  <button
    class="relative p-4 bg-green-500 cursor-pointer text-white rounded-full shadow-lg hover:bg-green-600 
           focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 
           animate-bounce-slow"
    title="Xabar yuborish"
    @click="visible=!visible"
  >
    <i class="pi pi-envelope text-xl"></i>

    <span
      class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-ping"
    ></span>
  </button>
</div>


   <Toast />
</template>

<script setup>
import { ref, watch } from 'vue'
import api from "../../utils/api.js";
import { useRoute, useRouter } from 'vue-router'
import StudentsTable from '../../components/Students/MainStudentsList.vue'
import Dialog from 'primevue/dialog'
import { useToast } from 'primevue/usetoast'
import Toast from 'primevue/toast'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'

const toast = useToast()
const route = useRoute()
const router = useRouter()

const groupId = ref(route.params.slug)
const admin = JSON.parse(sessionStorage.getItem('admin'))

const isLoading = ref(false)
const group = ref({})
const addStudentmodalvisible = ref(false)
const showValidation = ref(false)

// 🔹 State
const visible = ref(false);
const loading = ref(false);

const form = ref({
  message: "",
});

// Initial newStudent object without groupId
const newStudent = ref({
  name: 'Alisher',
  lastname: 'Sobirov',
  phone: '+998917622603',
  parentPhone: '+998917622603',
  location: 'Namangan',
  groupId: null, // groupId key nil
  status: 'active',
  description: 'Sertefikat olmoqchi',
  admin: admin?.id || null,
})

// Fetch group data
const getGroupById = async () => {
  try {
    const res = await api.get(`/groups/${groupId.value}`, {
      params: { adminId: admin.id }
    })
    group.value = res.data

    // Set groupId in newStudent once group is fetched
    newStudent.value.groupId = group.value._id
  } catch (err) {
    console.error('Xatolik:', err)
    toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Guruh maʼlumotlari olinmadi', life: 3000 })
  }
}
getGroupById()

// Add student
const addStudent = async () => {
  showValidation.value = true

  if (!newStudent.value.name || !newStudent.value.lastname || !newStudent.value.parentPhone || !newStudent.value.groupId) {
    toast.add({ severity: 'warn', summary: 'Ogohlantirish', detail: 'Majburiy maydonlarni to‘ldiring', life: 3000 })
    return
  }

  isLoading.value = true
  try {
    const res = await api.post('/students', { ...newStudent.value })
    toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: "O'quvchi qo‘shildi", life: 3000 })
    addStudentmodalvisible.value = false
    refreshForm()
    getGroupById()
  } catch (error) {
    console.error(error)
    toast.add({ severity: 'error', summary: 'Xatolik', detail: "O'quvchi qo‘shilmadi", life: 3000 })
  } finally {
    isLoading.value = false
  }
}

// Reset form
const refreshForm = () => {
  newStudent.value.name = ''
  newStudent.value.lastname = ''
  newStudent.value.phone = ''
  newStudent.value.parentPhone = ''
  newStudent.value.location = ''
  newStudent.value.description = ''
  showValidation.value = false
}

// 🔹 Guruhga xabar yuborish
const groupSendMessage = async () => {
  if (!form.value.message) {
    return     toast.add({ severity: 'danger', summary: 'Muvaffaqiyatli', detail: "Xabar matnini kiriting", life: 3000 });
  }

  if (!groupId) {
    return   toast.add({ severity: 'danger', summary: 'Muvaffaqiyatli', detail: "groupId URL'dan topilmadi", life: 3000 });
  }

  try {
    loading.value = true;
    console.log(groupId);
    await api.post("students/send-group-message", {
      groupId:groupId.value,
      message: form.value.message,
    });
toast.add({ severity: 'success', summary: 'Muvaffaqiyatli', detail: "Xabar yuborildi ✅", life: 3000 })

    form.value.message = "";
    visible.value = false;
  } catch (error) {
    alert(error.response?.data?.error || "Xatolik yuz berdi");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
.animate-bounce-slow {
  animation: bounce-slow 2s infinite;
}

</style>