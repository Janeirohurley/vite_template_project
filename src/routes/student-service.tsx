import { createFileRoute, Outlet } from '@tanstack/react-router';
import { StudentServiceLayout } from '@/modules/student-service';

export const Route = createFileRoute('/student-service')({
  component: StudentServiceLayoutWrapper,
});

function StudentServiceLayoutWrapper() {
  return (
    <StudentServiceLayout>
      <Outlet />
    </StudentServiceLayout>
  );
}
