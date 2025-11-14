<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useLoanApplicationStore } from '~/stores/loanApplication';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Upload, AlertCircle } from 'lucide-vue-next';

const store = useLoanApplicationStore();

const monthlyIncome = ref(store.monthly_income);
const proofDocumentName = ref(store.proof_document_name);

const monthlyIncomeError = ref('');
const proofDocumentError = ref('');

watch(monthlyIncome, (newValue) => {
  store.monthly_income = newValue;
  if (newValue === null || newValue <= 0) {
    monthlyIncomeError.value = 'Monthly income must be a positive number';
  } else {
    monthlyIncomeError.value = '';
  }
});

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    proofDocumentName.value = target.files[0].name;
    store.setProofDocumentName(target.files[0].name);
    proofDocumentError.value = '';
  } else {
    proofDocumentName.value = null;
    store.setProofDocumentName('');
    proofDocumentError.value = 'Please upload a proof document';
  }
};

watch(() => store.monthly_income, (newValue) => {
  monthlyIncome.value = newValue;
});
watch(() => store.proof_document_name, (newValue) => {
  proofDocumentName.value = newValue;
});

const isStepValid = computed(() => {
  return monthlyIncome.value !== null &&
         monthlyIncome.value > 0 &&
         proofDocumentName.value !== null &&
         proofDocumentName.value !== '';
});

defineExpose({
  isStepValid,
});
</script>

<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <Label htmlFor="monthly_income">Monthly Income (ZAR) *</Label>
      <Input
        id="monthly_income"
        v-model.number="monthlyIncome"
        type="number"
        placeholder="Enter your monthly income"
        class="border-yellow-200 focus:border-yellow-200"
      />
      <Alert v-if="monthlyIncomeError" variant="destructive" class="py-2">
        <AlertCircle class="h-4 w-4" />
        <AlertDescription>{{ monthlyIncomeError }}</AlertDescription>
      </Alert>
    </div>

    <div class="space-y-2">
      <Label htmlFor="proof_document">Proof of Income Document *</Label>
      <div class="flex items-center gap-2">
        <Input
          id="proof_document"
          type="file"
          @change="handleFileUpload"
          accept=".pdf,.jpg,.jpeg,.png"
          class="border-yellow-200 focus:border-yellow-200"
        />
        <Upload class="w-5 h-5 text-yellow-300" />
      </div>
      <Badge v-if="proofDocumentName" class="bg-green-600">Uploaded: {{ proofDocumentName }}</Badge>
      <Alert v-if="proofDocumentError" variant="destructive" class="py-2">
        <AlertCircle class="h-4 w-4" />
        <AlertDescription>{{ proofDocumentError }}</AlertDescription>
      </Alert>
    </div>
  </div>
</template>
