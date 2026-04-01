import { useState, useMemo, type FormEvent, type ReactNode } from "react";
import { usePaymentPromises } from "../hooks/usePaymentPromises";
import type { EnrichedPaymentPromise } from "../types/paymentPromise";
import { 
  Search, Plus, CheckCircle2, 
  XCircle, Clock, ArrowUpRight, 
  DollarSign} from "lucide-react";

// --- COMPOSANT PRINCIPAL ---
export default function PaymentPromisesPage() {
  const { promises, studentOptions, loading, createPromise, updateStatus } = usePaymentPromises();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ student: "", promised_amount: "", promised_date: "" });

  // Correction : useMemo est bien défini ici grâce à l'import ligne 1
  const filteredPromises = useMemo(() => {
    return promises.filter((p: EnrichedPaymentPromise) => {
      const searchStr = `${p.student_detail.full_name} ${p.student_detail.matricule} ${p.student_detail.class_name || ""}`.toLowerCase();
      const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [promises, searchTerm, statusFilter]);

  // Correction : calcul des stats optimisé
  const stats = useMemo(() => ({
    pending: promises.filter((p) => p.status === 'pending').length,
    broken: promises.filter((p) => p.status === 'broken').length,
    total: promises.reduce((acc: number, p) => acc + Number(p.promised_amount), 0)
  }), [promises]);

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.student || !formData.promised_date || !formData.promised_amount) {
      return;
    }

    try {
      await createPromise.mutateAsync({
        student: formData.student,
        promised_date: formData.promised_date,
        promised_amount: Number(formData.promised_amount),
      });
      setIsModalOpen(false);
      setFormData({ student: "", promised_amount: "", promised_date: "" });
    } catch {
      alert("Erreur lors de l'enregistrement");
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center ">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">Chargement des engagements...</p>
    </div>
  );

  return (
    <div>
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 font-black uppercase text-[10px] tracking-[0.3em]">
            <DollarSign size={14} /> Recouvrement Trésorerie
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase  tracking-tighter leading-none text-slate-900">
            Suivi des <span className="text-transparent" style={{ WebkitTextStroke: '1px #4f46e5' }}>Promesses</span>
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-4xl shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 font-black uppercase text-[10px] tracking-[0.2em]"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> 
          Nouvelle Promesse
        </button>
      </div>

      {/* STATS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard label="En Attente" value={stats.pending} color="indigo" icon={<Clock size={24}/>} />
        <StatCard label="Non Respectées" value={stats.broken} color="rose" icon={<XCircle size={24}/>} />
        <StatCard label="Volume Global" value={`${stats.total.toLocaleString()} BIF`} color="emerald" icon={<ArrowUpRight size={24}/>} />
      </div>

      {/* RECHERCHE */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row gap-4">
        <div className="relative flex-2 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher un étudiant, matricule ou classe..."
            className="w-full pl-16 pr-8 py-6 bg-white shadow-sm border-2 border-transparent rounded-4xl outline-none focus:border-indigo-100 focus:shadow-xl font-bold text-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="flex-1 bg-white shadow-sm border-2 border-transparent px-8 py-6 rounded-4xl outline-none font-black text-[10px] uppercase tracking-widest text-slate-500 cursor-pointer focus:border-indigo-100 transition-all appearance-none"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="kept">Respectées</option>
          <option value="broken">Non respectées</option>
        </select>
      </div>

      {/* TABLEAU */}
      <div className="max-w-7xl mx-auto bg-white rounded-[3rem] shadow-xl border border-slate-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-8 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Étudiant & Classe</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Engagement</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Échéance</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Statut</th>
                <th className="px-10 py-8 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPromises.map((p) => (
                <tr key={p.id} className="group hover:bg-indigo-50/30 transition-all">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-400 group-hover:bg-white group-hover:text-indigo-600 transition-all shadow-sm">
                        {p.student_detail.full_name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-black text-slate-900 text-sm uppercase tracking-tight">{p.student_detail.full_name}</div>
                        <div className="flex items-center gap-2 mt-0.5 font-bold text-slate-400 text-[10px]">
                           {p.student_detail.matricule} • {p.student_detail.class_name || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="font-black text-slate-900 text-base ">
                      {Number(p.promised_amount).toLocaleString()} BIF
                    </div>
                  </td>
                  <td className="px-10 py-6 text-slate-500 font-bold text-xs">
                    {new Date(p.promised_date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <ActionButton icon={<CheckCircle2 size={18}/>} color="emerald" onClick={() => updateStatus.mutate({ id: p.id, status: 'kept' })} />
                      <ActionButton icon={<XCircle size={18}/>} color="rose" onClick={() => updateStatus.mutate({ id: p.id, status: 'broken' })} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-xl rounded-[3.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
             {/* Formulaire ici (identique au précédent mais sécurisé par l'import) */}
             <form onSubmit={handleCreate} className="space-y-6">
               <h2 className="text-3xl font-black uppercase  tracking-tighter">Nouvelle <span className="text-indigo-600">Promesse</span></h2>
               <select 
                className="w-full bg-slate-50 p-5 rounded-3xl outline-none font-bold text-sm"
                required
                onChange={(e) => setFormData({...formData, student: e.target.value})}
               >
                 <option value="">Sélectionner l'étudiant...</option>
                 {studentOptions.map(s => <option key={s.id} value={s.id}>{s.full_name}</option>)}
               </select>
               <input 
                type="number" 
                className="w-full bg-slate-50 p-5 rounded-3xl font-black text-indigo-600 outline-none"
                placeholder="Montant BIF"
                onChange={(e) => setFormData({...formData, promised_amount: e.target.value})}
               />
               <input 
                type="date" 
                className="w-full bg-slate-50 p-5 rounded-3xl font-bold outline-none"
                onChange={(e) => setFormData({...formData, promised_date: e.target.value})}
               />
               <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-4xl font-black uppercase tracking-widest text-[10px]">
                 Confirmer l'engagement
               </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SOUS-COMPOSANTS ---

type StatColor = "indigo" | "rose" | "emerald";

function StatCard({ label, value, color, icon }: { label: string; value: number | string; color: StatColor; icon: ReactNode }) {
  const themes: Record<StatColor, string> = {
    indigo: "text-indigo-600 bg-indigo-50",
    rose: "text-rose-600 bg-rose-50",
    emerald: "text-emerald-600 bg-emerald-50"
  };
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${themes[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; style: string }> = {
    pending: { label: "En attente", style: "bg-amber-50 text-amber-600 border-amber-100" },
    kept: { label: "Respectée", style: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    broken: { label: "Rupture", style: "bg-rose-50 text-rose-600 border-rose-100" }
  };
  const active = config[status] || config.pending;
  return <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase border ${active.style}`}>{active.label}</span>;
}

function ActionButton({ icon, color, onClick }: { icon: ReactNode; color: "emerald" | "rose"; onClick: () => void }) {
  const styles: Record<"emerald" | "rose", string> = {
    emerald: "text-emerald-500 hover:bg-emerald-50 border-emerald-100",
    rose: "text-rose-500 hover:bg-rose-50 border-rose-100"
  };
  return <button onClick={onClick} className={`p-3 bg-white border-2 rounded-xl transition-all active:scale-90 ${styles[color]}`}>{icon}</button>;
}