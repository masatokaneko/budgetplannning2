// src/types/master.ts
// マスタデータ関連の型定義

export type AccountType = 'INCOME' | 'EXPENSE' | 'ASSET' | 'LIABILITY' | 'EQUITY';
export type AccountCategory = 'OPERATING' | 'NON_OPERATING' | 'SPECIAL';
export type AccountStatus = 'ACTIVE' | 'INACTIVE';

export interface Account {
  id: number;
  code: string;
  name: string;
  type: AccountType;
  category: AccountCategory;
  status: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updatedBy: number;
  version: number;
  notes?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface AccountInput {
  code: string;
  name: string;
  type: AccountType;
  category: AccountCategory;
  notes?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface Vendor {
  vendor_id: string;
  vendor_code?: string;
  vendor_name: string;
  freee_aux_account_name?: string; // freee補助科目名との紐付け用
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: VendorAddress;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface VendorAddress {
  zipcode?: string;
  prefecture_name?: string;
  street_name1?: string; // 市区町村・町名
  street_name2?: string; // 建物名・部屋番号
}

export interface VendorInput {
  vendor_code?: string;
  vendor_name: string;
  freee_aux_account_name?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: VendorAddress;
  is_active?: boolean;
}

export interface FluctuationFactor {
  factor_id: string;
  factor_name: string;
  unit: string; // '人', '円', '件' など
  description?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface FluctuationFactorInput {
  factor_name: string;
  unit: string;
  description?: string;
  is_active?: boolean;
}

export interface FactorForecast {
  forecast_id: string;
  factor_id: string;
  year_month: string; // YYYYMM形式
  forecast_value: number;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface FactorForecastInput {
  factor_id: string;
  year_month: string;
  forecast_value: number;
}

export interface FactorForecastGrid {
  factor_id: string;
  factor_name: string;
  unit: string;
  monthly_forecasts: MonthlyForecast[];
  annual_average: number;
}

export interface MonthlyForecast {
  month: number;
  year_month: string;
  forecast_value: number;
  is_estimated: boolean; // 推定値かどうか
}

export interface User {
  user_id: string;
  username: string;
  full_name: string;
  email?: string;
  role_id: string;
  last_login_at?: Date;
  is_active: boolean;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserInput {
  username: string;
  full_name: string;
  email?: string;
  role_id: string;
  password: string;
  is_active?: boolean;
}

export interface Role {
  role_id: string;
  role_name: string;
  description?: string;
  permissions: Permission[];
}

export interface Permission {
  permission_id: string;
  function_name: string;
  function_description: string;
  can_read: boolean;
  can_write: boolean;
  can_delete: boolean;
}

export interface SystemFunction {
  function_id: string;
  function_name: string;
  function_category: 'budget' | 'actual' | 'analysis' | 'master' | 'system';
  description: string;
}

// 定義済みのシステム機能
export const SYSTEM_FUNCTIONS = [
  'budget_create',
  'budget_edit',
  'budget_confirm',
  'budget_import',
  'actual_import',
  'actual_view',
  'analysis_view',
  'analysis_export',
  'master_account',
  'master_vendor',
  'master_factor',
  'master_user',
  'system_admin'
] as const;

export type SystemFunctionType = typeof SYSTEM_FUNCTIONS[number];

// 定義済みの役割
export const PREDEFINED_ROLES = [
  { role_name: 'CFO', description: '最高財務責任者' },
  { role_name: '経理担当', description: '経理担当者' },
  { role_name: 'システム管理者', description: 'システム管理者' }
] as const;

export interface MasterDataSummary {
  accounts: {
    total: number;
    active: number;
    cost_of_sales_count: number;
    selling_admin_count: number;
  };
  vendors: {
    total: number;
    active: number;
    with_freee_mapping: number;
  };
  factors: {
    total: number;
    active: number;
    with_forecasts: number;
  };
  users: {
    total: number;
    active: number;
    by_role: { [role_name: string]: number };
  };
}

export interface MasterValidationResult {
  is_valid: boolean;
  errors: MasterValidationError[];
  warnings: MasterValidationWarning[];
}

export interface MasterValidationError {
  entity_type: 'account' | 'vendor' | 'factor' | 'user';
  entity_id: string;
  field: string;
  error_type: 'required' | 'duplicate' | 'invalid_format' | 'reference_error';
  message: string;
}

export interface MasterValidationWarning {
  entity_type: 'account' | 'vendor' | 'factor' | 'user';
  entity_id: string;
  warning_type: 'unused' | 'incomplete' | 'deprecated';
  message: string;
}