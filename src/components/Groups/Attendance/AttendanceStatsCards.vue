<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <CardItem 
      title="Jami o'quvchilar" 
      :value="totalStudents" 
      icon="pi pi-users" 
      color="blue"
    />
    <CardItem 
      title="Bugungi davomat" 
      :value="todayAttendance + '%'" 
      icon="pi pi-check-circle" 
      color="green"
    />
    <CardItem 
      title="Kechikkanlar" 
      :value="lateStudents" 
      icon="pi pi-clock" 
      color="orange"
    />
    <CardItem 
      title="Yo'qlar" 
      :value="absentStudents" 
      icon="pi pi-times-circle" 
      color="red"
    />
  </div>
</template>

<script setup>
import CardItem from "./CardItem.vue";

const props = defineProps({
  totalStudents: Number,
  todayAttendance: Number,
  lateStudents: Number,
  absentStudents: Number,
});
</script>
