// src/types/analysis.ts
// 分析関連の型定義

export interface BudgetActualComparison {
    comparison_id: string;
    period_type: 'monthly' | 'quarterly' | 'annual' | 'custom';
    start_date: Date;
    end_date: Date;
    budget_version: string;
    comparison_data: ComparisonData[];
    summary: ComparisonSummary;
    generated_at: Date;
  }
  
  export interface ComparisonData {
    account_id: string;
    account_name: string;
    account_category: 'cost_of_sales' | 'selling_admin';
    vendor_id?: string;
    vendor_name?: string;
    budget_amount: number;
    actual_amount: number;
    variance_amount: number; // 差異額（実績 - 予算）
    variance_rate: number; // 差異率（差異額 / 予算額 * 100）
    achievement_rate: number; // 達成率（実績 / 予算 * 100）
    prior_year_actual?: number;
    prior_year_variance?: number;
    monthly_breakdown?: MonthlyComparison[];
  }
  
  export interface MonthlyComparison {
    month: number;
    year_month: string;
    budget_amount: number;
    actual_amount: number;
    variance_amount: number;
    variance_rate: number;
    cumulative_budget: number;
    cumulative_actual: number;
    cumulative_variance: number;
  }
  
  export interface ComparisonSummary {
    total_budget: number;
    total_actual: number;
    total_variance: number;
    total_variance_rate: number;
    cost_of_sales_summary: CategorySummary;
    selling_admin_summary: CategorySummary;
    largest_variances: VarianceHighlight[];
    achievement_metrics: AchievementMetrics;
  }
  
  export interface CategorySummary {
    budget_amount: number;
    actual_amount: number;
    variance_amount: number;
    variance_rate: number;
    account_count: number;
  }
  
  export interface VarianceHighlight {
    account_id: string;
    account_name: string;
    vendor_name?: string;
    variance_amount: number;
    variance_rate: number;
    variance_type: 'over_budget' | 'under_budget';
    impact_level: 'high' | 'medium' | 'low';
  }
  
  export interface AchievementMetrics {
    accounts_over_budget: number;
    accounts_under_budget: number;
    accounts_on_target: number; // 差異率が±5%以内
    average_achievement_rate: number;
    best_performing_account: string;
    worst_performing_account: string;
  }
  
  export interface AnalysisFilter {
    period_type: 'monthly' | 'quarterly' | 'annual' | 'custom';
    start_year_month?: string;
    end_year_month?: string;
    account_categories?: ('cost_of_sales' | 'selling_admin')[];
    account_ids?: string[];
    vendor_ids?: string[];
    variance_threshold?: number; // 差異率の閾値（%）
    show_only_variances?: boolean;
  }
  
  export interface TrendAnalysis {
    account_id: string;
    account_name: string;
    period_data: PeriodTrendData[];
    trend_metrics: TrendMetrics;
  }
  
  export interface PeriodTrendData {
    period: string; // YYYYMM or YYYYQ or YYYY
    budget_amount: number;
    actual_amount: number;
    variance_amount: number;
    variance_rate: number;
    moving_average_actual?: number;
  }
  
  export interface TrendMetrics {
    budget_trend: 'increasing' | 'decreasing' | 'stable';
    actual_trend: 'increasing' | 'decreasing' | 'stable';
    variance_trend: 'improving' | 'worsening' | 'stable';
    budget_growth_rate: number; // 月平均成長率
    actual_growth_rate: number;
    variance_volatility: number; // 差異の変動の大きさ
    correlation_coefficient: number; // 予算と実績の相関係数
  }
  
  export interface VendorAnalysis {
    vendor_id: string;
    vendor_name: string;
    total_budget: number;
    total_actual: number;
    total_variance: number;
    account_breakdown: VendorAccountBreakdown[];
    trend_analysis: VendorTrend;
    payment_pattern: PaymentPattern;
  }
  
  export interface VendorAccountBreakdown {
    account_id: string;
    account_name: string;
    budget_amount: number;
    actual_amount: number;
    variance_amount: number;
    percentage_of_vendor_total: number;
  }
  
  export interface VendorTrend {
    monthly_totals: MonthlyVendorTotal[];
    growth_rate: number;
    seasonality_index: number[];
  }
  
  export interface MonthlyVendorTotal {
    year_month: string;
    budget_amount: number;
    actual_amount: number;
    transaction_count: number;
  }
  
  export interface PaymentPattern {
    average_payment_amount: number;
    payment_frequency: number; // 月平均支払回数
    largest_payment: number;
    payment_concentration: number; // 支払の集中度（特定月への偏り）
  }
  
  export interface DrillDownData {
    level: 'summary' | 'category' | 'account' | 'vendor' | 'transaction';
    parent_id?: string;
    data: DrillDownItem[];
    breadcrumb: BreadcrumbItem[];
  }
  
  export interface DrillDownItem {
    id: string;
    name: string;
    budget_amount: number;
    actual_amount: number;
    variance_amount: number;
    variance_rate: number;
    has_children: boolean;
    children_count?: number;
  }
  
  export interface BreadcrumbItem {
    level: string;
    id: string;
    name: string;
  }
  
  export interface ReportExportData {
    report_type: 'budget_actual_comparison' | 'trend_analysis' | 'vendor_analysis' | 'detailed_breakdown';
    title: string;
    subtitle?: string;
    period: string;
    generated_by: string;
    generated_at: Date;
    filters_applied: AnalysisFilter;
    data: any; // 実際のレポートデータ
    charts?: ChartData[];
    summary_text?: string;
  }
  
  export interface ChartData {
    chart_type: 'bar' | 'line' | 'pie' | 'area';
    title: string;
    data: any[];
    config: ChartConfig;
  }
  
  export interface ChartConfig {
    x_axis?: string;
    y_axis?: string;
    color_scheme?: string[];
    show_legend?: boolean;
    show_grid?: boolean;
  }
  
  export interface AnalysisPreference {
    user_id: string;
    default_period_type: 'monthly' | 'quarterly' | 'annual';
    default_variance_threshold: number;
    favorite_accounts: string[];
    favorite_vendors: string[];
    dashboard_widgets: DashboardWidget[];
    notification_settings: NotificationSettings;
  }
  
  export interface DashboardWidget {
    widget_id: string;
    widget_type: 'kpi_card' | 'chart' | 'table' | 'alert';
    title: string;
    config: any;
    position: { x: number; y: number; width: number; height: number };
    is_visible: boolean;
  }
  
  export interface NotificationSettings {
    variance_alert_threshold: number; // この%を超える差異でアラート
    monthly_report_email: boolean;
    budget_exceeded_alert: boolean;
    large_transaction_alert: boolean;
    large_transaction_threshold: number;
  }

export type AnalysisStatus = 'DRAFT' | 'CONFIRMED' | 'REJECTED';

export interface AnalysisResult {
  id: number;
  fiscalYear: number;
  month: number;
  accountId: number;
  budgetAmount: number;
  actualAmount: number;
  variance: number;
  variancePercentage: number;
  type: 'INCOME' | 'EXPENSE';
  status: AnalysisStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updatedBy: number;
  version: number;
  notes?: string;
  tags?: string[];
  attachments?: string[];
  metadata?: Record<string, any>;
}