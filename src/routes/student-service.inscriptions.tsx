import { createFileRoute } from '@tanstack/react-router';
import { InscriptionsPage } from '@/modules/student-service';

export const Route = createFileRoute('/student-service/inscriptions')({
  component: InscriptionsPage,
});
