import { Account, Vendor, FluctuationFactor } from "@/types/master"

// ダミーデータ例
const dummyAccounts: Account[] = []
const dummyVendors: Vendor[] = []
const dummyFactors: FluctuationFactor[] = []

export const masterService = {
  getAccounts: async (): Promise<Account[]> => dummyAccounts,
  saveAccount: async (account: Account): Promise<void> => { dummyAccounts.push(account) },

  getVendors: async (): Promise<Vendor[]> => dummyVendors,
  saveVendor: async (vendor: Vendor): Promise<void> => { dummyVendors.push(vendor) },

  getFluctuationFactors: async (): Promise<FluctuationFactor[]> => dummyFactors,
  saveFluctuationFactor: async (factor: FluctuationFactor): Promise<void> => { dummyFactors.push(factor) },
} 