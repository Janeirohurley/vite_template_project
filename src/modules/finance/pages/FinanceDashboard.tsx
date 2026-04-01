import { useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Landmark,
  PieChart as PieIcon,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useFinanceOverview } from "../hooks/useFinanceOverview";
import { useAppStore } from "@/lib";

const CHART_COLORS = ["#1d4ed8", "#0ea5e9", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

const emptyOverview = {
  academic_year: null,
  kpis: {
    total_expected: 0,
    total_collected: 0,
    outstanding: 0,
    recovery_rate: 0,
    overdue_installments_count: 0,
    pending_payments_amount: 0,
    verified_payments_count: 0,
    unverified_payments_count: 0,
  },
  trends: {
    period: "monthly",
    monthly_collections: [],
    monthly_expected: [],
    monthly_summary: [],
    monthly_outstanding: [],
    monthly_recovery_rate: [],
    cumulative_collections: [],
  },
  breakdowns: { by_faculty: [], by_payment_method: [] },
  recent_payments: [],
  assets: {
    buildings_count: 0,
    rooms_count: 0,
    rooms_available_count: 0,
    rooms_by_type: [],
    equipment_total: 0,
    equipment_by_status: [],
    equipment_under_maintenance_count: 0,
    equipment_allocations_active_count: 0,
  },
};

const formatBif = (value: number | string) => {
  const amount = Number(value ?? 0);
  return `${amount.toLocaleString()} BIF`;
};

const formatPercent = (value: number | string) => `${Number(value ?? 0).toFixed(2)}%`;

export default function FinanceDashboard() {
  const { selectedAcademicYear, theme } = useAppStore();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const { data, isLoading } = useFinanceOverview({
    academic_year_id: selectedAcademicYear?.id,
    period,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
  });

  const overview = data || emptyOverview;
  const kpisData = overview?.kpis ?? emptyOverview.kpis;
  const trendsData = overview?.trends ?? emptyOverview.trends;
  const breakdownsData = overview?.breakdowns ?? emptyOverview.breakdowns;
  const assetsData = overview?.assets ?? emptyOverview.assets;
  const recentPayments = overview?.recent_payments ?? [];

  const isDark = theme === "dark";
  const chartGridColor = isDark ? "rgba(148,163,184,0.2)" : "#e2e8f0";
  const chartTickColor = isDark ? "#cbd5e1" : "#64748b";

  const tooltipStyles = {
    contentStyle: {
      backgroundColor: isDark ? "#0f172a" : "#ffffff",
      border: `1px solid ${isDark ? "#1f2937" : "#e2e8f0"}`,
      borderRadius: "12px",
      boxShadow: isDark
        ? "0 12px 30px rgba(0,0,0,0.35)"
        : "0 10px 25px rgba(15, 23, 42, 0.08)",
    },
    labelStyle: {
      color: isDark ? "#e2e8f0" : "#0f172a",
      fontWeight: 600,
    },
    itemStyle: {
      color: isDark ? "#cbd5e1" : "#334155",
      fontSize: "12px",
    },
    cursor: {
      stroke: isDark ? "#334155" : "#cbd5e1",
      strokeDasharray: "3 3",
    },
  };

  const kpis = useMemo(
    () => [
      {
        label: "Total attendu",
        value: kpisData.total_expected,
        icon: Wallet,
      },
      {
        label: "Total encaissé",
        value: kpisData.total_collected,
        icon: TrendingUp,
      },
      {
        label: "Reste à percevoir",
        value: kpisData.outstanding,
        icon: BarChart3,
      },
      {
        label: "Taux recouvrement",
        value: formatPercent(kpisData.recovery_rate),
        icon: CheckCircle2,
      },
    ],
    [kpisData]
  );

  const monthlySummary =
    trendsData.monthly_summary && trendsData.monthly_summary.length > 0
      ? trendsData.monthly_summary
      : [{ month: "-", expected: 0, collected: 0, outstanding: 0, recovery_rate: 0 }];

  const monthlyOutstanding =
    trendsData.monthly_outstanding && trendsData.monthly_outstanding.length > 0
      ? trendsData.monthly_outstanding
      : [{ month: "-", amount: 0 }];

  const monthlyRecoveryRate =
    trendsData.monthly_recovery_rate && trendsData.monthly_recovery_rate.length > 0
      ? trendsData.monthly_recovery_rate
      : [{ month: "-", rate: 0 }];

  const cumulativeCollections =
    trendsData.cumulative_collections && trendsData.cumulative_collections.length > 0
      ? trendsData.cumulative_collections
      : [{ month: "-", collected: 0, expected: 0, outstanding: 0 }];

  const recoveryLabel = Number(kpisData.recovery_rate ?? 0) >= 100 ? "Sur objectif" : "En progression";
  const periodLabel = period === "daily" ? "Daily" : period === "weekly" ? "Weekly" : "Monthly";

  const handleCyclePeriod = () => {
    setPeriod((prev) => {
      if (prev === "daily") return "weekly";
      if (prev === "weekly") return "monthly";
      return "daily";
    });
  };

  const resetFilters = () => {
    setPeriod("monthly");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="font-dashboard min-h-screen bg-slate-50 text-slate-900 dark:text-slate-100 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Dashboard</p>
            <h1 className="text-2xl font-semibold mt-2">Finance & Patrimoine</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Vue exécutive des flux financiers et du patrimoine matériel</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-sm">
              {overview.academic_year?.label || selectedAcademicYear?.academic_year || "N/A"}
            </div>
            <button
              onClick={() => setFiltersOpen((prev) => !prev)}
              className="rounded-md border border-slate-200 dark:border-slate-700 dark:bg-slate-900/50 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm"
            >
              Filter
            </button>
            <button
              onClick={handleCyclePeriod}
              className="rounded-md border border-slate-200 dark:border-slate-700 dark:bg-slate-900/50 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 shadow-sm"
            >
              {periodLabel}
            </button>
            <button
              onClick={resetFilters}
              className="rounded-md bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm dark:bg-blue-500"
            >
              Manage
            </button>
          </div>
        </div>

        {filtersOpen && (
          <div className="mt-4 rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="text-[11px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Date d\u00e9but
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="mt-2 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-700 dark:text-slate-200"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Date fin
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="mt-2 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-700 dark:text-slate-200"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  P\u00e9riode
                </label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as "daily" | "weekly" | "monthly")}
                  className="mt-2 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-700 dark:text-slate-200"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="py-16 text-center text-slate-500 dark:text-slate-400 text-sm">Chargement du dashboard...</div>
        )}

        {!isLoading && (
          <>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {kpis.map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-widest text-slate-400 dark:text-slate-500">{kpi.label}</p>
                      <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mt-2">
                        {typeof kpi.value === "number" ? formatBif(kpi.value) : kpi.value}
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <kpi.icon size={18} className="text-slate-600 dark:text-slate-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4">
              <div className="rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-4 shadow-sm">
                <p className="text-[11px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Impayés</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-2">{kpisData.overdue_installments_count}</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-4 shadow-sm">
                <p className="text-[11px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Paiements en attente</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-2">
                  {formatBif(kpisData.pending_payments_amount)}
                </p>
              </div>
              <div className="rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-4 shadow-sm">
                <p className="text-[11px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Vérifiés</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-2">{kpisData.verified_payments_count}</p>
              </div>
              <div className="rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-4 shadow-sm">
                <p className="text-[11px] uppercase tracking-widest text-slate-400 dark:text-slate-500">Non vérifiés</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 mt-2">{kpisData.unverified_payments_count}</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Encaissements mensuels</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{recoveryLabel}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setFiltersOpen((prev) => !prev)}
                      className="rounded-md border border-slate-200 dark:border-slate-700 dark:bg-slate-900/50 px-3 py-1 text-[11px] text-slate-500 dark:text-slate-300"
                    >
                      Filter
                    </button>
                    <button
                      onClick={resetFilters}
                      className="rounded-md border border-slate-200 dark:border-slate-700 dark:bg-slate-900/50 px-3 py-1 text-[11px] text-slate-500 dark:text-slate-300"
                    >
                      Manage
                    </button>
                  </div>
                </div>
                <div className="h-72 mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlySummary}>
                      <defs>
                        <linearGradient id="financeArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                      <XAxis dataKey="month" fontSize={10} tick={{ fill: chartTickColor }} axisLine={{ stroke: chartTickColor }} tickLine={{ stroke: chartGridColor }} />
                      <YAxis fontSize={10} tick={{ fill: chartTickColor }} axisLine={{ stroke: chartTickColor }} tickLine={{ stroke: chartGridColor }} />
                      <Tooltip contentStyle={tooltipStyles.contentStyle} labelStyle={tooltipStyles.labelStyle} itemStyle={tooltipStyles.itemStyle} cursor={tooltipStyles.cursor} />
                      <Area type="monotone" dataKey="collected" stroke="#2563eb" fill="url(#financeArea)" strokeWidth={3} />
                      <Area type="monotone" dataKey="expected" stroke="#94a3b8" fill="transparent" strokeWidth={2} strokeDasharray="4 4" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm">
                <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <Landmark size={16} />
                  <h3 className="text-sm font-semibold">Patrimoine matériel</h3>
                </div>
                <div className="mt-5 space-y-4 text-sm text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Bâtiments</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{assetsData.buildings_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Salles</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{assetsData.rooms_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Salles disponibles</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{assetsData.rooms_available_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Équipements</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{assetsData.equipment_total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>En maintenance</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{assetsData.equipment_under_maintenance_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Allocations actives</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{assetsData.equipment_allocations_active_count}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Reste \u00e0 recouvrer</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Evolution mensuelle des impay\u00e9s</p>
                <div className="h-56 mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyOutstanding}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                      <XAxis dataKey="month" fontSize={10} tick={{ fill: chartTickColor }} axisLine={{ stroke: chartTickColor }} tickLine={{ stroke: chartGridColor }} />
                      <YAxis fontSize={10} tick={{ fill: chartTickColor }} axisLine={{ stroke: chartTickColor }} tickLine={{ stroke: chartGridColor }} />
                      <Tooltip contentStyle={tooltipStyles.contentStyle} labelStyle={tooltipStyles.labelStyle} itemStyle={tooltipStyles.itemStyle} cursor={tooltipStyles.cursor} />
                      <Line type="monotone" dataKey="amount" stroke="#f97316" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Taux de recouvrement</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Pourcentage encaiss\u00e9 vs attendu</p>
                <div className="h-56 mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyRecoveryRate}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                      <XAxis dataKey="month" fontSize={10} tick={{ fill: chartTickColor }} axisLine={{ stroke: chartTickColor }} tickLine={{ stroke: chartGridColor }} />
                      <YAxis fontSize={10} tick={{ fill: chartTickColor }} axisLine={{ stroke: chartTickColor }} tickLine={{ stroke: chartGridColor }} />
                      <Tooltip contentStyle={tooltipStyles.contentStyle} labelStyle={tooltipStyles.labelStyle} itemStyle={tooltipStyles.itemStyle} cursor={tooltipStyles.cursor} />
                      <Line type="monotone" dataKey="rate" stroke="#22c55e" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Cumul annuel</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Progression vs objectif annuel</p>
                <div className="h-56 mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={cumulativeCollections}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                      <XAxis dataKey="month" fontSize={10} tick={{ fill: chartTickColor }} axisLine={{ stroke: chartTickColor }} tickLine={{ stroke: chartGridColor }} />
                      <YAxis fontSize={10} tick={{ fill: chartTickColor }} axisLine={{ stroke: chartTickColor }} tickLine={{ stroke: chartGridColor }} />
                      <Tooltip contentStyle={tooltipStyles.contentStyle} labelStyle={tooltipStyles.labelStyle} itemStyle={tooltipStyles.itemStyle} cursor={tooltipStyles.cursor} />
                      <Line type="monotone" dataKey="collected" stroke="#2563eb" strokeWidth={3} />
                      <Line type="monotone" dataKey="expected" stroke="#94a3b8" strokeWidth={2} strokeDasharray="4 4" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm lg:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Par faculté</h3>
                <div className="h-64 mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={breakdownsData.by_faculty}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                      <XAxis dataKey="name" fontSize={9} tick={{ fill: chartTickColor }} axisLine={{ stroke: chartTickColor }} tickLine={{ stroke: chartGridColor }} />
                      <YAxis fontSize={10} tick={{ fill: chartTickColor }} axisLine={{ stroke: chartTickColor }} tickLine={{ stroke: chartGridColor }} />
                      <Tooltip contentStyle={tooltipStyles.contentStyle} labelStyle={tooltipStyles.labelStyle} itemStyle={tooltipStyles.itemStyle} cursor={tooltipStyles.cursor} />
                      <Bar dataKey="collected" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm">
                <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  <PieIcon size={16} />
                  <h3 className="text-sm font-semibold">Méthodes de paiement</h3>
                </div>
                <div className="h-64 mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={breakdownsData.by_payment_method}
                        dataKey="amount"
                        nameKey="method"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={6}
                      >
                        {breakdownsData.by_payment_method.map((_, index) => (
                          <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyles.contentStyle} labelStyle={tooltipStyles.labelStyle} itemStyle={tooltipStyles.itemStyle} cursor={tooltipStyles.cursor} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-md border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Paiements récents</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Dernières transactions validées ou en attente</p>
                </div>
                <button className="rounded-md border border-slate-200 dark:border-slate-700 dark:bg-slate-900/50 px-3 py-1 text-[11px] text-slate-500 dark:text-slate-300">
                  Voir tout
                </button>
              </div>
              <div className="mt-6 divide-y divide-slate-100 dark:divide-slate-800">
                {recentPayments.map((p) => (
                  <div key={p.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{p.student_name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{p.matricule}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-emerald-600">{formatBif(p.amount)}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        {new Date(p.date).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                ))}
                {recentPayments.length === 0 && (
                  <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-sm">Aucun paiement récent</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
