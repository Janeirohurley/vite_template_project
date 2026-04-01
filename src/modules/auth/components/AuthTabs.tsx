import { Link } from '@tanstack/react-router'

interface AuthTabsProps {
    active: 'login' | 'register'
}

export function AuthTabs({ active }: AuthTabsProps) {
    return (
        <div className="flex mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <Link
                to="/auth/login"
                className={`
          flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 text-center
          ${active === 'login'
                        ? 'bg-white dark:bg-gray-700 text-[#0047AB] dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-[#0047AB] dark:hover:text-blue-400'
                    }
        `}
            >
                Connexion
            </Link>
            <Link
                to="/auth/register"
                className={`
          flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 text-center
          ${active === 'register'
                        ? 'bg-white dark:bg-gray-700 text-[#0047AB] dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-[#0047AB] dark:hover:text-blue-400'
                    }
        `}
            >
                Inscription
            </Link>
        </div>
    )
}
