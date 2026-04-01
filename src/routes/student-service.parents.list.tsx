import { ParentsPage } from '@/modules/student-service/pages/ParentsPage'
import { createFileRoute } from '@tanstack/react-router'

// On définit une interface pour le typage (optionnel mais recommandé)
interface ParentsSearch {
  studentId?: string
}

export const Route = createFileRoute('/student-service/parents/list')({
  // C'est cette fonction qui permet de "recevoir" le paramètre
  validateSearch: (search: Record<string, unknown>): ParentsSearch => {
    return {
      studentId: search.studentId as string | undefined,
    }
  },
  component: ParentsPage,
})