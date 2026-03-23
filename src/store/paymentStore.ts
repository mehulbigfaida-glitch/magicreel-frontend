import { create } from "zustand";
import type { PlanType } from "./entitlementStore";
import { useEntitlementStore } from "./entitlementStore";

interface PaymentState {
  isPaid: boolean;

  completePayment: (plan: PlanType) => void;
  resetPayment: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  isPaid: false,

  completePayment: (plan) => {
    useEntitlementStore
      .getState()
      .setPlanAndCredits(plan);

    set({ isPaid: true });
  },

  resetPayment: () =>
    set({
      isPaid: false,
    }),
}));
