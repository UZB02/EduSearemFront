<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <SummaryCard title="Jami o'quvchilar" :value="totalStudents" icon="pi pi-users" color="blue" />
    
    <SummaryCard 
      title="Eng yuqori ball" 
      :value="maxScore.score.toFixed(1)" 
      :subtitle="maxScore.studentName"
      icon="pi pi-trophy" 
      color="green" 
    />

    <SummaryCard 
      title="Eng past ball" 
      :value="minScore.score.toFixed(1)" 
      :subtitle="minScore.studentName"
      icon="pi pi-arrow-down-right" 
      color="red" 
    />
  </div>
</template>

<script setup>
import SummaryCard from './SummaryCard.vue';
const props = defineProps({
  totalStudents: Number,
  minScore: Object,   // { studentName, score }
  maxScore: Object,
});
</script>
