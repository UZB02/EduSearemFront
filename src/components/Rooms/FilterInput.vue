<template>
  <div class="flex items-center gap-2">
    <i :class="icon" class="text-indigo-600"></i>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      :placeholder="placeholder"
      class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm w-full"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: String,
  icon: String,
  placeholder: String
});
</script>
