// stores/loanApplication.ts
import { defineStore } from 'pinia';
import { useSupabaseClient } from '#imports';

interface Phone {
  id: number;
  model_name: string;
  cash_price: number;
  deposit_percent: number;
  annual_interest_rate: number;
}

interface LoanApplicationState {
  currentStep: number;
  full_name: string;
  sa_id_number: string;
  birthday: string | null;
  monthly_income: number | null;
  proof_document_name: string | null;
  selected_phone_id: number | null;
  loan_principal: number | null;
  total_loan_amount: number | null;
  daily_payment: number | null;
  status: 'PENDING' | 'SUBMITTING' | 'SUBMITTED' | 'ERROR';
  availablePhones: Phone[];
  existingApplicationId: number | null; // New state variable
}

// Helper function for Luhn algorithm
function isValidLuhn(value: string): boolean {
  let sum = 0;
  let parity = value.length % 2;
  for (let i = 0; i < value.length; i++) {
    let digit = parseInt(value[i]);
    if (i % 2 === parity) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
  }
  return sum % 10 === 0;
}

// Helper to extract birth date and gender from SA ID
function extractSaIdInfo(saId: string) {
  if (!saId || saId.length !== 13 || !/^\d+$/.test(saId)) {
    return { birthDate: null, gender: null };
  }

  const yearPrefix = parseInt(saId.substring(0, 2)) < new Date().getFullYear() % 100 ? '20' : '19';
  const year = yearPrefix + saId.substring(0, 2);
  const month = saId.substring(2, 4);
  const day = saId.substring(4, 6);

  const birthDate = `${year}-${month}-${day}`;
  const genderDigit = parseInt(saId.substring(6, 10));
  const gender = genderDigit >= 5000 ? 'Male' : 'Female';

  // Basic date validation
  const date = new Date(birthDate);
  if (isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== birthDate) {
    return { birthDate: null, gender: null };
  }

  return { birthDate, gender };
}


