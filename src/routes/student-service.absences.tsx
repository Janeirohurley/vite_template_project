import { createFileRoute } from '@tanstack/react-router';
import { AbsencesPage } from '@/modules/student-service';

export const Route = createFileRoute('/student-service/absences')({
  component: AbsencesPage,
});
