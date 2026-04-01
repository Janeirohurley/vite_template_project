import { createFileRoute } from '@tanstack/react-router';
import { ClubsPage } from '@/modules/student-service';

export const Route = createFileRoute('/student-service/clubs')({
  component: ClubsPage,
});
