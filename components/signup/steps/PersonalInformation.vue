<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useLoanApplicationStore } from '~/stores/loanApplication';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { User, CheckCircle, AlertCircle } from 'lucide-vue-next';

const store = useLoanApplicationStore();

const fullName = ref(store.full_name);
const saIdNumber = ref(store.sa_id_number);

const fullNameError = ref('');
const saIdError = ref('');
const ageError = ref('');

watch(fullName, (newValue) => {
  store.full_name = newValue;
  if (newValue.length < 3) {
    fullNameError.value = 'Full name must be at least 3 characters';
  } else {
    fullNameError.value = '';
  }
});

watch(saIdNumber, async (newValue) => {
  await store.setPersonalInformation(fullName.value, newValue); // Await the async call

  
  
  
  

  if (newValue.length !== 13 || !/^\d+$/.test(newValue)) {
    saIdError.value = 'SA ID Number must be 13 digits';
    ageError.value = '';
  } else if (!store.isSaIdValid) {
    saIdError.value = 'Invalid SA ID Number';
    ageError.value = '';
  } else if (!store.isAgeValid) {
    saIdError.value = '';
    ageError.value = 'Age not between 18-65';
  } else {
    saIdError.value = '';
    ageError.value = '';
  }
});

watch(() => store.full_name, (newValue) => {
  fullName.value = newValue;
});
watch(() => store.sa_id_number, (newValue) => {
  saIdNumber.value = newValue;
});

const isStepValid = computed(() => {
  const valid = fullName.value.length >= 3 &&
         saIdNumber.value.length === 13 &&
         /^\d+$/.test(saIdNumber.value) &&
         store.isSaIdValid &&
         store.isAgeValid;
  
  
  
  
  
  
  
  return valid;
});

defineExpose({
  isStepValid,
});
</script>

<template>
  <div class="space-y-4">
    <div class="space-y-2">
      <Label htmlFor="full_name">Full Name *</Label>
      <Input
        id="full_name"
        v-model="fullName"
        placeholder="Enter your full name"
        class="border-yellow-200 focus:border-yellow-200"
      />
      <Alert v-if="fullNameError" variant="destructive" class="py-2">
        <AlertCircle class="h-4 w-4" />
        <AlertDescription>{{ fullNameError }}</AlertDescription>
      </Alert>
    </div>

    <div class="space-y-2">
      <Label htmlFor="sa_id_number">SA ID Number *</Label>
      <Input
        id="sa_id_number"
        v-model="saIdNumber"
        placeholder="13-digit SA ID Number"
        maxlength="13"
        class="border-yellow-200 focus:border-yellow-200"
      />
      <Alert v-if="saIdError || ageError" variant="destructive" class="py-2">
        <AlertCircle class="h-4 w-4" />
        <AlertDescription>
          <span v-if="saIdError">{{ saIdError }}</span>
          <span v-else>{{ ageError }}</span>
        </AlertDescription>
      </Alert>
    </div>

    <div v-if="store.birthday" class="space-y-2">
      <Label>Birthday (Auto-extracted)</Label>
      <Input
        :model-value="store.birthday"
        readonly
        class="bg-yellow-50 border-yellow-200"
      />
      <Badge v-if="store.applicantAge" class="bg-yellow-300">Age: {{ store.applicantAge }} years</Badge>
    </div>

    <Alert v-if="store.existingApplicationId" class="border-yellow-200 bg-yellow-50 text-yellow-800 py-2">
      <CheckCircle class="h-4 w-4 text-yellow-300" />
      <AlertDescription class="text-yellow-800">
        An application with this SA ID (ID: {{ store.existingApplicationId }}) already exists. Submitting again will override the previous application.
      </AlertDescription>
    </Alert>
  </div>
</template>