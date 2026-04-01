/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import {
  Users, CheckCircle, RotateCcw, Eye, Search,
  AlertCircle, X, Calendar, CreditCard
} from "lucide-react";
import { usePaymentInstallments } from "../hooks/useInstallments";
import { useClasses, useDepartments, useFaculties } from "@/modules/admin/hooks/useAcademicEntities";
import { useAppStore } from "@/lib";
import { SingleSelectDropdown } from "@/components/ui/SingleSelectDropdown";
import DataTable from "@/components/ui/DataTable";
import StatsGridLoader from "@/components/ui/StatsGridLoader";
import { StatsCard } from "@/modules/doyen";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/modules/admin/components/PageHeader";
import { Button } from "@/components/ui/button";

// --- Interfaces ---
interface StudentProgress {
  id: string;
  student: any;
  class_info: any;
  total_due: number;
  total_paid: number;
  remaining: number;
  is_overdue: boolean;
  tranches_details: any[]; // Historique complet
  progress: string;
  status: string;
}

export default function PaymentsProgressPage() {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [classId, setClassId] = useState("");

  // État pour le panneau de détails
  const [selectedStudent, setSelectedStudent] = useState<StudentProgress | null>(null);

  const { selectedAcademicYear } = useAppStore();

  const filters = useMemo(() => ({
    academic_year_id: selectedAcademicYear?.id,
    page: currentPage,
    page_size: itemsPerPage,
    search,
    faculty_fk: facultyId,
    department_fk: departmentId,
    class_fk: classId,
  }), [selectedAcademicYear, currentPage, itemsPerPage, search, facultyId, departmentId, classId]);

  const { data: installmentsData, loading } = usePaymentInstallments(filters);
  const installments = useMemo(() => installmentsData?.results || [], [installmentsData?.results]);
  const totalCount = useMemo(() => installmentsData?.count || 0, [installmentsData?.count]);

  const { data: faculties } = useFaculties({ pagination: false });
  const { data: departments } = useDepartments({ pagination: false, faculty_id: facultyId });
  const { data: classes } = useClasses({ pagination: false, department_id: departmentId });

  // --- Logique de regroupement ---
  const consolidatedData = useMemo(() => {
    const studentMap: Record<string, StudentProgress> = {};

    installments.forEach((item) => {
      const studentId = item.student?.id;
      if (!studentId) return;

      if (!studentMap[studentId]) {
        studentMap[studentId] = {
          id: studentId,
          student: item.student,
          class_info: item.class_info,
          total_due: 0,
          total_paid: 0,
          remaining: 0,
          is_overdue: false,
          tranches_details: [],
          progress: "0",
          status: ""
        };
      }

      studentMap[studentId].total_due += Number(item.financial_info?.amount || 0);
      studentMap[studentId].total_paid += Number(item.financial_info?.paid_amount || 0);
      studentMap[studentId].tranches_details.push(item);

      if (item.status_info?.is_overdue) studentMap[studentId].is_overdue = true;
    });

    return Object.values(studentMap).map(s => {
      const ratio = s.total_due > 0 ? (s.total_paid / s.total_due) : 0;
      return {
        ...s,
        progress: (ratio * 100).toFixed(1),
        remaining: s.total_due - s.total_paid,
        status: ratio >= 1 ? "Soldé" : s.is_overdue ? "En Retard" : "En cours"
      };
    });
  }, [installments]);

  const statsData = useMemo(() => [
    { label: "Étudiants", value: String(consolidatedData.length), icon: Users, color: "blue" as const },
    { label: "Recouvré", value: `${consolidatedData.reduce((acc, c) => acc + c.total_paid, 0).toLocaleString()} Fbu`, icon: CheckCircle, color: "emerald" as const },
    { label: "Alertes", value: String(consolidatedData.filter(s => s.is_overdue).length), icon: AlertCircle, color: "red" as const },
  ], [consolidatedData]);

  return (
    <div>

      <PageHeader
        title="Recouvrement Consolidé"
        description="Référentiel financier par étudiant"
        rightElement={
          <Button onClick={() => { setFacultyId(""); setDepartmentId(""); setClassId(""); setSearch(""); }} className="bg-blue-600 hover:bg-blue-700">
            <RotateCcw size={14} /> Réinitialiser
          </Button>
        }
      />

      <div className="mb-8">
        <StatsGridLoader isPending={loading} data={statsData} renderItem={(s, i) => <StatsCard key={i} {...s} />} />
      </div>

      {/* Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-bg-card p-4 rounded-md border border-slate-200 dark:border-gray-500  items-end">
        <SingleSelectDropdown label="Faculté" value={facultyId} onChange={(v) => { setFacultyId(v); setDepartmentId(""); setClassId(""); }} options={faculties?.results?.map((f: any) => ({ id: f.id, label: f.faculty_name, value: f.id })) || []} />
        <SingleSelectDropdown label="Département" value={departmentId} onChange={(v) => { setDepartmentId(v); setClassId(""); }} disabled={!facultyId} options={departments?.results?.map((d: any) => ({ id: d.id, label: d.department_name, value: d.id })) || []} />
        <SingleSelectDropdown label="Classe" value={classId} onChange={(v) => setClassId(v)} disabled={!departmentId} options={classes?.results?.map((c: any) => ({ id: c.id, label: c.class_name, value: c.id })) || []} />
        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={14} />
          <Input type="text" placeholder="Rechercher étudiant..." className="w-full h-10 pl-9 pr-4 text-xs border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-blue-500" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>


      <DataTable
        tableId="payments-consolidated"
        data={{
          results: consolidatedData,
          count: totalCount,
          next: null,
          previous: null,
          current_page: currentPage,
          total_pages: Math.max(1, Math.ceil((totalCount || 0) / itemsPerPage)),
        }}
        isLoading={loading}
        getRowId={(r) => r.id}
        isPaginated={true}
        onSearchChange={setSearch}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        columns={[
          {
            key: "student",
            label: "Étudiant",
            render: (row: StudentProgress) => (
              <div className="flex flex-col py-1">
                <span className="font-semibold  text-[11px] uppercase leading-none">{row.student?.name}</span>
                <span className="text-[10px]  font-mono mt-1 font-bold">{row.student?.matricule}</span>
              </div>
            )
          },
          {
            key: "progress",
            label: "État du Recouvrement",
            render: (row: StudentProgress) => (
              <div className="w-full max-w-[140px]">
                <div className="flex justify-between items-end mb-1 text-[9px] font-black uppercase">
                  <span className={Number(row.progress) >= 100 ? 'text-emerald-600' : ''}>{row.progress}%</span>
                  <span className="text-slate-400 font-normal">{row.remaining.toLocaleString()} Fbu rest.</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                  <div className={`h-full transition-all duration-700 ${Number(row.progress) >= 100 ? 'bg-emerald-500' : row.is_overdue ? 'bg-rose-500 animate-pulse' : 'bg-blue-600'}`} style={{ width: `${Math.min(Number(row.progress), 100)}%` }} />
                </div>
              </div>
            )
          },
          {
            key: "amounts",
            label: "Finances",
            render: (row: StudentProgress) => (
              <div className="flex flex-col">
                <span className="text-[11px] font-bold">{row.total_paid.toLocaleString()} Fbu</span>
                <span className="text-[9px] text-slate-400">sur {row.total_due.toLocaleString()}</span>
              </div>
            )
          },
          {
            key: "status",
            label: "Statut",
            render: (row: StudentProgress) => (
              <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase border flex items-center gap-1.5 w-fit ${row.status === 'Soldé' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                row.status === 'En Retard' ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-amber-50 border-amber-200 text-amber-700'
                }`}>
                <span className={`w-1 h-1 rounded-md ${row.status === 'Soldé' ? 'bg-emerald-500' : row.status === 'En Retard' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                {row.status}
              </span>
            )
          },
          {
            key: "actions",
            label: "Action",
            render: (row: StudentProgress) => (
              <button
                onClick={() => setSelectedStudent(row)}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
              >
                <Eye size={16} />
              </button>
            )
          }
        ]}
      />


      {/* --- PANNEAU HISTORIQUE (DRAWER) --- */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-md bg-white h-screen shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

            {/* Header Drawer */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
              <div>
                <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{selectedStudent.student?.name}</h2>
                <p className="text-xs text-blue-600 font-mono font-bold uppercase">{selectedStudent.student?.matricule}</p>
                <div className="mt-2 flex flex-col gap-0.5">
                  <span className="text-[10px] text-slate-500 font-medium ">{selectedStudent.class_info?.faculty}</span>
                  <span className="text-[10px] text-slate-400">{selectedStudent.class_info?.department} — {selectedStudent.class_info?.name}</span>
                </div>
              </div>
              <button onClick={() => setSelectedStudent(null)} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
                <X size={20} />
              </button>
            </div>

            {/* Content Drawer */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* Résumé rapide dans le drawer */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-[9px] text-blue-600 font-black uppercase mb-1">Total Payé</p>
                  <p className="text-sm font-bold text-blue-900">{selectedStudent.total_paid.toLocaleString()} Fbu</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="text-[9px] text-amber-600 font-black uppercase mb-1">Reste à payer</p>
                  <p className="text-sm font-bold text-amber-900">{selectedStudent.remaining.toLocaleString()} Fbu</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Calendar size={14} /> Historique des Échéances
                </h3>

                {/* Liste des plans détaillés */}
                <div className="space-y-3">
                  {selectedStudent.tranches_details.map((tranche, idx) => (
                    <div key={idx} className="relative pl-4 border-l-2 border-slate-100 py-1 hover:border-blue-500 transition-colors group">
                      <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-slate-200 group-hover:bg-blue-500 transition-colors" />

                      <div className="bg-white border border-slate-100 p-3 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-[10px] font-black text-slate-800 uppercase">{tranche.payment_plan?.wording}</span>
                            <p className="text-[9px] text-slate-400  font-medium">{tranche.payment_plan?.description}</p>
                          </div>
                          <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase ${tranche.status_info?.status === 'paid' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'
                            }`}>
                            {tranche.status_info?.status_display}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-3 text-[10px]">
                          <div className="flex items-center gap-1 text-slate-500 font-medium">
                            <CreditCard size={12} />
                            <span>{tranche.financial_info?.paid_amount.toLocaleString()} / {tranche.financial_info?.amount.toLocaleString()} Fbu</span>
                          </div>
                          <div className="text-right">
                            <p className="text-slate-400 font-medium text-[8px]">Échéance :</p>
                            <p className="font-bold ">{tranche.dates?.due_date || 'N/A'}</p>
                          </div>
                        </div>

                        {/* Petite barre de progression interne par tranche */}
                        <div className="mt-3 h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${tranche.financial_info?.completion_percentage}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Drawer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => setSelectedStudent(null)}
                className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                Fermer la vue détaillée
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}