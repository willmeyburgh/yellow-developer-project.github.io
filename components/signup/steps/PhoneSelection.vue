<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useLoanApplicationStore } from '~/stores/loanApplication';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Smartphone, AlertCircle, XCircle } from 'lucide-vue-next'; // Added XCircle for deselect button

const store = useLoanApplicationStore();

const selectedPhoneId = ref<number | null>(store.selected_phone_id);
const phoneSelectionError = ref('');

watch(selectedPhoneId, (newValue) => {
  store.setSelectedPhone(newValue as number);
  if (newValue) {
    phoneSelectionError.value = '';
  } else {
    phoneSelectionError.value = 'Please select a phone';
  }
});

watch(() => store.selected_phone_id, (newValue) => {
  selectedPhoneId.value = newValue;
});

const isStepValid = computed(() => {
  return store.selected_phone_id !== null &&
         store.loanPrincipal !== null &&
         store.totalLoanAmount !== null &&
         store.dailyPayment !== null;
});

defineExpose({
  isStepValid,
});

const handlePhoneSelect = (phoneId: number) => {
  if (selectedPhoneId.value === phoneId) {
    selectedPhoneId.value = null; // Deselect if already selected
  } else {
    selectedPhoneId.value = phoneId; // Select
  }
};

const displayedPhones = computed(() => {
  if (selectedPhoneId.value !== null) {
    const selected = store.affordablePhones.find(phone => phone.id === selectedPhoneId.value);
    return selected ? [selected] : [];
  }
  return store.affordablePhones;
});
</script>

<template>
  <div class="space-y-4">
    <Alert v-if="!store.monthly_income || store.monthly_income <= 0" class="border-yellow-200">
      <AlertCircle class="h-4 w-4" />
      <AlertDescription>
        Please provide your monthly income in the previous step to see affordable phones.
      </AlertDescription>
    </Alert>
    <Alert v-else-if="!store.isAgeValid" class="border-yellow-200">
      <AlertCircle class="h-4 w-4" />
      <AlertDescription>
        Your age must be between 18 and 65 years old to proceed with phone selection.
      </AlertDescription>
    </Alert>
    <div v-else>
      <p class="text-sm text-muted-foreground">
        Select a phone from the available options based on your income
      </p>
      <div class="grid gap-4 mt-4">
        <Alert v-if="store.affordablePhones.length === 0" class="border-yellow-200">
          <AlertCircle class="h-4 w-4" />
          <AlertDescription>
            No phones available within your affordability range. Please review your income details.
          </AlertDescription>
        </Alert>
        <template v-else>
          <div v-if="selectedPhoneId !== null" class="flex justify-end mb-2">
            <Button variant="ghost" @click="selectedPhoneId = null" class="text-red-500 hover:bg-red-50">
              <XCircle class="w-4 h-4 mr-2" /> Show All Phones
            </Button>
          </div>
          <Card
            v-for="phone in displayedPhones"
            :key="phone.id"
            class="cursor-pointer transition-all hover:shadow-lg"
            :class="{
              'border-yellow-300 bg-yellow-50 shadow-md': selectedPhoneId === phone.id,
              'border-yellow-200 hover:border-yellow-200': selectedPhoneId !== phone.id
            }"
            @click="handlePhoneSelect(phone.id)"
          >
            <CardContent class="p-4">
              <div class="flex justify-between items-start mb-3">
                <div>
                  <h3 class="font-semibold text-lg text-yellow-900">{{ phone.model_name }}</h3>
                  <p class="text-sm text-muted-foreground">
                    Cash Price: R {{ phone.cash_price.toFixed(2) }}
                  </p>
                </div>
                <Badge v-if="selectedPhoneId === phone.id" class="bg-yellow-300">Selected</Badge>
              </div>

              <div v-if="store.applicantAge" class="space-y-2 text-sm">
                <Separator class="bg-yellow-200" />
                <div class="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <p class="text-muted-foreground">Daily Payment</p>
                    <p class="font-semibold text-yellow-300">
                      R {{ store.getPhoneLoanDetails(phone)?.dailyPayment?.toFixed(2) || 'N/A' }}
                    </p>
                  </div>
                  <div>
                    <p class="text-muted-foreground">Monthly Price</p>
                    <p class="font-semibold">
                      R {{ store.getPhoneLoanDetails(phone)?.monthlyPrice?.toFixed(2) || 'N/A' }}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </template>
      </div>
    </div>
    <Alert v-if="phoneSelectionError" variant="destructive" class="py-2">
      <AlertCircle class="h-4 w-4" />
      <AlertDescription>{{ phoneSelectionError }}</AlertDescription>
    </Alert>
  </div>
</template>
