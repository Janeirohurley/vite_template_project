import { getListApi } from "@/api/getListApi";
import type { QueryParams } from "@/types";
import paymentinstallmentAxios from "./paymentinstallmentAxios";
import type { PaymentInstallement } from "../types/paymentinstallement";

/**
 * Récupérer la liste des échelons de paiement avec progression
 * Utilise le wrapper standard getListApi pour la pagination et le filtrage
 */
export const getPaymentInstallmentsApi = (params?: QueryParams) => 
    getListApi<PaymentInstallement>(paymentinstallmentAxios, "payment-installements/", params);

/**
 * Récupérer le détail d'un échelon spécifique
 */
export const getPaymentInstallmentDetailApi = async (id: string): Promise<PaymentInstallement> => {
    return (await paymentinstallmentAxios.get(`payment-installements/${id}/`)).data;
};

/**
 * Note: Si vous avez besoin de mettre à jour manuellement un statut 
 * (par exemple forcer le passage de 'pending' à 'paid')
 */
export const updateInstallmentStatusApi = async (id: string, status: 'pending' | 'paid') => {
    return (await paymentinstallmentAxios.patch(`payment-installements/${id}/`, { status })).data;
};