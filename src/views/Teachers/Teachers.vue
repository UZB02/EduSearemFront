<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Toast va Confirm -->
    <Toast />
    <ConfirmDialog />

    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-slate-900 flex items-center">
              <i class="pi pi-users mr-3 text-blue-600"></i>
              O'qituvchilar boshqaruvi
            </h1>
            <p class="text-slate-600 mt-1">O'qituvchilarni qo'shish, tahrirlash va boshqarish</p>
          </div>
          <Button 
            label="Yangi o'qituvchi" 
            icon="pi pi-plus" 
            @click="showAddDialog = true"
            class="bg-blue-600 hover:bg-blue-700"
          />
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Card class="shadow-sm">
        <template #header>
          <div class="flex flex-col md:flex-row md:justify-between gap-4 p-6 pb-0">
            <h2 class="text-lg font-semibold text-slate-900">O'qituvchilar</h2>
            <div class="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <div class="relative w-full md:w-64">
                <i class="pi pi-search absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <InputText 
                  v-model="searchQuery"
                  placeholder="Qidirish..."
                  class="pl-10 w-full"
                />
              </div>
              <Button 
                icon="pi pi-refresh" 
                @click="fetchTeachers"
                :loading="loading"
                outlined
                class="w-full md:w-auto"
              />
            </div>
          </div>
        </template>

        <template #content>
          <DataTable 
            :value="filteredTeachers" 
            :loading="loading"
            paginator :rows="10" :rowsPerPageOptions="[5, 10, 20]"
            responsiveLayout="scroll"
            breakpoint="960px"
            :globalFilterFields="['name', 'lastname', 'science']"
          >
            <template #empty>
              <div class="text-center py-8">
                <i class="pi pi-users text-4xl text-slate-300 mb-4"></i>
                <p class="text-slate-500">O'qituvchilar topilmadi</p>
              </div>
            </template>

            <Column field="name" header="Ism" sortable style="min-width: 160px">
              <template #body="{ data }">
                <div class="flex items-center flex-wrap space-x-3">
                  <Avatar 
                    :label="getInitials(data.name, data.lastname)" 
                    class="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                    shape="circle"
                  />
                  <div>
                    <p class="font-medium text-slate-900">{{ data.name }} {{ data.lastname }}</p>
                    <p class="text-sm text-slate-500">{{ data.science }}</p>
                  </div>
                </div>
              </template>
            </Column>

            <Column field="science" header="Fan" sortable style="min-width: 120px">
              <template #body="{ data }">
                <Tag :value="data.science" severity="info" rounded />
              </template>
            </Column>

            <Column field="points" header="Ball" sortable style="min-width: 100px">
              <template #body="{ data }">
                <div class="flex items-center space-x-2">
                  <i class="pi pi-star text-yellow-500"></i>
                  <span class="font-semibold">{{ data.points || 0 }}</span>
                </div>
              </template>
            </Column>

          <Column header="Amallar" style="min-width: 180px">
  <template #body="{ data }">
    <Button 
      icon="pi pi-ellipsis-v" 
      @click="toggleMenu($event, data)" 
      class="p-button-text"
    />
  </template>
</Column>


          </DataTable>
        </template>
      </Card>
    </div>
<!-- Table tashqarisida umumiy Menu -->
<Menu ref="menu" :model="menuItems" popup />
    <!-- Add/Edit Dialog -->
    <Dialog v-model:visible="showAddDialog" :header="editingTeacher ? 'Tahrirlash' : 'Qo\'shish'" modal class="w-[95vw] sm:w-[500px]">
      <form @submit.prevent="saveTeacher" class="space-y-4">
        <div>
          <label>Ism</label>
          <InputText v-model="teacherForm.name" class="w-full" :class="{ 'p-invalid': errors.name }" />
          <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
        </div>
        <div>
          <label>Familiya</label>
          <InputText v-model="teacherForm.lastname" class="w-full" :class="{ 'p-invalid': errors.lastname }" />
          <small v-if="errors.lastname" class="p-error">{{ errors.lastname }}</small>
        </div>
        <div>
          <label>Fan</label>
          <Dropdown v-model="teacherForm.science" :options="scienceOptions" class="w-full" :class="{ 'p-invalid': errors.science }" editable />
          <small v-if="errors.science" class="p-error">{{ errors.science }}</small>
        </div>
        <div class="flex justify-end gap-3">
          <Button label="Bekor qilish" severity="secondary" outlined @click="closeDialog" />
          <Button type="submit" :label="editingTeacher ? 'Saqlash' : 'Qo\'shish'" :loading="saving" />
        </div>
      </form>
    </Dialog>

    <!-- Points Dialog -->
 <!-- Ball Qo'shish Dialog -->
