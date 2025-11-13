<template>
  <div class="flex flex-col flex-grow">
    <Nav />
    <main class="container mx-auto px-4 py-8 flex-grow">
      <!-- Your page content goes here -->
      <h1 class="text-4xl font-bold text-center mt-10">Coming Soon</h1>
      <p class="text-center text-gray-600 mt-4">
        We are working hard to bring you an amazing experience. Stay tuned!
      </p>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Nav from '@/components/Nav.vue'
import Footer from '@/components/Footer.vue'
</script>