export const useLoanApplicationStore = defineStore('loanApplication', {
  state: (): LoanApplicationState => ({
    currentStep: 1,
    full_name: '',
    sa_id_number: '',
    birthday: null,
    monthly_income: null,
    proof_document_name: null,
    selected_phone_id: null,
    loan_principal: null,
    total_loan_amount: null,
    daily_payment: null,
    status: 'PENDING',
    availablePhones: [],
    existingApplicationId: null, // Initialize new state variable
  }),
  getters: {
    applicantAge(): number | null {
      if (!this.birthday) return null;
      const birthDate = new Date(this.birthday);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    },
    isSaIdValid(): boolean {
      if (!this.sa_id_number || this.sa_id_number.length !== 13 || !/^\d+$/.test(this.sa_id_number)) {
        return false;
      }
      const { birthDate } = extractSaIdInfo(this.sa_id_number);
      if (!birthDate) return false;
      return isValidLuhn(this.sa_id_number);
    },
    isAgeValid(): boolean {
      const age = this.applicantAge;
      return age !== null && age >= 18 && age <= 65;
    },
    riskProfile(): { deposit: number; interest: number } | null {
      const age = this.applicantAge;
      if (age === null) return null;

      if (age >= 18 && age <= 30) {
        return { deposit: 0.10, interest: 0.20 };
      } else if (age >= 31 && age <= 50) {
        return { deposit: 0.15, interest: 0.18 };
      } else if (age >= 51 && age <= 65) {
        return { deposit: 0.20, interest: 0.22 };
      }
      return null;
    },
    selectedPhone(): Phone | undefined {
      return this.availablePhones.find(phone => phone.id === this.selected_phone_id);
    },
    loanPrincipal(): number | null {
      const phone = this.selectedPhone;
      const risk = this.riskProfile;
      if (!phone || !risk) return null;
      return phone.cash_price * (1 - risk.deposit);
    },
    totalLoanAmount(): number | null {
      const principal = this.loanPrincipal;
      const risk = this.riskProfile;
      if (principal === null || !risk) return null;
      return principal * (1 + risk.interest);
    },
    dailyPayment(): number | null {
      const totalAmount = this.totalLoanAmount;
      if (totalAmount === null) return null;
      return totalAmount / 360;
    },
    monthlyPrice(): number | null {
      const dailyPayment = this.dailyPayment;
      if (dailyPayment === null) return null;
      return dailyPayment * 30;
    },
    getPhoneLoanDetails: (state) => (phone: Phone) => {
      const risk = state.riskProfile;
      if (!phone || !risk) return null;

      const loanPrincipal = phone.cash_price * (1 - risk.deposit);
      const totalLoanAmount = loanPrincipal * (1 + risk.interest);
      const dailyPayment = totalLoanAmount / 360;
      const monthlyPrice = dailyPayment * 30;

      return { loanPrincipal, totalLoanAmount, dailyPayment, monthlyPrice };
    },
    affordablePhones(): Phone[] {
      if (!this.monthly_income || this.monthly_income <= 0) return [];
      const affordabilityThreshold = this.monthly_income / 10;

      return this.availablePhones.filter(phone => {
        const phoneDetails = this.getPhoneLoanDetails(phone);
        if (!phoneDetails) return false;

        return this.monthly_income > (10 * phoneDetails.monthlyPrice);
      });
    }
  },
  actions: {
    async fetchPhoneModels() {
      const supabase = useSupabaseClient();
      const { data, error } = await supabase
        .from('phone_models')
        .select('*');

      if (error) {
        console.error('Error fetching phone models:', error);
        this.availablePhones = [];
      } else {
        this.availablePhones = data as Phone[];
      }
    },
    async checkExistingApplication(saIdNumber: string) {
      const supabase = useSupabaseClient();
      
      const { data, error } = await supabase
        .from('loan_applications')
        .select('id')
        .eq('sa_id_number', saIdNumber)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error('loanApplication: Error checking existing application:', error);
        this.existingApplicationId = null;
      } else if (data) {
        this.existingApplicationId = data.id;
        
      } else {
        this.existingApplicationId = null;
        
      }
    },
    async setPersonalInformation(fullName: string, saIdNumber: string) {
      this.full_name = fullName;
      this.sa_id_number = saIdNumber;

      const { birthDate } = extractSaIdInfo(saIdNumber);
      this.birthday = birthDate;

      
      
      
      
      
      

      // Only check for existing application if the SA ID is potentially valid
      if (this.sa_id_number.length === 13 && /^\d+$/.test(this.sa_id_number)) {
        if (this.isSaIdValid && this.isAgeValid) {
          await this.checkExistingApplication(saIdNumber); // Await the async call
        } else {
          this.existingApplicationId = null;
        }
      } else {
        this.existingApplicationId = null;
      }
      
      
    },
    setMonthlyIncome(income: number) {
      this.monthly_income = income;
    },
    setProofDocumentName(fileName: string) {
      this.proof_document_name = fileName;
    },
    setSelectedPhone(phoneId: number) {
      this.selected_phone_id = phoneId;
      this.loan_principal = this.loanPrincipal;
      this.total_loan_amount = this.totalLoanAmount;
      this.daily_payment = this.dailyPayment;
    },
    nextStep() {
      this.currentStep++;
    },
    prevStep() {
      this.currentStep--;
    },
    async submitApplication() {
      const supabase = useSupabaseClient();
      this.status = 'SUBMITTING';

      const payload = {
        full_name: this.full_name,
        sa_id_number: this.sa_id_number,
        birthday: this.birthday,
        monthly_income: this.monthly_income,
        phone_id: this.selected_phone_id,
        loan_principal: this.loan_principal,
        total_loan_amount: this.total_loan_amount,
        daily_payment: this.daily_payment,
        status: 'PENDING',
      };

      let query;
      if (this.existingApplicationId) {
        // Update existing application
        query = supabase
          .from('loan_applications')
          .update(payload)
          .eq('id', this.existingApplicationId);
      } else {
        // Insert new application
        query = supabase
          .from('loan_applications')
          .insert([payload]);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error submitting application:', error);
        this.status = 'ERROR';
      } else {
        
        this.status = 'SUBMITTED';
        this.existingApplicationId = null; // Clear existing ID after successful submission/override
      }
    },
    resetForm() {
      this.$reset();
      this.currentStep = 1;
      this.status = 'PENDING';
      this.availablePhones = [];
      this.existingApplicationId = null; // Reset existing application ID
    }
  },
});
