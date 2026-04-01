import { createFileRoute } from '@tanstack/react-router';
import { ScholarshipsPage } from '@/modules/student-service';

export const Route = createFileRoute('/student-service/scholarships')({
  component: ScholarshipsPage,
});
