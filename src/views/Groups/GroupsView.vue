<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Guruhlar bo'limi</h1>
        <p class="text-gray-600">Guruhlarni boshqaring va jarayonni kuzatib boring</p>
      </div>

      <!-- Yangi ustun qo'shish -->
      <div class="flex items-center gap-2 bg-white rounded-lg shadow-sm p-3">
        <button
          class="bg-gradient-to-r cursor-pointer from-green-500 to-green-600 text-white rounded-md px-4 py-2 hover:from-green-600 hover:to-green-700 transition-all duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          @click="visibleAddGroup = true"
        >
          <i class="pi pi-plus"></i>
          Guruh qo'shish
        </button>
      </div>
    </div>
    <div>
        <GroupsCard></GroupsCard>
    </div>
  </div>

  <Drawer v-model:visible="visibleAddGroup" header="Guruh Qo'shish" position="right">
    <AddGroupForm></AddGroupForm>
</Drawer>
</template>
<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Drawer from 'primevue/drawer'
import AddGroupForm from '../../components/Groups/AddGroupsForm.vue'
import GroupsCard from  "../../components/Groups/GroupsCard.vue"
const visibleAddGroup = ref(false)
const router = useRouter()
</script>
<style scoped></style>
