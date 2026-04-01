
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/programs')({
  component: ProgrammWrapper,
})

function ProgrammWrapper() {
  return (
    <Outlet />
  );
}
