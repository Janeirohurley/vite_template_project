import { getListApi } from "@/api/getListApi";

import type { QueryParams } from "@/types";

import paymentAxios from "./paymentAxios";
import type { BankInfo, Payment, PaymentStatus } from "../types/payment";

// Récupérer la liste des paiements (avec votre wrapper standard)
export const getPaymentsApi = (params?: QueryParams) => 
    getListApi<Payment>(paymentAxios, "payments/", params);

//recuperation les payement par inscription id

// Récupérer la liste des paiements par inscription_id
export const getPaymentsByInscriptionId = (inscriptionId: string) =>
    getListApi<Payment>(paymentAxios, `payments/by-inscription/${inscriptionId}/`);

// Valider ou rejeter un paiement (Action spécifique souvent nécessaire en finance)
export const updatePaymentStatusApi = async (id: string, status: PaymentStatus) => {
    return (await paymentAxios.patch(`payments/${id}/`, { payment_status: status })).data;
};

// Récupérer un paiement unique
export const getPaymentDetailApi = async (id: string): Promise<Payment> => {
    return (await paymentAxios.get(`payments/${id}/`)).data;
};

//get bank payemnts

export const geBankPayments = (params?: QueryParams) => getListApi<BankInfo>(paymentAxios,"banks/",params)