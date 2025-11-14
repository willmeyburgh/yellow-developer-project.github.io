<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

interface AlertDescriptionProps {
  class?: HTMLAttributes['class'];
}

const props = defineProps<AlertDescriptionProps>();
</script>

<template>
  <div
    data-slot="alert-description"
    :class="cn('text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed', props.class)"
  >
    <slot />
  </div>
</template>
