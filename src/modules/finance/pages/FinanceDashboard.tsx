import { useMemo } from "react";
import { 
  Wallet, TrendingUp, BarChart3, CheckCircle, 
  AlertCircle, Landmark, Clock, ArrowUpRight
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar 
} from "recharts";
import { usePaymentInstallments } from "../hooks/useInstallments";
import { useAppStore } from "@/lib";
import { StatsCard } from "@/modules/doyen";
import { PageHeader } from "@/modules/admin/components/PageHeader";
import { Badge } from "@/components/ui/badge";

export default function FinanceDashboard() {
  const { selectedAcademicYear, theme } = useAppStore();
  const { installments } = usePaymentInstallments({
    academic_year_id: selectedAcademicYear?.id,
    page_size: 1000, // On récupère un large set pour les stats globales
  });

  const isDark = theme === "dark";
  const chartGridColor = isDark ? "rgba(255,255,255,0.08)" : "#f8fafc";
  const chartTickColor = isDark ? "#94a3b8" : "#94a3b8";
  const chartTooltipStyle = {
    borderRadius: "12px",
    border: isDark ? "1px solid rgba(255,255,255,0.12)" : "none",
    backgroundColor: isDark ? "#111827" : "#ffffff",
    boxShadow: isDark
      ? "0 10px 15px -3px rgba(0,0,0,0.45)"
      : "0 10px 15px -3px rgba(0,0,0,0.1)",
  };
  const chartTooltipLabelStyle = { color: isDark ? "#e5e7eb" : "#111827" };
  const chartTooltipItemStyle = { color: isDark ? "#cbd5e1" : "#334155" };
  const chartCursorFill = isDark ? "rgba(255,255,255,0.06)" : "#f8fafc";

  // --- 1. CALCULS DES KPI (STATS DU HAUT) ---
  const stats = useMemo(() => {
    const totalAttendu = installments.reduce((acc, curr) => acc + Number(curr.financial_info?.amount || 0), 0);
    const totalEncaisse = installments.reduce((acc, curr) => acc + Number(curr.financial_info?.paid_amount || 0), 0);
    const enRetard = installments.filter(i => i.status_info?.is_overdue).length;
    const soldes = installments.filter(i => (i.financial_info?.completion_percentage || 0) >= 100).length;

    const formatM = (val: number) => (val / 1000000).toFixed(2) + "M";

    return {
      totalAttendu: formatM(totalAttendu),
      totalEncaisse: formatM(totalEncaisse),
      reste: formatM(totalAttendu - totalEncaisse),
      soldes,
      enRetard
    };
  }, [installments]);

  // --- 2. EXTRACTION RÉELLE DES FACULTÉS POUR LES GRAPHIQUES ---
  const facultyChartData = useMemo(() => {
    const map: Record<string, { name: string, paye: number, impaye: number }> = {};

    installments.forEach(item => {
      const facName = item.class_info?.faculty || "AUTRES";
      if (!map[facName]) map[facName] = { name: facName, paye: 0, impaye: 0 };
      
      map[facName].paye += Number(item.financial_info?.paid_amount || 0);
      map[facName].impaye += Number(item.financial_info?.remaining_amount || 0);
    });

    const data = Object.values(map);
    const pieData = data.map(d => ({ name: d.name, value: d.paye }));
    const barData = data.map(d => ({ name: d.name.substring(0, 10), value: d.impaye })); // On tronque le nom pour l'affichage

    return { pieData, barData };
  }, [installments]);

  // --- 3. OPÉRATIONS RÉCENTES (Triées par date de création) ---
  const recentOperations = useMemo(() => {
    return [...installments]
      .sort((a, b) => {
        const aDate = new Date(a.metadata?.created_at || a.dates?.last_payment_date || a.dates?.due_date || 0).getTime();
        const bDate = new Date(b.metadata?.created_at || b.dates?.last_payment_date || b.dates?.due_date || 0).getTime();
        return bDate - aDate;
      })
      .slice(0, 5); // Les 5 derniers
  }, [installments]);

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div>

      <PageHeader
        title="UMS Finance"
        description={`Données temps réel • ${selectedAcademicYear?.academic_year || "N/A"}`}
        rightElement={
          <Badge className="bg-blue-50 text-blue-700 border-blue-100 font-bold">
            {selectedAcademicYear?.academic_year || "N/A"}
          </Badge>
        }
      />

      {/* GRILLE KPI (LIGNE 1) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatsCard label="Total Attendu" value={stats.totalAttendu} icon={Wallet} color="blue" />
        <StatsCard label="Total Encaissé" value={stats.totalEncaisse} icon={TrendingUp} color="emerald" />
        <StatsCard label="Reste à Percevoir" value={stats.reste} icon={BarChart3} color="orange" />
        <StatsCard label="Soldés (100%)" value={String(stats.soldes)} icon={CheckCircle} color="emerald" />
      </div>

      {/* GRILLE SECONDAIRE (LIGNE 2) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatsCard label="En Retard" value={String(stats.enRetard)} icon={AlertCircle} color="red" />
        <div className="md:col-span-1">
            <StatsCard label="Banques Actives" value="3" icon={Landmark} color="indigo" />
        </div>
      </div>

      {/* SECTION GRAPHIQUES RECHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        
        {/* ÉVOLUTION (LineChart) */}
        <div className="bg-white dark:bg-bg-card p-6 rounded-xl border border-slate-100 dark:border-white/10 shadow-sm transition-hover hover:shadow-md">
          <h3 className="text-[11px] font-black text-slate-400 uppercase mb-8 tracking-widest flex items-center gap-2">
            <TrendingUp size={14} className="text-blue-500" /> Évolution des paiements
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[{name: 'Jan', v: 400}, {name: 'Fév', v: 1200}, {name: 'Mar', v: 900}]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} tick={{fill: chartTickColor}} />
                <YAxis hide />
                <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} itemStyle={chartTooltipItemStyle} cursor={{ fill: chartCursorFill }} />
                <Line type="monotone" dataKey="v" stroke="#2563eb" strokeWidth={4} dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* REPARTITION FACULTÉS (PieChart Dynamique) */}
        <div className="bg-white dark:bg-bg-card p-6 rounded-xl border border-slate-100 dark:border-white/10 shadow-sm">
          <h3 className="text-[11px] font-black text-slate-400 uppercase mb-8 tracking-widest flex items-center gap-2">
            <CheckCircle size={14} className="text-emerald-500" /> Paiements par Faculté
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={facultyChartData.pieData} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                  {facultyChartData.pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} itemStyle={chartTooltipItemStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* IMPAYÉS (BarChart Dynamique) */}
        <div className="bg-white dark:bg-bg-card p-6 rounded-xl border border-slate-100 dark:border-white/10 shadow-sm">
          <h3 className="text-[11px] font-black text-slate-400 uppercase mb-8 tracking-widest flex items-center gap-2">
            <AlertCircle size={14} className="text-rose-500" /> Impayés par Faculté
          </h3>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={facultyChartData.barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={chartGridColor} />
                <XAxis dataKey="name" fontSize={9} axisLine={false} tickLine={false} tick={{fill: chartTickColor}} />
                <YAxis hide />
                <Tooltip contentStyle={chartTooltipStyle} labelStyle={chartTooltipLabelStyle} itemStyle={chartTooltipItemStyle} cursor={{ fill: chartCursorFill }} />
                <Bar dataKey="value" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* SECTION OPÉRATIONS RÉCENTES */}
      <div className="bg-white dark:bg-bg-card rounded-xl border border-slate-100 dark:border-white/10 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 dark:border-white/10 flex justify-between items-center bg-slate-50/30 dark:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Clock size={18} />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Opérations de paiement récentes</h3>
          </div>
          <button className="text-[10px] font-black text-blue-600 uppercase tracking-tighter hover:underline">Voir tout</button>
        </div>
        <div className="divide-y divide-slate-50 dark:divide-white/10">
          {recentOperations.map((op, idx) => (
            <div key={idx} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {op.student?.name?.charAt(0)}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-900 uppercase">{op.student?.name}</p>
                  <p className="text-[9px] text-slate-400 font-medium">
                    {op.payment_plan?.wording} • {new Date(op.metadata?.created_at || op.dates?.last_payment_date || op.dates?.due_date || 0).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                 <div className="text-right">
                    <p className="text-[11px] font-black text-emerald-600">+{Number(op.financial_info?.paid_amount).toLocaleString()} Fbu</p>
                    <p className="text-[8px] text-slate-400 uppercase font-bold tracking-tighter">{op.status_info?.status_display}</p>
                 </div>
                 <ArrowUpRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          ))}
          {recentOperations.length === 0 && (
            <div className="p-10 text-center text-slate-400 text-xs ">Aucune opération récente trouvée</div>
          )}
        </div>
      </div>
    </div>
  );
}