import { createFileRoute } from '@tanstack/react-router';
import { DashboardPage } from '@/modules/student-service';

export const Route = createFileRoute('/student-service/dashboard')({
  component: DashboardPage,
});
