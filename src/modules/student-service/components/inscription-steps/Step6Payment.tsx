
import { useMemo, useState } from 'react';
import type { InscriptionStepProps } from '../../../../types/inscription.d';
import { notify } from '../../../../lib';
import { PaymentModal } from '@/modules/finance/components/PaymentModal';
import { DebugDisplay } from '@/components/common/DebugDisplay';
import { usePaymentsByInscription } from '@/modules/finance/hooks/usePayments';

export function Step6Payment({ data, onNext, onPrevious, onAutoSave }: InscriptionStepProps) {
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const inscriptionId = data.step6?.inscription_id || data.step5?.inscription_id;

  const { data: paymentsData, isLoading: isPaymentStatusLoading, refetch: refetchInscriptionPayments } = usePaymentsByInscription(inscriptionId);

  const inscriptionPayments = useMemo(() => paymentsData?.results ?? [], [paymentsData?.results]);

  const paymentStatus = useMemo(() => {
    if (!inscriptionId) return 'non_paye';
    if (inscriptionPayments.length === 0) return 'non_paye';

    const hasVerified = inscriptionPayments.some((payment) => payment?.payment_status === 'verified');
    if (hasVerified) return 'paye';

    return 'en_attente';
  }, [inscriptionId, inscriptionPayments]);

  const handleFinalize = () => {
    if (!inscriptionId) {
      notify.error("Inscription introuvable. Veuillez revenir à l'étape précédente.");
      return;
    }

    onAutoSave?.({ inscription_id: inscriptionId, payment_status: paymentStatus });
    onNext({ completed: true, inscription_id: inscriptionId, payment_status: paymentStatus });
  };

  return (
    <div className="space-y-6">
        <DebugDisplay
        title='vour les donne de payement recuperer par id d inscription'
              data={inscriptionPayments}
        />
      <div>
        <h3 className="text-lg font-semibold mb-4">Frais d'inscription</h3>

        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/40 p-5 shadow-sm space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">Paiement des frais</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Enregistrez le paiement des frais d'inscription avant de finaliser.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/40">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Statut paiement : {
                !inscriptionId
                  ? 'Inscription non encore créée'
                  : isPaymentStatusLoading
                    ? 'Vérification en cours...'
                    : paymentStatus === 'paye'
                      ? 'Payé'
                      : paymentStatus === 'en_attente'
                        ? 'Paiement en attente'
                        : 'Non payé'
              }
            </p>
          </div>

          <button
            type="button"
            onClick={() => setPaymentModalOpen(true)}
            disabled={!inscriptionId}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {paymentStatus === 'paye' ? 'Voir / Ajouter paiement' : 'Payer les frais'}
          </button>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onPrevious}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Précédent
        </button>
        <button
          type="button"
          onClick={handleFinalize}
          disabled={!inscriptionId}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          Finaliser l'inscription
        </button>
      </div>

      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Nouveau paiement des frais d'inscription"
        lockedInscriptionId={inscriptionId}
        onSuccess={() => {
          void refetchInscriptionPayments();
        }}
      />
    </div>
  );
}
