<template>
  <aside class="w-full h-full py-2 bg-white md:sticky md:h-auto md:top-12  ">
    <nav class="space-y-2 ">
      <!-- Mobilda yopish tugmasi -->
      <button class="md:hidden mb-4 bg-red-400 w-full rounded text-white font-bold" @click="$emit('close')">
        <i class="pi pi-times text-xl"></i> Yopish
      </button>
      <div class="flex flex-col gap-4 " v-for="item in views">
        <RouterLink :to="item.to" @click="$emit('close')" class="block bg-slate-100 p-2 rounded hover:bg-slate-300"><i :class="item.icon"></i> {{item.name}}</RouterLink>
      </div>
      <!-- Boshqa menyular -->
    </nav>
  </aside>
</template>

<script setup>
import {ref} from 'vue'
import { RouterLink } from 'vue-router';

const views=ref([
    {
        name:'Bosh sahifa',
        to:'/',
        icon:'pi pi-home'
    },
    {
        name:'Arizalar',
        to:'/application',
        icon:'pi pi-book'
    },
    {
        name:'Guruhlar',
        to:'/groups',
        icon:'pi pi-graduation-cap'
    },
    {
        name:'O\'qtuvchilar',
        to:'/about',
        icon:'pi pi-address-book'
    },
    {
        name:'Balans',
        to:'/balance',
        icon:'pi pi-wallet'
    },
    {
        name:'Xarajatlar',
        to:'/expense',
        icon:'pi pi-credit-card'
    },
])
</script>

<style scoped></style>
