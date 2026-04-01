import { motion } from 'framer-motion'
import ums from "@/assets/ums.png"

export interface LoadingSpinnerProps {
    /**
     * Titre principal affiché pendant le chargement
     * @default "Chargement en cours..."
     */
    title?: string
    /**
     * Message de description affiché sous le titre
     * @default "Veuillez patienter pendant que nous chargons vos données"
     */
    message?: string
    /**
     * Taille du spinner
     * @default "md"
     */
    size?: 'sm' | 'md' | 'lg'
    /**
     * Si true, utilise toute la hauteur de l'écran
     * @default true
     */
    fullScreen?: boolean
    /**
     * Si true, affiche les points animés
     * @default true
     */
    showDots?: boolean
}

const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
}

export function LoadingSpinner({
    title = 'Chargement en cours...',
    message = 'Veuillez patienter pendant que nous chargeons vos données',
    size = 'md',
    fullScreen = true,
    showDots = true,
}: LoadingSpinnerProps = {}) {
    return (
        <div className={`bg-white dark:bg-gray-900 flex items-center justify-center ${fullScreen ? 'min-h-screen' : 'py-12'}`}>
            <div className="text-center space-y-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center flex-col items-center "
                >
                <motion.img src={ums} alt="ums" className='w-35 h-35'
                
                />
                    <div className={`relative ${sizeClasses[size]}`}>
                  
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-4 border-blue-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-500 rounded-full"
                        />
                    </div>
                </motion.div>

                {(title || message) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {title && (
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {title}
                            </h2>
                        )}
                        {message && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                {message}
                            </p>
                        )}
                    </motion.div>
                )}

                {/* Points animés */}
                {showDots && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex justify-center space-x-2"
                    >
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{
                                    y: [0, -10, 0],
                                }}
                                transition={{
                                    duration: 0.6,
                                    repeat: Infinity,
                                    delay: i * 0.2,
                                }}
                                className="w-2 h-2 bg-blue-600 dark:bg-blue-500 rounded-full"
                            />
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    )
}
