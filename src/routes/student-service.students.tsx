import { createFileRoute } from '@tanstack/react-router';
import { StudentsPage } from '@/modules/student-service';

export const Route = createFileRoute('/student-service/students')({
  component: StudentsPage,
});
