<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { MenuIcon } from 'lucide-vue-next'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Purpose', href: '/purpose' },
  { name: 'Join Us', href: '/join-us' },
  { name: 'Support', href: '/support' },
]

const isOpen = ref(false)
</script>

<template>
  <nav class="sticky top-0 z-50 bg-white shadow-md">
    <div class="container mx-auto px-4 py-3 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex-shrink-0">
        <img src="https://yellow.africa/logos/yellow-full-logo.png" alt="Yellow Logo" class="h-8">
      </NuxtLink>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex space-x-6">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.name"
          to="/"
          class="text-gray-700 hover:text-yellow-500 transition-colors duration-200"
        >
          {{ link.name }}
        </NuxtLink>
      </div>

      <!-- Mobile Navigation (Hamburger Menu) -->
      <div class="md:hidden flex items-center">
        <Sheet v-model:open="isOpen">
          <SheetTrigger as-child>
            <Button variant="ghost" size="icon">
              <MenuIcon class="h-6 w-6" />
              <span class="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div class="flex flex-col space-y-4 pt-8">
              <NuxtLink
                v-for="link in navLinks"
                :key="link.name"
                :to="link.href"
                class="text-lg font-medium text-gray-700 hover:text-yellow-500 transition-colors duration-200"
                @click="isOpen = false"
              >
                {{ link.name }}
              </NuxtLink>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Add any specific styles here if needed, though Tailwind should handle most */
</style>
