import { createFileRoute } from '@tanstack/react-router';
import { DocumentsPage } from '@/modules/student-service';

export const Route = createFileRoute('/student-service/documents')({
  component: DocumentsPage,
});
