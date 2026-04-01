import { createFileRoute } from '@tanstack/react-router';
import { ReportsPage } from '@/modules/student-service';

export const Route = createFileRoute('/student-service/reports')({
  component: ReportsPage,
});
