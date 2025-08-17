<template>
  <div class="flex items-center gap-3">
    <Avatar 
      :label="getInitials(student)"
      shape="circle"
      size="small"
      :style="{ backgroundColor: getAvatarColor(student?.name) }"
      class="shadow-sm"
    />
    <div>
      <p class="font-medium text-gray-800 m-0">
        {{ student?.name }} {{ student?.lastname }}
      </p>
      <p class="text-xs text-gray-500 m-0" v-if="student?.phone">
        <i class="pi pi-phone mr-1"></i> {{ student.phone }}
      </p>
    </div>
  </div>
</template>

<script setup>
import Avatar from 'primevue/avatar';

defineProps({
  student: {
    type: Object,
    required: true
  }
});

const getInitials = (student) => {
  if (!student) return '';
  return (student.name?.charAt(0) || '') + (student.lastname?.charAt(0) || '');
};

const getAvatarColor = (name) => {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];
  
  if (!name) return colors[0];
  const index = name.length % colors.length;
  return colors[index];
};
</script>