<Dialog v-model:visible="showAddPointsDialogVisible" header="Ball qo'shish" modal class="w-[90vw] sm:w-[400px]">
  <form @submit.prevent="handleAddPoints" class="space-y-4">
    <label>{{ selectedTeacher?.name }} uchun qo'shiladigan ball</label>
    <InputNumber v-model="pointsToAdd" class="w-full" :min="1" :max="100" />
    <div class="flex justify-end gap-3">
      <Button label="Bekor qilish" severity="secondary" outlined @click="showAddPointsDialogVisible = false" />
      <Button type="submit" label="Qo'shish" :loading="addingPoints" />
    </div>
  </form>
</Dialog>

<!-- Ball Ayirish Dialog -->
<Dialog v-model:visible="showSubtractPointsDialogVisible" header="Ball ayirish" modal class="w-[90vw] sm:w-[400px]">
  <form @submit.prevent="handleSubtractPoints" class="space-y-4">
    <label>{{ selectedTeacher?.name }} uchun ayiriladigan ball</label>
    <InputNumber v-model="pointsToAdd" class="w-full" :min="1" :max="100" />
    <div class="flex justify-end gap-3">
      <Button label="Bekor qilish" severity="secondary" outlined @click="showSubtractPointsDialogVisible = false" />
      <Button type="submit" label="Ayirish" :loading="addingPoints" />
    </div>
  </form>
</Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import { useRoute, useRouter } from 'vue-router'

import Button from 'primevue/button'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import Avatar from 'primevue/avatar'
import Tag from 'primevue/tag'
import ConfirmDialog from 'primevue/confirmdialog'
import Toast from 'primevue/toast'
import Menu from 'primevue/menu'


const route = useRoute()
const router = useRouter()
const menu = ref()
const menuItems = ref([])

const toggleMenu = (event, teacher) => {
  selectedTeacher.value = teacher
  console.log(teacher);
  menuItems.value = [
    {
      label: 'Ball qo‘shish',
      icon: 'pi pi-plus',
      command: () => openAddPointsDialog(teacher)
    },
    {
      label: 'Ball ayirish',
      icon: 'pi pi-minus',
      command: () => openSubtractPointsDialog(teacher)
    },
    {
      label: 'Tahrirlash',
      icon: 'pi pi-pencil',
      command: () => editTeacher(teacher)
    },
    {
      label: 'O‘chirish',
      icon: 'pi pi-trash',
      command: () => confirmDelete(teacher)
    },
    {
      separator: true
    },
    {
      label: 'Batafsil',
      icon: 'pi pi-eye',
      command:()=>{
        router.push(`/teachers/${teacher._id}`)
      }
    },
    {
      label: 'Oylik to‘lash',
      icon: 'pi pi-wallet',
    }
  ]
  menu.value.toggle(event)
}

const toast = useToast()
const confirm = useConfirm()

const teachers = ref([])
const teacherForm = ref({ name: '', lastname: '', science: '' })
const searchQuery = ref('')
const showAddDialog = ref(false)
const showAddPointsDialogVisible = ref(false)
const showSubtractPointsDialogVisible = ref(false)
const selectedTeacher = ref(null)
const editingTeacher = ref(null)
const pointActionType = ref('add')
const pointsToAdd = ref(null)
const errors = ref({})
const saving = ref(false)
const addingPoints = ref(false)
const loading = ref(false)

const scienceOptions = ref(['Matematika','Fizika','Biologiya','Ingliz tili','Tarix','Informatika'])

const admin = JSON.parse(sessionStorage.getItem('admin') || '{}')

const fetchTeachers = async () => {
  loading.value = true
  try {
    const res = await axios.get(`/teachers?userId=${admin.id}`)
    teachers.value = res.data
    console.log(teachers.value)
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Xatolik', detail: 'O\'qituvchilarni yuklab bo\'lmadi', life: 3000 })
  } finally {
    loading.value = false
  }
}

