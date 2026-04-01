import { useEffect, type ReactNode } from 'react'
import Navbar from '@/components/ui/Navbar'
import { useAuthStore } from '@/modules/auth/store/authStore'
import { useNavigate } from '@tanstack/react-router'
import { Home, Users, BookOpen, BarChart3, FileText } from 'lucide-react'
import { useThemeStore } from '@/lib/themeStore'

interface GlobalLayoutProps {
    children: ReactNode
}

export function GlobalLayout({ children }: GlobalLayoutProps) {
    const { user, logout, isAuthenticated } = useAuthStore()
    const navigate = useNavigate()
    const applyTokens = useThemeStore((s) => s.applyTokens);

    useEffect(() => {
        applyTokens();
    }, []);

    const handleLogout = () => {
        logout()
        navigate({ to: '/auth/login' })
    }

    // Navigation items basée sur le rôle
    const getNavItems = () => {
        if (!user) return []

        const baseItems = [
            { label: "Accueil", href: "/", icon: <Home className="w-4 h-4" />, active: true },
        ]

        switch (user.role.name) {
            case 'admin':
                return [
                    ...baseItems,
                    { label: "Utilisateurs", href: "/admin/users", icon: <Users className="w-4 h-4" /> },
                    { label: "Cours", href: "/admin/courses", icon: <BookOpen className="w-4 h-4" /> },
                    { label: "Étudiants", href: "/admin/students", icon: <Users className="w-4 h-4" /> },
                    { label: "Enseignants", href: "/admin/teachers", icon: <Users className="w-4 h-4" /> },
                ]
            case 'teacher':
                return [
                    ...baseItems,
                    { label: "Mes Cours", href: "/teacher/courses", icon: <BookOpen className="w-4 h-4" /> },
                    { label: "Résultats", href: "/teacher/results", icon: <BarChart3 className="w-4 h-4" /> },
                ]
            case 'student':
                return [
                    ...baseItems,
                    { label: "Cours", href: "/student/courses", icon: <BookOpen className="w-4 h-4" /> },
                    { label: "Résultats", href: "/student/results", icon: <BarChart3 className="w-4 h-4" /> },
                    { label: "Documents", href: "/student/documents", icon: <FileText className="w-4 h-4" /> },
                ]
            default:
                return baseItems
        }
    }

    if (!isAuthenticated || !user) {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar
                logoText="UPG"
                title="Université Polytechnique"
                subtitle="de Gitega"
                navItems={getNavItems()}
                profileName={`${user.first_name} ${user.last_name}`}
                profileRole={user.role.name === 'admin' ? 'Administrateur' :
                    user.role.name === 'teacher' ? 'Enseignant' : 'Étudiant'}
                profileEmail={user.email}
                onLogout={handleLogout}
            />
            <main className="pt-16">
                {children}
            </main>
        </div>
    )
}
