import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/student-service/')({
  component: () => <Navigate to="/student-service/dashboard" />,
});
