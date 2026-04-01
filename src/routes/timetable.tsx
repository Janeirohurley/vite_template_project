

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/timetable')({
    component: () => {
        return <div>Timetable Page</div>
    },
})

