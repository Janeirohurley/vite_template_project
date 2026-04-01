import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  createPaymentPromiseApi,
  fetchPaymentPromisesApi,
  fetchStudentPromiseOptionsApi,
  updatePaymentPromiseStatusApi,
} from "../api/paymentPromises";
import type {
  EnrichedPaymentPromise,
  CreatePaymentPromisePayload,
  PaymentPromiseStatus,
  StudentInfo,
} from "../types/paymentPromise";
import type { QueryParams } from "@/types";

export function usePaymentPromises(params?: QueryParams) {
  const queryClient = useQueryClient();

  // 1️⃣ Inscriptions (cache long)
  const inscriptionsQuery = useQuery({
    queryKey: ["inscriptions"],
    queryFn: fetchStudentPromiseOptionsApi,
    staleTime: 1000 * 60 * 30, // 30 min
  });

  // 2️⃣ Map rapide des étudiants
  const studentMap = useMemo(() => {
    const map = new Map<string, StudentInfo>();
    inscriptionsQuery.data?.forEach((s) => map.set(s.id, s));
    return map;
  }, [inscriptionsQuery.data]);

  // 3️⃣ Promesses (brutes)
  const promisesQuery = useQuery({
    queryKey: ["payment-promises", params],
    queryFn: () => fetchPaymentPromisesApi(params),
  });

  // 4️⃣ Promesses enrichies (sécurisé)
  const enrichedPromises = useMemo<EnrichedPaymentPromise[]>(() => {
    return (promisesQuery.data?.results ?? []).map((p) => ({
      ...p,
      student_detail:
        studentMap.get(p.student) || {
          id: p.student,
          full_name: "INCONNU",
          matricule: "N/A",
        },
    }));
  }, [promisesQuery.data?.results, studentMap]);

  // 5️⃣ Mutations
  const createPromise = useMutation({
    mutationFn: (payload: CreatePaymentPromisePayload) =>
      createPaymentPromiseApi(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["payment-promises"] }),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: PaymentPromiseStatus }) =>
      updatePaymentPromiseStatusApi(id, status),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["payment-promises"] }),
  });

  return {
    promises: enrichedPromises,
    studentOptions: inscriptionsQuery.data ?? [],
    loading: promisesQuery.isLoading || inscriptionsQuery.isLoading,
    isRefetching: promisesQuery.isRefetching,
    createPromise,
    updateStatus,
    studentMap,
  };
}
