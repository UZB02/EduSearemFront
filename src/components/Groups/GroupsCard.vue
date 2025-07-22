<template>
  <div class=" bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
    <div class="p-6">
     <div class="flex justify-between">
       <span class="flex flex-col">
         <h2 class="text-xl font-semibold text-gray-800 mb-2">{{ group.name }}</h2>
         <p class="text-gray-600 text-sm mb-4">{{ group.teacher.name }} {{ group.teacher.lastname }}</p>
        </span>
       <div>
         <i class="pi pi-cog cursor-pointer text-gray-500" @click="toggle($event, group._id)"></i>
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" :appendTo="'self'"/>
       </div>
     </div>

      <div class="flex justify-between items-center text-sm text-gray-500">
        <span>📅 {{ formatDate(group.createdAt) }}</span>
        <span>👥 {{ group.students.length }} a'zo</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatDate } from '../../utils/FormatDate.js';
import {ref} from 'vue'
import Menu from 'primevue/menu'
import { useRoute, useRouter } from 'vue-router'
const router = useRouter()

const menu=ref()
const groupId=ref()
const items = ref([
  {
    label: 'Batafsil',
    icon: 'pi pi-eye',
    command:()=>{
      router.push(`/group/${groupId.value}`)
    }
  },
  {
    label: 'Tahrirlash',
    icon: 'pi pi-refresh',
  },
  {
    label: "O'chirish",
    icon: 'pi pi-trash',
    command: () => {
      console.log(groupId.value);
    },
  },
])

const toggle = (event, Id) => {
  menu.value.toggle(event)
  groupId.value = Id
  console.log(groupId.value)
}


defineProps({
  group: {
    type: Object,
    required: true,
    default: () => ({
      name: 'Frontend Guruh',
      description: 'Vue 3 va Tailwind o‘rganuvchilar uchun guruh',
      createdAt: '2025-07-17',
      membersCount: 42
    })
  }
})
</script>

<style scoped>
</style>
