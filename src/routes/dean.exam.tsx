import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dean/exam')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='h-full w-full flex justify-center items-center font-bold text-3xl'>
    <div>
      En cours de construction
    </div>
  </div>
}
