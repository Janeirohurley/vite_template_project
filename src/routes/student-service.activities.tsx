import { createFileRoute } from '@tanstack/react-router';
import { ActivitiesPage } from '@/modules/student-service';

export const Route = createFileRoute('/student-service/activities')({
  component: ActivitiesPage,
});
