<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-slate-800 mb-2">Xonalar boshqaruvi</h1>
            <p class="text-slate-600">Xonalarni boshqaring va jadvallarni ko'ring</p>
          </div>
          <div class="flex gap-3">
            <Button 
              label="Yangi xona qo'shish" 
              icon="pi pi-plus" 
              class="bg-blue-600 hover:bg-blue-700 border-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              @click="openDialog" 
            />
            <Button 
              label="Xonalar jadvali" 
              icon="pi pi-calendar" 
              class="bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              @click="navigateToSchedules" 
            />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="p-6 border-b border-slate-200">
          <h2 class="text-xl font-semibold text-slate-800">Xonalar ro'yxati</h2>
        </div>
        
        <DataTable 
          :value="rooms" 
          class="w-full"
          :paginator="true" 
          :rows="10"
          :rowsPerPageOptions="[5, 10, 20]"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="{first} dan {last} gacha, jami {totalRecords} ta xona"
          responsiveLayout="scroll"
        >
          <Column field="name" header="Xona nomi" class="font-medium text-slate-800">
            <template #body="slotProps">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i class="pi pi-home text-blue-600"></i>
                </div>
                <span class="font-medium text-slate-800">{{ slotProps.data.name }}</span>
              </div>
            </template>
          </Column>
          
          <Column field="capacity" header="Sig'imi">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <i class="pi pi-users text-slate-500"></i>
                <span class="text-slate-700">{{ slotProps.data.capacity }} kishi</span>
              </div>
            </template>
          </Column>
          
          <Column field="description" header="Izoh">
            <template #body="slotProps">
              <span class="text-slate-600 text-sm">
                {{ slotProps.data.description || 'Izoh yo\'q' }}
              </span>
            </template>
          </Column>
          
          <Column header="Amallar" class="w-32">
            <template #body="slotProps">
              <div class="flex gap-2">
                <Button 
                  icon="pi pi-pencil" 
                  class="p-2 bg-amber-100 hover:bg-amber-200 text-amber-700 border-amber-200 rounded-lg transition-colors duration-200" 
                  @click="() => editRoom(slotProps.data)"
                />
           <Button 
                icon="pi pi-trash" 
                class="p-button-danger"
                @click="() => openDeleteDialog(slotProps.data)" 
              />
              </div>
            </template>
          </Column>
        </DataTable>
      </div>

      <Dialog 
        v-model:visible="dialogVisible" 
        :header="form._id ? 'Xonani tahrirlash' : 'Yangi xona qo\'shish'" 
        :modal="true" 
        class="w-full max-w-md mx-4"
        :draggable="false"
      >
        <div class="space-y-6 p-2">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">Xona nomi</label>
            <InputText 
              v-model="form.name" 
              placeholder="Masalan: Konferens zali A" 
              class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">Sig'imi</label>
            <InputNumber 
              v-model="form.capacity" 
              placeholder="Necha kishi sig'adi" 
              :min="1" 
              :max="1000"
              class="w-full"
              inputClass="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-medium text-slate-700">Izoh</label>
            <Textarea 
              v-model="form.description" 
              placeholder="Xona haqida qo'shimcha ma'lumot..." 
              rows="4" 
              class="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            />
          </div>
        </div>
        
        <template #footer>
          <div class="flex justify-end gap-3 pt-4">
            <Button 
              label="Bekor qilish" 
              class="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 border-slate-200 rounded-lg transition-colors duration-200" 
              @click="() => { dialogVisible = false }" 
            />
            <Button 
              :label="form._id ? 'Yangilash' : 'Saqlash'" 
              icon="pi pi-check" 
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white border-blue-600 rounded-lg transition-colors duration-200"
              @click="saveRoom" 
            />
          </div>
        </template>
      </Dialog>
    </div>
  </div>
  
    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:visible="deleteDialogVisible" :modal="true" header="Tasdiqlash" :closable="false">
      <p>Bu xonani o‘chirmoqchimisiz?</p>
      <div class="flex justify-end gap-3 mt-4">
        <Button label="Yo‘q" class="p-button-secondary" @click="deleteDialogVisible = false" />
        <Button label="Ha" class="p-button-danger" @click="confirmDelete" />
      </div>
    </Dialog>
  <Toast /> 
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
import api from '../../utils/api.js'

const router = useRouter()
const rooms = ref([])
const dialogVisible = ref(false)
const deleteDialogVisible = ref(false) // O'chirish dialogi
const roomToDelete = ref(null)         // O'chiriladigan xona
const form = ref({ name: '', capacity: 0, description: '', userId: '' })
const toast = useToast()
const admin = JSON.parse(sessionStorage.getItem('admin') || '{}')

const fetchRooms = async () => {
  try {
    const res = await api.get(`/rooms?adminId=${admin.id}`)
    rooms.value = res.data
  } catch (err) {
    console.error('Xonalarni olishda xato:', err)
    toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Xonalarni olishda xato', life: 3000 })
  }
}

const navigateToSchedules = () => {
  router.push('/rooms/roomschedules')
}

const openDialog = () => {
  form.value = { name: '', capacity: 0, description: '', userId: admin.id }
  dialogVisible.value = true
}

const editRoom = (room) => {
  form.value = { ...room, userId: admin.id }
  dialogVisible.value = true
}

const saveRoom = async () => {
  try {
    if (form.value._id) {
      await api.put(`/rooms/${form.value._id}`, form.value)
      toast.add({ severity: 'success', summary: 'Muvaffaqiyat', detail: 'Xona yangilandi', life: 3000 })
    } else {
      await api.post('/rooms', form.value)
      toast.add({ severity: 'success', summary: 'Muvaffaqiyat', detail: 'Yangi xona qo\'shildi', life: 3000 })
    }
    dialogVisible.value = false
    fetchRooms()
  } catch (err) {
    console.error('Xona saqlashda xato:', err)
    toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Xona saqlashda xato', life: 3000 })
  }
}

// Oddiy Dialog orqali o'chirish
const openDeleteDialog = (room) => {
  roomToDelete.value = room
  deleteDialogVisible.value = true
}

const confirmDelete = async () => {
  if (!roomToDelete.value) return
  try {
    await api.delete(`/rooms/${roomToDelete.value._id}`)
    toast.add({ severity: 'success', summary: 'Muvaffaqiyat', detail: 'Xona o\'chirildi', life: 3000 })
    fetchRooms()
  } catch (err) {
    console.error('Xona o\'chirishda xato:', err)
    toast.add({ severity: 'error', summary: 'Xatolik', detail: 'Xona o\'chirishda xato', life: 3000 })
  } finally {
    deleteDialogVisible.value = false
    roomToDelete.value = null
  }
}

onMounted(() => {
  if (admin.id) {
    form.value.userId = admin.id
    fetchRooms()
  }
})
</script>

<style scoped>
:deep(.p-datatable) {
  border: none;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: #f8fafc;
  border: none;
  border-bottom: 1px solid #e2e8f0;
  color: #475569;
  font-weight: 600;
  padding: 1rem;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  border: none;
  border-bottom: 1px solid #f1f5f9;
  padding: 1rem;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background: #f8fafc;
}

:deep(.p-dialog .p-dialog-header) {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem;
}

:deep(.p-dialog .p-dialog-content) {
  padding: 1.5rem;
}

:deep(.p-paginator) {
  background: #f8fafc;
  border: none;
  border-top: 1px solid #e2e8f0;
  padding: 1rem;
}
</style>
