<template>
<!-- Asosiy Layout -->
<div class="min-h-screen flex flex-col">
  <!-- Navbar -->
  <NavBar class="z-20" />

  <!-- Kontent -->
  <div class="flex flex-1">
    <!-- Sidebar (faqat md va undan katta ekranlar uchun ko‘rsatiladi) -->
    <div class="hidden md:block w-64 bg-white h-[calc(100vh-4rem)] fixed  left-0 z-10 shadow">
      <!-- 4rem = 64px (NavBar balandligi) -->
      <SideBar />
    </div>

    <!-- Asosiy kontent -->
    <main class="flex-1 ml-0 md:ml-64 p-4 bg-gray-50">
      <RouterView />
    </main>
  </div>
</div>

</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { RouterView } from "vue-router";
import NavBar from "@/components/NavBar/Nav.vue";
import SideBar from "@/components/Sidebar/Sidebar.vue";

const sidebarVisible = ref(false);
const screenIsLarge = ref(window.innerWidth >= 768);

const handleResize = () => {
  screenIsLarge.value = window.innerWidth >= 768;
  if (screenIsLarge.value) sidebarVisible.value = false;
};

onMounted(() => window.addEventListener('resize', handleResize));
onUnmounted(() => window.removeEventListener('resize', handleResize));
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from {
  transform: translateX(-100%);
}
.slide-enter-to {
  transform: translateX(0%);
}
.slide-leave-from {
  transform: translateX(0%);
}
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
