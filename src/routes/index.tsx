import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { AuthNetworkError } from '@/components/AuthNetworkError';
import GenericErrorComponent from '@/components/ui/GenericErrorComponent';
import { useEffect } from 'react';

function IndexRoute() {
  const navigate = useNavigate();
  const { user, authStatus } = useAuthStore();

  useEffect(() => {
    if (authStatus === "authenticated" && user) {
      switch (user.role?.name) {
        case 'admin':
        case 'super_admin':
          navigate({ to: '/admin/dashboard', replace: true });
          return;
        case 'student_service':
          navigate({ to: '/student-service/dashboard', replace: true });
          return;
        case 'teacher':
          navigate({ to: '/teacher/dashboard', replace: true });
          return;
        case 'student':
          navigate({ to: '/student/dashboard', replace: true });
          return;
        case 'dean':
          navigate({ to: '/dean', replace: true });
          return;
        case 'director_academic':
          navigate({ to: '/director-academic', replace: true });
          return;
        case 'finance_service':
          navigate({ to: '/finance/dashbord', replace: true });
          return;
        case 'guest':
          navigate({ to: '/guest/dashboard', replace: true });
          return;
        default:
          navigate({ to: '/development', replace: true });
          return;
      }
    }

    if (authStatus === "unauthenticated") {
      navigate({ to: '/auth/login', replace: true });
    }
  }, [authStatus, user, navigate]);

  if (authStatus === "degraded") {
    return <AuthNetworkError />;
  }

  return <LoadingSpinner />;
}

// Route principale
export const Route = createFileRoute('/')({
  component: IndexRoute,
  errorComponent: GenericErrorComponent,
});
