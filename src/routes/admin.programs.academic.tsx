import { AcademicYearManagement } from '@/modules/admin/pages/AcademicYearManagemnet'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/programs/academic')({
    
    component: AcademicYearManagement,
})

