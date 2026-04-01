import { createFileRoute } from '@tanstack/react-router';
import { OrientationPage } from '@/modules/student-service';

export const Route = createFileRoute('/student-service/orientation')({
  component: OrientationPage,
});
