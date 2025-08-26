<template>
  <Dialog 
    :visible="visible" 
    @update:visible="$emit('update:visible', $event)"
    header="Guruhni xonaga joylash" 
    modal 
    class="w-full max-w-md mx-4"
  >
    <div class="space-y-6 py-4">
      <!-- Xona tanlash -->
      <div>
        <label class="block font-semibold text-gray-700 mb-2">Xona</label>
        <Dropdown 
          v-model="form.roomId" 
          :options="rooms" 
          optionLabel="name" 
          optionValue="_id" 
          placeholder="Xona tanlang" 
          class="w-full"
        />
      </div>

      <!-- Guruh tanlash -->
      <div>
        <label class="block font-semibold text-gray-700 mb-2">Guruh</label>
        <Dropdown 
          v-model="form.groupId" 
          :options="groups" 
          optionValue="_id" 
          placeholder="Guruh tanlang" 
          class="w-full"
        >
          <!-- Tanlangan qiymat -->
          <template #value="slotProps">
            <div v-if="slotProps.value">
              {{ getGroupLabel(slotProps.value) }}
            </div>
            <span v-else class="text-gray-400">Guruh tanlang</span>
          </template>

          <!-- Variantlar -->
          <template #option="slotProps">
            <div class="flex flex-col">
              <span class="font-medium">{{ slotProps.option.name }}</span>
              <span class="text-xs text-gray-500">
                {{ slotProps.option.startTime }} - {{ slotProps.option.endTime }}
              </span>
            </div>
          </template>
        </Dropdown>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button 
          label="Bekor qilish" 
          text 
          icon="pi pi-times" 
          @click="$emit('close')" 
        />
        <Button 
          label="Joylash" 
          icon="pi pi-check" 
          @click="$emit('save')" 
          :loading="saving" 
          class="p-button-success" 
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import Dialog from "primevue/dialog";
import Dropdown from "primevue/dropdown";
import Button from "primevue/button";

const props = defineProps({ 
  visible: Boolean, 
  rooms: Array, 
  groups: Array, 
  form: Object, 
  saving: Boolean 
});

// Guruh labelini chiqarish helper
const getGroupLabel = (id) => {
  const group = props.groups.find(g => g._id === id);
  return group ? `${group.name} (${group.startTime} - ${group.endTime})` : "";
};
</script>
