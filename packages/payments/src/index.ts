export interface BillingProvider {
  canCharge(): boolean;
}

export class DisabledBillingProvider implements BillingProvider {
  canCharge(): boolean {
    return false;
  }
}

export const billingProvider: BillingProvider = new DisabledBillingProvider();
