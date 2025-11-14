<script setup lang="ts">
import { computed } from 'vue';
import { useLoanApplicationStore } from '~/stores/loanApplication';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Flower2 } from 'lucide-vue-next';

const store = useLoanApplicationStore();

const isStepValid = computed(() => {
  return store.full_name !== '' &&
         store.isSaIdValid &&
         store.isAgeValid &&
         store.monthly_income !== null && store.monthly_income > 0 &&
         store.proof_document_name !== null && store.proof_document_name !== '' &&
         store.selected_phone_id !== null &&
         store.loanPrincipal !== null &&
         store.totalLoanAmount !== null &&
         store.dailyPayment !== null;
});

defineExpose({
  isStepValid,
});
</script>

<template>
  <div class="space-y-6">
    <div class="space-y-4">
      <div class="flex items-center gap-2 text-yellow-300">
        <Flower2 class="w-5 h-5" />
        <h3 class="font-semibold text-lg">Application Summary</h3>
      </div>

      <Card class="border-yellow-200 bg-yellow-50 py-4">
        <CardHeader>
          <CardTitle class="text-base">Personal Information</CardTitle>
        </CardHeader>
        <CardContent class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-muted-foreground">Full Name:</span>
            <span class="font-medium">{{ store.full_name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">SA ID Number:</span>
            <span class="font-medium">{{ store.sa_id_number }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">Birthday:</span>
            <span class="font-medium">{{ store.birthday }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">Age:</span>
            <span class="font-medium">{{ store.applicantAge }} years</span>
          </div>
        </CardContent>
      </Card>

      <Card class="border-yellow-200 bg-yellow-50 py-4">
        <CardHeader>
          <CardTitle class="text-base">Income Details</CardTitle>
        </CardHeader>
        <CardContent class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-muted-foreground">Monthly Income:</span>
            <span class="font-medium">R {{ store.monthly_income?.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">Proof Document:</span>
            <span class="font-medium">{{ store.proof_document_name }}</span>
          </div>
        </CardContent>
      </Card>

      <Card v-if="store.selectedPhone && store.applicantAge" class="border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-50 pt-4">
        <CardHeader>
          <CardTitle class="text-base">Loan Details</CardTitle>
        </CardHeader>
        <CardContent class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-muted-foreground">Selected Phone:</span>
            <span class="font-medium">{{ store.selectedPhone.model_name }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">Cash Price:</span>
            <span class="font-medium">R {{ store.selectedPhone.cash_price.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">Risk Group:</span>
            <span class="font-medium">Age {{ store.applicantAge }} (Deposit: {{ (store.riskProfile?.deposit * 100).toFixed(0) }}%, Interest: {{ (store.riskProfile?.interest * 100).toFixed(0) }}%)</span>
          </div>
          <Separator class="bg-yellow-200" />
          <div class="flex justify-between">
            <span class="text-muted-foreground">Loan Principal:</span>
            <span class="font-medium">R {{ store.loanPrincipal?.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-muted-foreground">Total Loan Amount:</span>
            <span class="font-medium">R {{ store.totalLoanAmount?.toFixed(2) }}</span>
          </div>
          <Separator class="bg-yellow-300" />
          <div class="flex justify-between items-center bg-yellow-300 text-white p-3 rounded-lg -mx-6 mt-3">
            <span class="font-semibold">Daily Payment:</span>
            <span class="text-xl font-bold">R {{ store.dailyPayment?.toFixed(2) }}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