const validateForm = () => {
  errors.value = {}
  if (!teacherForm.value.name) errors.value.name = 'Ism majburiy'
  if (!teacherForm.value.lastname) errors.value.lastname = 'Familiya majburiy'
  if (!teacherForm.value.science) errors.value.science = 'Fan tanlanishi kerak'
  return Object.keys(errors.value).length === 0
}

const saveTeacher = async () => {
  if (!validateForm()) return
  saving.value = true
  try {
    if (editingTeacher.value) {
      await axios.put(`/teachers/${editingTeacher.value._id}`, { ...teacherForm.value, userId: admin.id })
    } else {
      await axios.post('/teachers', { ...teacherForm.value, userId: admin.id })
    }
    toast.add({ severity: 'success', summary: 'Muvaffaqiyat', detail: 'Saqlash muvaffaqiyatli', life: 3000 })
    await fetchTeachers()
    closeDialog()
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Xatolik', detail: err.response?.data?.message || 'Xatolik yuz berdi', life: 3000 })
  } finally {
    saving.value = false
  }
}

const editTeacher = (teacher) => {
  editingTeacher.value = teacher
  teacherForm.value = { ...teacher }
  showAddDialog.value = true
}

const closeDialog = () => {
  showAddDialog.value = false
  editingTeacher.value = null
  teacherForm.value = { name: '', lastname: '', science: '' }
  errors.value = {}
}

const confirmDelete = (teacher) => {
  confirm.require({
    message: `${teacher.name} ${teacher.lastname} o'qituvchisini o'chirishni xohlaysizmi?`,
    header: 'O\'chirish',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      try {
        await axios.delete(`/teachers/${teacher._id}?userId=${admin.id}`)
        toast.add({ severity: 'success', summary: 'O\'chirildi', detail: 'O\'qituvchi o\'chirildi', life: 3000 })
        await fetchTeachers()
      } catch (error) {
        toast.add({ severity: 'error', summary: 'Xatolik', detail: 'O\'chirishda xatolik', life: 3000 })
      }
    }
  })
}

const openAddPointsDialog = (teacher) => {
  selectedTeacher.value = teacher
  pointsToAdd.value = null
  showAddPointsDialogVisible.value = true
}

const openSubtractPointsDialog = (teacher) => {
  selectedTeacher.value = teacher
  pointsToAdd.value = null
  showSubtractPointsDialogVisible.value = true
}

const handleAddPoints = async () => {
  if (!pointsToAdd.value || pointsToAdd.value <= 0) {
    toast.add({ severity: 'warn', summary: 'Ogohlantirish', detail: 'Ball miqdorini kiriting', life: 3000 })
    return
  }
  addingPoints.value = true
  try {
    await axios.post(`/teachers/${selectedTeacher.value._id}/add-points`, {
      points: pointsToAdd.value,
      userId: admin.id
    })
    toast.add({ severity: 'success', summary: 'Qo\'shildi', detail: 'Ball qo\'shildi', life: 3000 })
    await fetchTeachers()
    showAddPointsDialogVisible.value = false
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Ball qo\'shishda xatolik', life: 3000 })
  } finally {
    addingPoints.value = false
  }
}

const handleSubtractPoints = async () => {
  if (!pointsToAdd.value || pointsToAdd.value <= 0) {
    toast.add({ severity: 'warn', summary: 'Ogohlantirish', detail: 'Ball miqdorini kiriting', life: 3000 })
    return
  }
  addingPoints.value = true
  try {
    await axios.post(`/teachers/${selectedTeacher.value._id}/subtract-points`, {
      points: pointsToAdd.value,
      userId: admin.id
    })
    toast.add({ severity: 'success', summary: 'Ayirildi', detail: 'Ball ayirildi', life: 3000 })
    await fetchTeachers()
    showSubtractPointsDialogVisible.value = false
  } catch (err) {
    toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Ball ayirishda xatolik', life: 3000 })
  } finally {
    addingPoints.value = false
  }
}


const getInitials = (name, lastname) => {
  return `${name?.[0] || ''}${lastname?.[0] || ''}`.toUpperCase()
}

const filteredTeachers = computed(() => {
  if (!searchQuery.value) return teachers.value
  return teachers.value.filter(t => `${t.name} ${t.lastname} ${t.science}`.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

onMounted(fetchTeachers)
</script>

<style scoped>
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 1rem;
}
</style>

