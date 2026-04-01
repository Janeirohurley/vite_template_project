import { useMemo, useEffect, useState } from "react";
import { usePayments } from "./usePayments";
import { useFeesSheets } from "./useFeesSheets";
import { useWording } from "./useWording";
import { usePaymentPlans } from "./usePaymentPlans";
import { useInstallments } from "./useInstallments";

export function useFinanceAnalytics() {
  // État pour suivre le chargement et les erreurs
  const [loadingState, setLoadingState] = useState({
    isLoading: true,
    error: null
  });

  // Utilisation des hooks existants avec gestion d'erreur
  const { 
    payments = [], 
    loading: paymentsLoading, 
    error: paymentsError 
  } = usePayments() || {};

  const { 
    faculties = [], 
    loading: feesLoading, 
    error: feesError 
  } = useFeesSheets() || {};

  const { 
    wordings = [], 
    loading: wordingsLoading, 
    error: wordingsError 
  } = useWording() || {};

  const { 
    paymentPlans = [], 
    loading: plansLoading, 
    error: plansError 
  } = usePaymentPlans() || {};

  const { 
    installments = [], 
    loading: installmentsLoading, 
    error: installmentsError 
  } = useInstallments() || {};

  // Vérifier les erreurs
  useEffect(() => {
    const error = paymentsError || feesError || wordingsError || plansError || installmentsError;
    if (error) {
      console.error('Erreur de chargement des données:', error);
      setLoadingState({
        isLoading: false,
        error: error.message || 'Erreur lors du chargement des données'
      });
    }
  }, [paymentsError, feesError, wordingsError, plansError, installmentsError]);

  const isLoading = paymentsLoading || feesLoading || wordingsLoading || 
                   plansLoading || installmentsLoading;

  const stats = useMemo(() => {
    console.log('Recalcul des statistiques...');
    console.log('Payments:', payments?.length);
    console.log('Payment Plans:', paymentPlans?.length);
    console.log('Wordings:', wordings?.length);
    console.log('Installments:', installments?.length);

    if (isLoading) {
      console.log('Chargement en cours...');
      return null;
    }

    if (!payments || !paymentPlans || !wordings || !installments) {
      console.error('Données manquantes pour le calcul des statistiques');
      return null;
    }

    try {
      // 1. KPI Financiers
      const totalCollected = payments.reduce((acc, p) => acc + (Number(p.amount_paid) || 0), 0);
      const totalExpected = paymentPlans.reduce((acc, plan) => {
        return acc + (Number(plan.total_amount) || 0);
      }, 0);
      
      const totalDebt = Math.max(0, totalExpected - totalCollected);
      const recoveryRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;

      // 2. Dernières transactions
      const recentTransactions = [...payments]
          .sort((a, b) => new Date(b.payment_date || 0) - new Date(a.payment_date || 0))
        .slice(0, 5)
        .map(payment => ({
          id: payment.id,
          studentName: payment.student_name || 'Étudiant inconnu',
          amount: Number(payment.amount_paid) || 0,
          date: payment.payment_date,
          status: payment.status || 'completed',
          method: payment.payment_method || 'Non spécifié'
        }));

      // 3. Flux Mensuel (6 derniers mois)
      const monthlyFlow = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const month = d.toLocaleString('fr-FR', { month: 'short' }).toUpperCase();
        const year = d.getFullYear();
        const monthYear = `${month} ${year}`;
        
        const total = payments
          .filter(p => {
            try {
              const paymentDate = new Date(p.payment_date || 0);
              return paymentDate.getMonth() === d.getMonth() && 
                     paymentDate.getFullYear() === d.getFullYear();
            } catch (e) {
              console.error('Erreur de format de date:', e);
              return false;
            }
          })
          .reduce((sum, p) => sum + (Number(p.amount_paid) || 0), 0);
        
        return { month: monthYear, total };
      }).reverse();

      // 4. Alertes
      const alerts = [
        ...(installments || [])
          .filter(inst => inst.status === 'overdue')
          .map(inst => ({
            title: 'Paiement en retard',
            description: `Le paiement de ${inst.amount || 0} BIF est en retard`,
            date: inst.due_date,
            severity: 'high'
          })),
        ...((payments?.length === 0) ? [{
          title: 'Aucune transaction récente',
          description: 'Aucune transaction enregistrée cette semaine',
          severity: 'medium'
        }] : [])
      ];

      // 5. Méthodes de paiement
      const paymentMethods = [
        { method: 'Depot Bancaire', amount: payments.filter(p => p.payment_method === 'bank_deposit').reduce((a, p) => a + (Number(p.amount_paid) || 0), 0) },
        { method: 'Virement', amount: payments.filter(p => p.payment_method === 'bank_transfert').reduce((a, p) => a + (Number(p.amount_paid) || 0), 0) },
        { method: 'Cheque', amount: payments.filter(p => p.payment_method === 'bank_check').reduce((a, p) => a + (Number(p.amount_paid) || 0), 0) },
        { method: 'Mobile Money', amount: payments.filter(p => p.payment_method === 'mobile_money').reduce((a, p) => a + (Number(p.amount_paid) || 0), 0) },
        { method: 'Autre', amount: payments.filter(p => p.payment_method === 'other').reduce((a, p) => a + (Number(p.amount_paid) || 0), 0) }
      ].filter(m => m.amount > 0);

      // 6. Performance par type de frais
      const wordingPerformance = (wordings || []).map(w => {
        const amount = (payments || [])
          .filter(p => p.wording_id === w.id)
          .reduce((sum, p) => sum + (Number(p.amount_paid) || 0), 0);
        return { name: w.name || 'Sans libellé', amount };
      }).sort((a, b) => b.amount - a.amount);

      return {
        // KPI
        totalCollected,
        totalExpected,
        totalDebt,
        recoveryRate,
        currentMonthPayments: monthlyFlow[monthlyFlow.length - 1]?.total || 0,
        pendingPayments: (installments || [])
          .filter(i => i.status === 'pending')
          .reduce((a, i) => a + (Number(i.amount) || 0), 0),
        
        // Données pour les graphiques
        monthlyFlow,
        paymentMethods,
        wordingPerformance,
        
        // Listes
        recentTransactions,
        alerts,
        
        // Compteurs
        counts: {
          students: [...new Set(payments.map(p => p.student_id).filter(Boolean))].length,
          payments: payments.length,
          pending: (installments || []).filter(i => i.status === 'pending').length,
          overdue: (installments || []).filter(i => i.status === 'overdue').length
        }
      };
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
      setLoadingState(prev => ({
        ...prev,
        error: 'Erreur lors du traitement des données'
      }));
      return null;
    }
  }, [payments, paymentPlans, wordings, installments, isLoading]);

  return { 
    stats, 
    isLoading: loadingState.isLoading || isLoading,
    error: loadingState.error,
    refetch: () => {
      // Implémentez la logique de rafraîchissement ici si nécessaire
      console.log('Rafraîchissement des données...');
    }
  };
}
