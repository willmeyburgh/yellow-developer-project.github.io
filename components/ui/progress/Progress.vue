<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: number;
}>();

const progressWidth = computed(() => `${props.modelValue}%`);
</script>

<template>
  <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
    <div
      class="h-full bg-yellow-400 transition-all duration-500 ease-out"
      :style="{ width: progressWidth }"
    ></div>
  </div>
</template>
