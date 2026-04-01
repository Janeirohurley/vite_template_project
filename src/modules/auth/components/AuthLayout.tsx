import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'


interface AuthLayoutProps {
    children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
    const {t} = useTranslation()
    const copyRight = `© ${new Date().getFullYear() - 1} Université Polytechnique de Gitega. Tous droits réservés.`
    return (
        <motion.div
            initial={{ scale: 0.95, y: 30, rotate: -1 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="min-h-screen bg-linear-to-br from-blue-900 via-blue-500 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center"
        >
         

            <motion.div
                initial={{ scale: 0.95, y: 40 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="w-full max-w-md"
            >
                {/* En-tête */}
                <motion.div
                    initial={{ y: -30, scale: 0.95 }}
                    animate={{ y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                    className="text-center mb-8"
                >
                    <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <span className="text-blue-900 dark:text-blue-400 font-bold text-2xl">UPG</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white dark:text-gray-100 mb-2">
                        {t("login_keys.headerLoginSalutation")}
                    </h1>
                    {/* <p className="text-blue-100 dark:text-gray-300">de Gitega</p> */}
                </motion.div>

                {/* Contenu principal */}
                <motion.div
                    initial={{ y: 20, scale: 0.98 }}
                    animate={{ y: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                    className="bg-white/95 dark:bg-gray-800/90 w-[90%] mx-auto rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-sm"
                >
                    {children}
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ y: 10 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                    className="text-center mt-6"
                >
                    <p className="text-blue-100 dark:text-gray-400 text-sm">
                       {copyRight}
                    </p>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}
