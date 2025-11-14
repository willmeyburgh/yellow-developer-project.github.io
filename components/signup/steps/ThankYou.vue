<script setup lang="ts">
import { useLoanApplicationStore } from '~/stores/loanApplication';
import { Button } from '@/components/ui/button';
import { CheckCircle, Flower2 } from 'lucide-vue-next';

const store = useLoanApplicationStore();

const resetFormAndStartOver = () => {
  store.resetForm();
  store.currentStep = 1; // Ensure step is reset to 1
};
</script>

<template>
  <div>
    <div class="text-center space-y-4 p-6">
      <div class="flex justify-center">
        <CheckCircle class="w-20 h-20 text-yellow-300" />
      </div>
      <h2 class="text-3xl font-semibold text-gray-800">Application Submitted!</h2>
      <p class="text-muted-foreground">
        Your loan application has been successfully submitted.
      </p>
    </div>
  </div>
</template>
