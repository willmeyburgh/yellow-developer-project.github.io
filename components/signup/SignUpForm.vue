<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useLoanApplicationStore } from '~/stores/loanApplication';
import PersonalInformation from './steps/PersonalInformation.vue';
import IncomeDetails from './steps/IncomeDetails.vue';
import PhoneSelection from './steps/PhoneSelection.vue';
import ReviewAndSubmit from './steps/ReviewAndSubmit.vue';
import ThankYou from './steps/ThankYou.vue'; // Re-import ThankYou component
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ChevronRight,
  ChevronLeft,
  User,
  DollarSign,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Upload,
  Flower2
} from 'lucide-vue-next';

const store = useLoanApplicationStore();

const personalInfoRef = ref<InstanceType<typeof PersonalInformation> | null>(null);
const incomeDetailsRef = ref<InstanceType<typeof IncomeDetails> | null>(null);
const phoneSelectionRef = ref<InstanceType<typeof PhoneSelection> | null>(null);
const reviewAndSubmitRef = ref<InstanceType<typeof ReviewAndSubmit> | null>(null);
const thankYouRef = ref<InstanceType<typeof ThankYou> | null>(null); // Ref for ThankYou component

const currentStepComponent = computed(() => {
  switch (store.currentStep) {
    case 1: return PersonalInformation;
    case 2: return IncomeDetails;
    case 3: return PhoneSelection;
    case 4: return ReviewAndSubmit;
    case 5: return ThankYou; // Add ThankYou component for step 5
    default: return PersonalInformation;
  }
});

const isCurrentStepValid = computed(() => {
  switch (store.currentStep) {
    case 1: return personalInfoRef.value?.isStepValid ?? false;
    case 2: return incomeDetailsRef.value?.isStepValid ?? false;
    case 3: return phoneSelectionRef.value?.isStepValid ?? false;
    case 4: return reviewAndSubmitRef.value?.isStepValid ?? false;
    case 5: return true; // ThankYou page is always valid to display
    default: return false;
  }
});

const progressValue = computed(() => {
  return (store.currentStep / 5) * 100; // Updated for 5 steps
});

const handleNext = async () => {
  if (isCurrentStepValid.value) {
    if (store.currentStep === 4) {
      await store.submitApplication();
      if (store.status === 'SUBMITTED') {
        store.nextStep(); // Move to Thank You page only if submission is successful
      }
    } else {
      store.nextStep();
    }
  }
};

const handleBack = () => {
  store.prevStep();
};

const resetApplication = () => {
  store.resetForm();
  store.currentStep = 1; // Ensure step is reset to 1
};

onMounted(() => {
  store.fetchPhoneModels();
});
</script>

<template>
  <div class="min-h-screen from-yellow-50 via-white to-yellow-100 sm:p-4 py-4">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-8 space-y-2">
        <div class="flex items-center justify-center gap-2 mb-4">
          <h1 class="text-4xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-300 bg-clip-text text-transparent">
            Yellow Loans
          </h1>
        </div>
        <p class="text-muted-foreground">Complete your loan application in 5 simple steps</p>
      </div>

      <div class="mb-6">
        <Progress :model-value="progressValue" class="h-2 bg-yellow-100" />
        <div class="flex justify-between mt-2 text-sm text-muted-foreground">
          <span :class="{ 'text-yellow-300 font-semibold': store.currentStep === 1, 'text-yellow-600 font-semibold': store.currentStep > 1 }">Personal</span>
          <span :class="{ 'text-yellow-300 font-semibold': store.currentStep === 2, 'text-yellow-600 font-semibold': store.currentStep > 2 }">Income</span>
          <span :class="{ 'text-yellow-300 font-semibold': store.currentStep === 3, 'text-yellow-600 font-semibold': store.currentStep > 3 }">Phone</span>
          <span :class="{ 'text-yellow-300 font-semibold': store.currentStep === 4, 'text-yellow-600 font-semibold': store.currentStep > 4 }">Review</span>
          <span :class="{ 'text-yellow-300 font-semibold': store.currentStep === 5, 'text-yellow-600 font-semibold': store.currentStep > 5 }">Thank You</span>
        </div>
      </div>

      <Card class="border-yellow-200 shadow-xl">
        <CardHeader class="text-center space-y-4 pt-4 pb-2 bg-gradient-to-r from-yellow-400 to-yellow-300 text-white">
          <div class="flex items-center gap-3">
            <User v-if="store.currentStep === 1" class="w-6 h-6" />
            <DollarSign v-else-if="store.currentStep === 2" class="w-6 h-6" />
            <Smartphone v-else-if="store.currentStep === 3" class="w-6 h-6" />
            <CheckCircle v-else-if="store.currentStep === 4 || store.currentStep === 5" class="w-6 h-6" />
            <div>
              <CardTitle>
                <span v-if="store.currentStep === 1">Personal Information</span>
                <span v-else-if="store.currentStep === 2">Income Details</span>
                <span v-else-if="store.currentStep === 3">Phone Selection</span>
                <span v-else-if="store.currentStep === 4">Review & Submit</span>
                <span v-else-if="store.currentStep === 5">Thank You!</span>
              </CardTitle>
              <CardDescription class="text-yellow-100">
                Step {{ store.currentStep }} of 5
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent class="p-6 py-6 space-y-6">
          <component
            :is="currentStepComponent"
            :ref="(el) => {
              if (store.currentStep === 1) personalInfoRef = el;
              if (store.currentStep === 2) incomeDetailsRef = el;
              if (store.currentStep === 3) phoneSelectionRef = el;
              if (store.currentStep === 4) reviewAndSubmitRef = el;
              if (store.currentStep === 5) thankYouRef = el;
            }"
          />
        </CardContent>

        <Separator class="bg-yellow-200" />

        <div class="p-6 py-6 flex justify-between gap-4">
          <Button
            v-if="store.currentStep > 1 && store.currentStep < 5"
            @click="handleBack"
            variant="outline"
            class="border-yellow-400 text-yellow-400 hover:bg-yellow-50"
          >
            <ChevronLeft class="w-4 h-4 mr-2" />
            Back
          </Button>
          <div v-else></div>

          <Button
            v-if="store.currentStep < 5"
            @click="handleNext"
            :disabled="!isCurrentStepValid || store.status === 'SUBMITTING'"
            class="bg-gradient-to-r from-yellow-400 to-yellow-400 hover:from-yellow-500 hover:to-yellow-500"
          >
            {{ store.currentStep === 4 ? (store.status === 'SUBMITTING' ? 'Submitting...' : 'Submit Application') : 'Next' }}
            <ChevronRight v-if="store.currentStep < 4" class="w-4 h-4 ml-2" />
            <CheckCircle v-else class="w-4 h-4 ml-2" />
          </Button>
          <Button
            v-else-if="store.currentStep === 5"
            @click="resetApplication"
            class="w-full bg-gradient-to-r from-yellow-400 to-yellow-400 hover:from-yellow-500 hover:to-yellow-500"
          >
            Start New Application
          </Button>
        </div>
      </Card>
    </div>
  </div>
</template>